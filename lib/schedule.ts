import { DaySchedule, Shift } from "@/types/schedule";

export const createYearSchedule = (year: number): DaySchedule[] => {
  const result: DaySchedule[] = [];
  for (
    let date = new Date(year, 0, 1);
    date <= new Date(year, 11, 31);
    date.setDate(date.getDate() + 1)
  ) {
    result.push({
      date: new Date(date).toISOString().split("T")[0],
      workDay: true,
      shift: "Shift 1",
    });
  }

  return result;
};

export const formatTime12Hr = (time: string) => {
  const [hourStr, minute] = time.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;

  return `${hour}:${minute} ${ampm}`;
};

export const getDayName = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
  });
