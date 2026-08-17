import { GalleryItem } from '../types';

export interface TimelineTitleGroup {
  titleKey: string; // unique key e.g. "2026-08__Casamiento Romina & Facundo"
  title: string;
  eventTitle?: string;
  category?: string;
  venue?: string;
  location?: string;
  items: GalleryItem[];
  photosCount: number;
  videosCount: number;
  reelsCount: number;
}

export interface TimelineMonthGroup {
  monthKey: string; // "2026-08"
  year: number; // 2026
  monthIndex: number; // 8 (1-12)
  monthName: string; // "Agosto"
  fullLabel: string; // "Agosto 2026"
  isCurrentOrLatest: boolean;
  isPast: boolean;
  isFuture: boolean;
  items: GalleryItem[];
  titleGroups: TimelineTitleGroup[];
  photosCount: number;
  videosCount: number;
  reelsCount: number;
  locations: string[];
}

export interface TimelineYearGroup {
  year: number;
  totalItemsCount: number;
  months: TimelineMonthGroup[];
}

export const SPANISH_MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
];

/**
 * Normalizes item date into YYYY-MM-DD string
 */
export function normalizeItemDate(item: GalleryItem): string {
  if (item.date && /^\d{4}-\d{2}-\d{2}/.test(item.date)) {
    return item.date.substring(0, 10);
  }
  // Try to parse timestamp from id if it looks like gal-17... or gal-2026...
  if (item.id) {
    const match = item.id.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
  }
  // Default to today's date if no date provided
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Parses year and month from a date string (YYYY-MM-DD)
 */
export function parseYearMonth(dateStr: string): { year: number; month: number; monthKey: string } {
  const parts = dateStr.split('-');
  const year = parseInt(parts[0], 10) || new Date().getFullYear();
  const month = parseInt(parts[1], 10) || (new Date().getMonth() + 1);
  const monthKey = `${year}-${String(month).padStart(2, '0')}`;
  return { year, month, monthKey };
}

/**
 * Groups gallery items into chronological hierarchy: Year -> Month -> Title
 */
export function groupGalleryByTimeline(items: GalleryItem[]): {
  yearGroups: TimelineYearGroup[];
  mostRecentMonthKey: string | null;
  totalItemsCount: number;
} {
  if (!items || items.length === 0) {
    return {
      yearGroups: [],
      mostRecentMonthKey: null,
      totalItemsCount: 0
    };
  }

  // 1. Sort all items by date descending (newest first)
  const sortedItems = [...items].sort((a, b) => {
    const dateA = normalizeItemDate(a);
    const dateB = normalizeItemDate(b);
    return dateB.localeCompare(dateA);
  });

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentMonthKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;

  // 2. Group items by monthKey
  const monthMap: Record<string, GalleryItem[]> = {};

  sortedItems.forEach((item) => {
    const dateStr = normalizeItemDate(item);
    const { monthKey } = parseYearMonth(dateStr);
    if (!monthMap[monthKey]) {
      monthMap[monthKey] = [];
    }
    monthMap[monthKey].push(item);
  });

  const monthKeys = Object.keys(monthMap).sort((a, b) => b.localeCompare(a));
  const mostRecentMonthKey = monthKeys.length > 0 ? monthKeys[0] : currentMonthKey;

  // 3. Construct MonthGroups & TitleGroups
  const yearGroupsMap: Record<number, TimelineMonthGroup[]> = {};

  monthKeys.forEach((key) => {
    const [yStr, mStr] = key.split('-');
    const year = parseInt(yStr, 10);
    const monthIndex = parseInt(mStr, 10);
    const monthName = SPANISH_MONTHS[monthIndex - 1] || `Mes ${monthIndex}`;
    const groupItems = monthMap[key];

    const photosCount = groupItems.filter((i) => i.mediaType === 'photo').length;
    const videosCount = groupItems.filter((i) => i.mediaType === 'video').length;
    const reelsCount = groupItems.filter((i) => i.mediaType === 'reel').length;

    // Collect unique locations
    const locationsSet = new Set<string>();
    groupItems.forEach((i) => {
      if (i.location) locationsSet.add(i.location);
    });

    // Group items inside this month by Title (or eventTitle)
    const titleMap: Record<string, GalleryItem[]> = {};
    groupItems.forEach((item) => {
      const displayTitle = item.title || item.eventTitle || 'Producción Oficial';
      if (!titleMap[displayTitle]) {
        titleMap[displayTitle] = [];
      }
      titleMap[displayTitle].push(item);
    });

    // Construct TitleGroups sorted alphabetically
    const titleGroups: TimelineTitleGroup[] = Object.keys(titleMap)
      .sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }))
      .map((tName) => {
        const tItems = titleMap[tName];
        const firstItem = tItems[0];
        return {
          titleKey: `${key}__${tName}`,
          title: tName,
          eventTitle: firstItem.eventTitle,
          category: firstItem.category,
          venue: firstItem.venue,
          location: firstItem.location,
          items: tItems,
          photosCount: tItems.filter((i) => i.mediaType === 'photo').length,
          videosCount: tItems.filter((i) => i.mediaType === 'video').length,
          reelsCount: tItems.filter((i) => i.mediaType === 'reel').length
        };
      });

    const isCurrentOrLatest = key === mostRecentMonthKey || key === currentMonthKey;
    const isPast = key < currentMonthKey;
    const isFuture = key > currentMonthKey;

    const monthGroup: TimelineMonthGroup = {
      monthKey: key,
      year,
      monthIndex,
      monthName,
      fullLabel: `${monthName} ${year}`,
      isCurrentOrLatest,
      isPast,
      isFuture,
      items: groupItems,
      titleGroups,
      photosCount,
      videosCount,
      reelsCount,
      locations: Array.from(locationsSet)
    };

    if (!yearGroupsMap[year]) {
      yearGroupsMap[year] = [];
    }
    yearGroupsMap[year].push(monthGroup);
  });

  // 4. Construct sorted YearGroups
  const years = Object.keys(yearGroupsMap)
    .map((y) => parseInt(y, 10))
    .sort((a, b) => b - a);

  const yearGroups: TimelineYearGroup[] = years.map((year) => {
    const months = yearGroupsMap[year].sort((a, b) => b.monthIndex - a.monthIndex);
    const totalItemsCount = months.reduce((acc, m) => acc + m.items.length, 0);
    return {
      year,
      totalItemsCount,
      months
    };
  });

  return {
    yearGroups,
    mostRecentMonthKey,
    totalItemsCount: sortedItems.length
  };
}

/**
 * Formats a date string into readable Spanish (e.g., "15 Ago 2026")
 */
export function formatTimelineDate(dateStr?: string): string {
  if (!dateStr) return '';
  const parts = dateStr.substring(0, 10).split('-');
  if (parts.length !== 3) return dateStr;
  const day = parseInt(parts[2], 10);
  const monthIdx = parseInt(parts[1], 10) - 1;
  const year = parts[0];
  const shortMonth = SPANISH_MONTHS[monthIdx] ? SPANISH_MONTHS[monthIdx].substring(0, 3) : '';
  return `${day} ${shortMonth} ${year}`;
}
