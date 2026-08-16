import React, { useState } from 'react';
import {
  Package,
  Truck,
  UserCheck,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Search,
  Building2,
  Edit2,
  Trash2,
  X,
  Zap,
  Maximize2,
  Ruler,
  Layers,
  Sliders,
  Filter
} from 'lucide-react';
import { AppStorage } from '../../services/storage';
import { Equipment, Vehicle, Staff } from '../../types';

export const InventoryLogistics: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'equipment' | 'vehicles' | 'staff'>('equipment');

  // State
  const [equipment, setEquipment] = useState<Equipment[]>(AppStorage.getEquipment());
  const [vehicles, setVehicles] = useState<Vehicle[]>(AppStorage.getVehicles());
  const [staff, setStaff] = useState<Staff[]>(AppStorage.getStaff());
  const [branches] = useState(AppStorage.getBranches());

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('todos');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');

  // Equipment Form Modal
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [equipmentForm, setEquipmentForm] = useState<Partial<Equipment>>({
    name: '',
    category: 'Altavoces / Sonido',
    totalStock: 1,
    availableStock: 1,
    unitPowerWatts: 0,
    metersLength: 0,
    mountType: '',
    brandModel: '',
    branchId: 'all',
    condition: 'Excelente',
    notes: ''
  });

  // Vehicle Form Modal
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [vehicleForm, setVehicleForm] = useState<Partial<Vehicle>>({
    name: '',
    licensePlate: '',
    type: 'Furgón Grande',
    capacityKg: 1000,
    branchId: 'all',
    status: 'Disponible'
  });

  // Staff Form Modal
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [staffForm, setStaffForm] = useState<Partial<Staff>>({
    name: '',
    role: 'DJ Principal',
    phone: '',
    branchId: 'all',
    active: true,
    avatarUrl: ''
  });

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'equipment' | 'vehicle' | 'staff'; id: string; name: string } | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // --- EQUIPMENT HANDLERS ---
  const saveEquipmentList = (newList: Equipment[]) => {
    setEquipment(newList);
    AppStorage.saveEquipment(newList);
  };

  const handleOpenAddEquipment = () => {
    setEditingEquipment(null);
    setEquipmentForm({
      name: '',
      category: 'Altavoces / Sonido',
      totalStock: 1,
      availableStock: 1,
      unitPowerWatts: 0,
      metersLength: 0,
      mountType: 'Trípode / Estructura',
      brandModel: '',
      branchId: 'all',
      condition: 'Excelente',
      notes: ''
    });
    setIsEquipmentModalOpen(true);
  };

  const handleOpenEditEquipment = (eq: Equipment) => {
    setEditingEquipment(eq);
    setEquipmentForm({ ...eq });
    setIsEquipmentModalOpen(true);
  };

  const handleSubmitEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipmentForm.name) return;

    if (editingEquipment) {
      const updated = equipment.map((eq) =>
        eq.id === editingEquipment.id ? ({ ...eq, ...equipmentForm } as Equipment) : eq
      );
      saveEquipmentList(updated);
      showToast('¡Equipo actualizado correctamente!');
    } else {
      const newEq: Equipment = {
        id: `eq-${Date.now()}`,
        name: equipmentForm.name!,
        category: (equipmentForm.category as any) || 'Otro',
        totalStock: Number(equipmentForm.totalStock) || 1,
        availableStock: Number(equipmentForm.availableStock) || 1,
        unitPowerWatts: Number(equipmentForm.unitPowerWatts) || 0,
        metersLength: Number(equipmentForm.metersLength) || 0,
        mountType: equipmentForm.mountType || '',
        brandModel: equipmentForm.brandModel || '',
        branchId: equipmentForm.branchId || 'all',
        condition: (equipmentForm.condition as any) || 'Excelente',
        notes: equipmentForm.notes || ''
      };
      saveEquipmentList([newEq, ...equipment]);
      showToast('¡Nuevo equipo agregado al inventario!');
    }
    setIsEquipmentModalOpen(false);
  };

  const handleAdjustStock = (id: string, delta: number) => {
    const updated = equipment.map((eq) => {
      if (eq.id === id) {
        const newAvailable = Math.max(0, Math.min(eq.totalStock, eq.availableStock + delta));
        return { ...eq, availableStock: newAvailable };
      }
      return eq;
    });
    saveEquipmentList(updated);
  };

  // --- VEHICLE HANDLERS ---
  const saveVehicleList = (newList: Vehicle[]) => {
    setVehicles(newList);
    AppStorage.saveVehicles(newList);
  };

  const handleSubmitVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleForm.name || !vehicleForm.licensePlate) return;

    if (editingVehicle) {
      const updated = vehicles.map((v) => (v.id === editingVehicle.id ? ({ ...v, ...vehicleForm } as Vehicle) : v));
      saveVehicleList(updated);
      showToast('Vehículo actualizado.');
    } else {
      const newV: Vehicle = {
        id: `v-${Date.now()}`,
        name: vehicleForm.name!,
        licensePlate: vehicleForm.licensePlate!,
        type: (vehicleForm.type as any) || 'Furgón Grande',
        capacityKg: Number(vehicleForm.capacityKg) || 1000,
        branchId: vehicleForm.branchId || 'all',
        status: (vehicleForm.status as any) || 'Disponible'
      };
      saveVehicleList([...vehicles, newV]);
      showToast('Vehículo agregado a la flota.');
    }
    setIsVehicleModalOpen(false);
  };

  // --- STAFF HANDLERS ---
  const saveStaffList = (newList: Staff[]) => {
    setStaff(newList);
    AppStorage.saveStaff(newList);
  };

  const handleSubmitStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffForm.name) return;

    if (editingStaff) {
      const updated = staff.map((s) => (s.id === editingStaff.id ? ({ ...s, ...staffForm } as Staff) : s));
      saveStaffList(updated);
      showToast('Personal actualizado.');
    } else {
      const newS: Staff = {
        id: `st-${Date.now()}`,
        name: staffForm.name!,
        role: (staffForm.role as any) || 'DJ Principal',
        phone: staffForm.phone || '',
        branchId: staffForm.branchId || 'all',
        active: staffForm.active ?? true,
        avatarUrl: staffForm.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      };
      saveStaffList([...staff, newS]);
      showToast('Nuevo staff registrado.');
    }
    setIsStaffModalOpen(false);
  };

  // --- DELETE HANDLER ---
  const confirmDeleteTarget = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'equipment') {
      saveEquipmentList(equipment.filter((eq) => eq.id !== deleteTarget.id));
      showToast('Equipo eliminado del inventario.');
    } else if (deleteTarget.type === 'vehicle') {
      saveVehicleList(vehicles.filter((v) => v.id !== deleteTarget.id));
      showToast('Vehículo eliminado.');
    } else if (deleteTarget.type === 'staff') {
      saveStaffList(staff.filter((s) => s.id !== deleteTarget.id));
      showToast('Staff eliminado.');
    }
    setDeleteTarget(null);
  };

  // Filtered Equipment List
  const filteredEquipment = equipment.filter((eq) => {
    const matchesBranch =
      selectedBranch === 'todos' ||
      !eq.branchId ||
      eq.branchId === 'all' ||
      eq.branchId === 'todas' ||
      eq.branchId === selectedBranch;

    const matchesCategory = selectedCategory === 'todas' || eq.category === selectedCategory;

    const matchesSearch =
      eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (eq.mountType && eq.mountType.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (eq.brandModel && eq.brandModel.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (eq.notes && eq.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesBranch && matchesCategory && matchesSearch;
  });

  const categoriesList = [
    'todas',
    'Altavoces / Sonido',
    'Iluminación',
    'Consolas & DJ',
    'Pantallas & Proyección',
    'Efectos Especiales',
    'Estructuras & Módulos',
    'Soportes & Trusses',
    'Cables & Cableado',
    'Energía',
    'Otro'
  ];

  const getBranchName = (branchId?: string) => {
    if (!branchId || branchId === 'all' || branchId === 'todas') return 'Todas las Sucursales';
    const b = branches.find((item) => item.id === branchId);
    return b ? b.name.split('-')[1]?.trim() || b.name : branchId;
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-purple-600 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            GESTIÓN DE INVENTARIO Y RECURSOS
          </h1>
          <p className="text-xs text-slate-400">
            Administra elementos de sonido, luces, metros de cableado/trusses, potencia en Watts, soportes, vehículos y personal.
          </p>
        </div>

        {/* SubTab Toggle */}
        <div className="flex items-center bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('equipment')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'equipment' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            Equipamiento ({equipment.length})
          </button>
          <button
            onClick={() => setActiveSubTab('vehicles')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'vehicles' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            Vehículos ({vehicles.length})
          </button>
          <button
            onClick={() => setActiveSubTab('staff')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'staff' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            Staff & DJs ({staff.length})
          </button>
        </div>
      </div>

      {/* --- EQUIPMENT SUBTAB --- */}
      {activeSubTab === 'equipment' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col lg:flex-row gap-4 justify-between items-center">
            {/* Search */}
            <div className="relative w-full lg:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Buscar por equipo, soporte, marca..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              {/* Category selector */}
              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
                <Layers className="w-4 h-4 text-purple-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
                >
                  {categoriesList.map((cat) => (
                    <option key={cat} value={cat} className="bg-slate-900 text-white">
                      {cat === 'todas' ? 'Todas las Categorías' : cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Branch selector */}
              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
                <Building2 className="w-4 h-4 text-purple-400" />
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
                >
                  <option value="todos" className="bg-slate-900 text-white">Todas las Sucursales</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id} className="bg-slate-900 text-white">
                      {b.name.includes('Concordia') ? 'Sucursal Concordia' : b.name.includes('Posadas') ? 'Sucursal Posadas' : b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Add Button */}
              <button
                onClick={handleOpenAddEquipment}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all transform hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>AGREGAR ELEMENTO</span>
              </button>
            </div>
          </div>

          {/* Equipment Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEquipment.length === 0 ? (
              <div className="col-span-full bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-2">
                <Package className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="font-bold text-sm text-white">No se encontraron elementos de inventario</p>
                <p className="text-xs text-slate-500">Intenta cambiar la búsqueda o agrega un nuevo elemento.</p>
              </div>
            ) : (
              filteredEquipment.map((eq) => (
                <div
                  key={eq.id}
                  className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-xl space-y-3 relative group hover:border-purple-500/50 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    {/* Header line */}
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-purple-950 text-purple-300 font-extrabold border border-purple-800/40 inline-block mb-1">
                          {eq.category}
                        </span>
                        <h3 className="font-extrabold text-sm text-white leading-tight">{eq.name}</h3>
                        {eq.brandModel && (
                          <p className="text-[11px] text-slate-400 font-medium">{eq.brandModel}</p>
                        )}
                      </div>

                      {/* Condition Badge */}
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                          eq.condition === 'Excelente'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                            : eq.condition === 'Bueno'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800/50'
                            : 'bg-rose-950 text-rose-400 border border-rose-800/50'
                        }`}
                      >
                        {eq.condition}
                      </span>
                    </div>

                    {/* Specifications Grid */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800/80 text-xs">
                      {/* Potencia */}
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <div>
                          <p className="text-[10px] text-slate-500 font-semibold">Potencia</p>
                          <p className="font-extrabold text-white">
                            {eq.unitPowerWatts >= 1000 ? `${(eq.unitPowerWatts / 1000).toFixed(1)} kW` : `${eq.unitPowerWatts} W`}
                          </p>
                        </div>
                      </div>

                      {/* Metros / Medida */}
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Ruler className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <div>
                          <p className="text-[10px] text-slate-500 font-semibold">Metros / Dim.</p>
                          <p className="font-extrabold text-white">
                            {eq.metersLength ? `${eq.metersLength} m` : 'N/A'}
                          </p>
                        </div>
                      </div>

                      {/* Soportes / Agarre */}
                      <div className="col-span-2 pt-1 border-t border-slate-900 flex items-start gap-1.5 text-slate-300">
                        <Sliders className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] text-slate-500 font-semibold">Soporte / Sujeción</p>
                          <p className="font-semibold text-slate-200 text-[11px] line-clamp-1">
                            {eq.mountType || 'Trípode / Estándar'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {eq.notes && (
                      <p className="text-[11px] text-slate-400 italic line-clamp-2 bg-slate-950/40 p-2 rounded-xl">
                        "{eq.notes}"
                      </p>
                    )}
                  </div>

                  {/* Stock & Actions Footer */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Disponible / Total</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleAdjustStock(eq.id, -1)}
                          className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center cursor-pointer"
                          title="Reducir disponible"
                        >
                          -
                        </button>
                        <strong className="text-emerald-400 font-black text-sm px-1">
                          {eq.availableStock}
                        </strong>
                        <span className="text-slate-500">/ {eq.totalStock} u.</span>
                        <button
                          onClick={() => handleAdjustStock(eq.id, 1)}
                          className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center cursor-pointer"
                          title="Aumentar disponible"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditEquipment(eq)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 transition-all cursor-pointer"
                        title="Editar elemento"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ type: 'equipment', id: eq.id, name: eq.name })}
                        className="p-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 transition-all cursor-pointer"
                        title="Eliminar del inventario"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* --- VEHICLES SUBTAB --- */}
      {activeSubTab === 'vehicles' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-900 p-4 rounded-3xl border border-slate-800">
            <p className="text-xs text-slate-400 font-semibold">Flota de transporte y furgones para montaje.</p>
            <button
              onClick={() => {
                setEditingVehicle(null);
                setVehicleForm({
                  name: '',
                  licensePlate: '',
                  type: 'Furgón Grande',
                  capacityKg: 1000,
                  branchId: 'all',
                  status: 'Disponible'
                });
                setIsVehicleModalOpen(true);
              }}
              className="py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>AGREGAR VEHÍCULO</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.map((v) => (
              <div key={v.id} className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-3 relative">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-sm text-white">{v.name}</h3>
                    <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40 inline-block mt-1">
                      {v.licensePlate}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {v.status}
                  </span>
                </div>

                <p className="text-xs text-slate-400">Tipo: <strong className="text-white">{v.type}</strong> • Carga Max: <strong className="text-white">{v.capacityKg} kg</strong></p>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-[10px] text-slate-500">{getBranchName(v.branchId)}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingVehicle(v);
                        setVehicleForm({ ...v });
                        setIsVehicleModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ type: 'vehicle', id: v.id, name: v.name })}
                      className="p-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- STAFF SUBTAB --- */}
      {activeSubTab === 'staff' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-900 p-4 rounded-3xl border border-slate-800">
            <p className="text-xs text-slate-400 font-semibold">Nómina de DJs, locutores, operadores e ingenieros.</p>
            <button
              onClick={() => {
                setEditingStaff(null);
                setStaffForm({
                  name: '',
                  role: 'DJ Principal',
                  phone: '',
                  branchId: 'all',
                  active: true,
                  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                });
                setIsStaffModalOpen(true);
              }}
              className="py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>REGISTRAR STAFF</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {staff.map((st) => (
              <div key={st.id} className="bg-slate-900 p-5 rounded-3xl border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={st.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={st.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-purple-500/40 shrink-0"
                  />
                  <div>
                    <h3 className="font-extrabold text-sm text-white">{st.name}</h3>
                    <p className="text-xs text-purple-400 font-bold">{st.role}</p>
                    <p className="text-[11px] text-slate-400">{st.phone || 'Sin cel'}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setEditingStaff(st);
                      setStaffForm({ ...st });
                      setIsStaffModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ type: 'staff', id: st.id, name: st.name })}
                    className="p-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- EQUIPMENT MODAL (ADD / EDIT) --- */}
      {isEquipmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl max-w-xl w-full p-6 text-white space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-black text-base text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-400" />
                {editingEquipment ? 'EDITAR ELEMENTO DE INVENTARIO' : 'AGREGAR NUEVO ELEMENTO DE INVENTARIO'}
              </h3>
              <button
                onClick={() => setIsEquipmentModalOpen(false)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitEquipment} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nombre del Elemento / Equipo *</label>
                <input
                  type="text"
                  required
                  value={equipmentForm.name}
                  onChange={(e) => setEquipmentForm({ ...equipmentForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  placeholder="Ej. Bafle Potenciado RCF ART 745-A"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Categoría</label>
                  <select
                    value={equipmentForm.category}
                    onChange={(e) => setEquipmentForm({ ...equipmentForm, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="Altavoces / Sonido">Altavoces / Sonido</option>
                    <option value="Iluminación">Iluminación</option>
                    <option value="Consolas & DJ">Consolas & DJ</option>
                    <option value="Pantallas & Proyección">Pantallas & Proyección</option>
                    <option value="Efectos Especiales">Efectos Especiales</option>
                    <option value="Estructuras & Módulos">Estructuras & Módulos</option>
                    <option value="Soportes & Trusses">Soportes & Trusses</option>
                    <option value="Cables & Cableado">Cables & Cableado</option>
                    <option value="Energía">Energía</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Marca / Modelo</label>
                  <input
                    type="text"
                    value={equipmentForm.brandModel || ''}
                    onChange={(e) => setEquipmentForm({ ...equipmentForm, brandModel: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
                    placeholder="Ej. RCF Italy / Eurotruss Q30"
                  />
                </div>
              </div>

              {/* Quantities */}
              <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Stock Total (Unidades)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={equipmentForm.totalStock}
                    onChange={(e) =>
                      setEquipmentForm({
                        ...equipmentForm,
                        totalStock: parseInt(e.target.value) || 0,
                        availableStock: Math.min(equipmentForm.availableStock || 0, parseInt(e.target.value) || 0)
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Stock Disponible</label>
                  <input
                    type="number"
                    min="0"
                    max={equipmentForm.totalStock}
                    required
                    value={equipmentForm.availableStock}
                    onChange={(e) => setEquipmentForm({ ...equipmentForm, availableStock: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-bold focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Specs: Meters, Power, Mount */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Potencia (Watts / W)</label>
                  <input
                    type="number"
                    min="0"
                    value={equipmentForm.unitPowerWatts}
                    onChange={(e) => setEquipmentForm({ ...equipmentForm, unitPowerWatts: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                    placeholder="Ej. 1400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Metros / Longitud (m)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={equipmentForm.metersLength || 0}
                    onChange={(e) => setEquipmentForm({ ...equipmentForm, metersLength: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                    placeholder="Ej. 25"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Estado</label>
                  <select
                    value={equipmentForm.condition}
                    onChange={(e) => setEquipmentForm({ ...equipmentForm, condition: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="Excelente">Excelente</option>
                    <option value="Bueno">Bueno</option>
                    <option value="En Mantenimiento">En Mantenimiento</option>
                    <option value="Baja">Baja</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Soportes, Sujeción & Agarre</label>
                <input
                  type="text"
                  value={equipmentForm.mountType || ''}
                  onChange={(e) => setEquipmentForm({ ...equipmentForm, mountType: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-purple-500"
                  placeholder="Ej. Trípode reforzado, Clamps para Truss Q30, Torre de elevación"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Sucursal Asignada</label>
                <select
                  value={equipmentForm.branchId || 'all'}
                  onChange={(e) => setEquipmentForm({ ...equipmentForm, branchId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="all">Todas las Sucursales</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name.includes('Concordia') ? 'Sucursal Concordia' : b.name.includes('Posadas') ? 'Sucursal Posadas' : b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Notas / Observaciones</label>
                <textarea
                  rows={2}
                  value={equipmentForm.notes || ''}
                  onChange={(e) => setEquipmentForm({ ...equipmentForm, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                  placeholder="Información adicional sobre conectores, estuches o cuidados..."
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEquipmentModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold rounded-xl shadow-lg cursor-pointer"
                >
                  {editingEquipment ? 'Guardar Cambios' : 'Agregar Elemento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- VEHICLE MODAL --- */}
      {isVehicleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl max-w-md w-full p-6 text-white space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-black text-base text-white">
                {editingVehicle ? 'EDITAR VEHÍCULO' : 'NUEVO VEHÍCULO'}
              </h3>
              <button
                onClick={() => setIsVehicleModalOpen(false)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitVehicle} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nombre / Modelo *</label>
                <input
                  type="text"
                  required
                  value={vehicleForm.name}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  placeholder="Ej. Furgón Mercedes Sprinter 515"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Patente / Dominio *</label>
                  <input
                    type="text"
                    required
                    value={vehicleForm.licensePlate}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, licensePlate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono uppercase focus:outline-none focus:border-purple-500"
                    placeholder="AF-204-KL"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Capacidad Carga (kg)</label>
                  <input
                    type="number"
                    value={vehicleForm.capacityKg}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, capacityKg: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsVehicleModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold rounded-xl shadow-lg cursor-pointer"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- STAFF MODAL --- */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl max-w-md w-full p-6 text-white space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-black text-base text-white">
                {editingStaff ? 'EDITAR STAFF' : 'REGISTRAR STAFF'}
              </h3>
              <button
                onClick={() => setIsStaffModalOpen(false)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitStaff} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={staffForm.name}
                  onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  placeholder="Ej. Lucas 'DJ Lex' Morales"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Rol / Especialidad</label>
                  <select
                    value={staffForm.role}
                    onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="DJ Principal">DJ Principal</option>
                    <option value="Animador / Locutor">Animador / Locutor</option>
                    <option value="Técnico de Sonido">Técnico de Sonido</option>
                    <option value="Técnico de Luces">Técnico de Luces</option>
                    <option value="Operador de FX">Operador de FX</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={staffForm.phone}
                    onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
                    placeholder="+54 9 11 ..."
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsStaffModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold rounded-xl shadow-lg cursor-pointer"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-rose-500/40 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-white">¿Eliminar {deleteTarget.name}?</h3>
            <p className="text-xs text-slate-400">
              Esta acción quitará permanentemente el elemento.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteTarget}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 cursor-pointer"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
