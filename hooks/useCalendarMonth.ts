import { DaySchedule } from "@/types/schedule";

export function useCalendarMonth({
  year,
  month,
}: {
  year: number;
  month: number;
}) {
  const monthName = new Date(year, month).toLocaleDateString("en-US", {
    month: "long",
    // year: "numeric",
  });

  const offset = new Date(Date.UTC(year, month, 1)).getUTCDay();

  const prevMonthLastDay = new Date(year, month, 0).getDate();

  return {
    monthName,
    offset,
    prevMonthLastDay,
  };
}

const parseDate = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const getMonthDays = (
  days: DaySchedule[],
  year: number,
  month: number,
) => {
  return days.filter((day) => {
    const d = new Date(day.date);

    return d.getUTCFullYear() === year && d.getUTCMonth() === month;
  });
};
