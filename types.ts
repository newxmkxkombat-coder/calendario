
export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isHoliday: boolean;
  holidayName?: string;
}

export interface MonthlyInsight {
  quote: string;
  focus: string;
  historicalNote: string;
}

export enum ViewMode {
  MONTH = 'MONTH',
  YEAR = 'YEAR'
}
