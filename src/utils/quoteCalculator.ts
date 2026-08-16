import {
  QuoteCalculationInput,
  QuoteResult,
  QuoteBreakdownItem,
  RecommendedEquipment,
  PricingConfig,
  ServiceItem,
  Branch,
  Coupon
} from '../types';

export function calculateQuote(
  input: QuoteCalculationInput,
  services: ServiceItem[],
  branches: Branch[],
  pricing: PricingConfig,
  coupons: Coupon[] = []
): QuoteResult {
  const branch = branches.find((b) => b.id === input.branchId) || branches[0];
  const items: QuoteBreakdownItem[] = [];

  // 1. Equipment Recommendation Engine based on guest count and duration
  const guests = Math.max(10, input.guestCount || 50);
  const duration = Math.max(2, input.durationHours || 6);

  let speakersCount = 2;
  let subwoofersCount = 1;
  let movingHeadsCount = 4;
  let parLightsCount = 8;
  let laserCount = 1;

  if (guests > 100 && guests <= 250) {
    speakersCount = 4;
    subwoofersCount = 2;
    movingHeadsCount = 8;
    parLightsCount = 12;
    laserCount = 2;
  } else if (guests > 250) {
    speakersCount = 6;
    subwoofersCount = 4;
    movingHeadsCount = 12;
    parLightsCount = 16;
    laserCount = 3;
  }

  const totalWattage = speakersCount * 1400 + subwoofersCount * 2200 + movingHeadsCount * 350;

  const recommendedEquipment: RecommendedEquipment = {
    speakersCount,
    subwoofersCount,
    totalWattage,
    movingHeadsCount,
    parLightsCount,
    laserCount,
    monitorsCount: guests > 150 ? 2 : 1,
    microphonesCount: 2
  };

  // 2. Base Duration & Staff Cost
  const baseDurationCost = duration * pricing.baseHourlyRate;
  items.push({
    concept: `Servicio Operativo Base (${duration} horas)`,
    category: 'Logística y Operación',
    quantity: duration,
    unitPrice: pricing.baseHourlyRate,
    totalPrice: baseDurationCost
  });

  // 3. Guest Scale Fee
  let guestScaleCost = 0;
  if (guests > 50) {
    const extraGuests = guests - 50;
    guestScaleCost = extraGuests * pricing.baseGuestRate;
    items.push({
      concept: `Escala de Cobertura por Aforo (${guests} invitados)`,
      category: 'Capacidad y Aforo',
      quantity: extraGuests,
      unitPrice: pricing.baseGuestRate,
      totalPrice: guestScaleCost
    });
  }

  // 4. Transport & Viaticums
  const distance = Math.max(5, input.distanceKm || 15);
  const travelCost = (branch.baseTravelFee + distance * branch.perKmFee) * branch.branchMultiplier;
  items.push({
    concept: `Traslado, Flete y Logística (${branch.name} - ${distance} km)`,
    category: 'Traslado y Cobertura',
    quantity: 1,
    unitPrice: travelCost,
    totalPrice: travelCost
  });

  // 5. Selected Main Services
  let servicesTotal = 0;
  input.selectedServices.forEach((serviceId) => {
    const s = services.find((srv) => srv.id === serviceId);
    if (s && s.active) {
      let price = s.basePrice;
      if (s.unit === 'hora') price = s.basePrice * duration;
      servicesTotal += price;
      items.push({
        concept: s.name,
        category: s.category,
        quantity: s.unit === 'hora' ? duration : 1,
        unitPrice: s.basePrice,
        totalPrice: price
      });
    }
  });

  // 6. Selected Extras
  let extrasTotal = 0;
  input.selectedExtras?.forEach((extra) => {
    const s = services.find((srv) => srv.id === extra.serviceId);
    if (s && extra.quantity > 0) {
      const price = s.basePrice * extra.quantity;
      extrasTotal += price;
      items.push({
        concept: `${s.name} (Adicional x${extra.quantity})`,
        category: 'Adicionales / Extras',
        quantity: extra.quantity,
        unitPrice: s.basePrice,
        totalPrice: price
      });
    }
  });

  const rawSubtotal = baseDurationCost + guestScaleCost + travelCost + servicesTotal + extrasTotal;

  // 7. Date Surcharges Check
  const surcharges: { name: string; amount: number }[] = [];
  const eventDateObj = new Date(input.eventDate || Date.now());
  const dayOfWeek = eventDateObj.getUTCDay(); // 0: Sun, 5: Fri, 6: Sat
  const month = eventDateObj.getUTCMonth(); // 0-11 (10: Nov, 11: Dec, 0: Jan)

  // Weekend
  if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
    const weekendFee = Math.round(rawSubtotal * (pricing.weekendSurchargePercent / 100));
    surcharges.push({
      name: `Recargo Fin de Semana / Víspera (${pricing.weekendSurchargePercent}%)`,
      amount: weekendFee
    });
  }

  // High Season (Nov, Dec, Jan)
  if (month === 10 || month === 11 || month === 0) {
    const highSeasonFee = Math.round(rawSubtotal * (pricing.highSeasonSurchargePercent / 100));
    surcharges.push({
      name: `Recargo Alta Temporada (${pricing.highSeasonSurchargePercent}%)`,
      amount: highSeasonFee
    });
  }

  const surchargesTotal = surcharges.reduce((acc, curr) => acc + curr.amount, 0);

  // 8. Discounts & Combo Promo
  const discounts: { name: string; amount: number }[] = [];
  
  // Combo discount if 3+ services selected
  if (input.selectedServices.length >= 3) {
    const comboDiscount = Math.round((servicesTotal + extrasTotal) * 0.10);
    discounts.push({
      name: 'Promoción Combo Full Experience (10% desc. en servicios)',
      amount: comboDiscount
    });
  }

  // Coupon discount
  if (input.appliedCoupon) {
    const foundCoupon = coupons.find(
      (c) => c.code.toUpperCase() === input.appliedCoupon?.toUpperCase() && c.active
    );
    if (foundCoupon) {
      const couponDiscount = Math.round(rawSubtotal * (foundCoupon.discountPercent / 100));
      discounts.push({
        name: `Cupón ${foundCoupon.code} (${foundCoupon.discountPercent}% desc. - ${foundCoupon.description})`,
        amount: couponDiscount
      });
    }
  }

  const discountsTotal = discounts.reduce((acc, curr) => acc + curr.amount, 0);

  // Net before tax
  const netTotal = Math.max(0, rawSubtotal + surchargesTotal - discountsTotal);

  // 9. Taxes
  const taxPercentage = pricing.defaultTaxPercent || 0;
  const taxAmount = Math.round(netTotal * (taxPercentage / 100));

  const total = netTotal + taxAmount;
  const suggestedDeposit = Math.round(total * (pricing.depositPercentage / 100));

  const quoteNumber = `PRES-${Math.floor(100000 + Math.random() * 900000)}`;

  return {
    id: `q-${Date.now()}`,
    quoteNumber,
    createdAt: new Date().toISOString(),
    input,
    recommendedEquipment,
    items,
    subtotal: Math.round(rawSubtotal),
    guestFee: Math.round(guestScaleCost),
    durationFee: Math.round(baseDurationCost),
    travelFee: Math.round(travelCost),
    equipmentFee: Math.round(servicesTotal),
    surcharges,
    discounts,
    taxAmount,
    taxPercentage,
    total: Math.round(total),
    suggestedDeposit
  };
}
