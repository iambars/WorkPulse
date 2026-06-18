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

  const offset = new Date(year, month, 1).getDay();

  const prevMonthLastDay = new Date(year, month, 0).getDate();

  return {
    monthName,
    offset,
    prevMonthLastDay,
  };
}

export const getMonthDays = (
  days: DaySchedule[],
  year: number,
  month: number,
) => {
  return days.filter((day) => {
    const d = new Date(day.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
};
