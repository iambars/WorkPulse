import { DaySchedule, Shift } from "@/types/schedule";

// check for the existing daySchedule[] in the database
// get the first item
// if there's none, return {date, workDay: false, shiftId: null}
export const createYearSchedule = (
  year: number,
  existing: DaySchedule[] = [],
): DaySchedule[] => {
  const existingMap = new Map(
    existing.map((d) => [
      d.date,
      {
        date: d.date,
        workDay: d.workDay ?? true,
        shiftId: d.shiftId ?? null,
      },
    ]),
  );

  const result: DaySchedule[] = [];
  for (
    let date = new Date(year, 0, 1);
    date <= new Date(year, 11, 31);
    date.setDate(date.getDate() + 1)
  ) {
    const isoDate = new Date(date).toISOString().split("T")[0];
    const existingDay = existingMap.get(isoDate);

    result.push(
      existingDay ?? {
        date: isoDate,
        workDay: true,
        shiftId: null,
      },
    );
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
