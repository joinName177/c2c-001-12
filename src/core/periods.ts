import type { InvestmentRecord } from './models';

export interface WeekPeriod {
  start: Date;
  end: Date;
  week: number;
  year: number;
}

export function isoWeek(date: Date): { week: number; year: number } {
  const value = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = value.getUTCDay() || 7;
  value.setUTCDate(value.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(value.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((value.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return { week, year: value.getUTCFullYear() };
}

export function weekPeriod(anchor: Date): WeekPeriod {
  const start = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate());
  const day = start.getDay() || 7;
  start.setDate(start.getDate() - (day - 1));
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  end.setMilliseconds(-1);
  const { week, year } = isoWeek(start);
  return { start, end, week, year };
}

export function shiftWeeks(date: Date, weeks: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + weeks * 7);
  return next;
}

export function isInPeriod(isoDate: string, period: WeekPeriod): boolean {
  const time = new Date(isoDate).getTime();
  return !Number.isNaN(time) && time >= period.start.getTime() && time <= period.end.getTime();
}

export function recordsInPeriod(records: InvestmentRecord[], period: WeekPeriod): InvestmentRecord[] {
  return records.filter((item) => isInPeriod(item.date, period));
}

export function formatPeriod(period: WeekPeriod): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  const label = (date: Date) => `${pad(date.getMonth() + 1)} / ${pad(date.getDate())}`;
  return `${period.start.getFullYear()} · ${label(period.start)} — ${label(period.end)}`;
}
