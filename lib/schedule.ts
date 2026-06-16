import { DaySchedule, Schedule } from "@/types/schedule";

// Use the existing schedule from the database
// If none, create a default schedule entry
export const createYearSchedule = (
  year: number,
  existing: Schedule[] = [],
): DaySchedule[] => {
  const existingMap = new Map(existing.map((d) => [d.date, d]));

  const result: DaySchedule[] = [];
  for (
    let date = new Date(year, 0, 1);
    date <= new Date(year, 11, 31);
    date.setDate(date.getDate() + 1)
  ) {
    const isoDate = new Date(date).toISOString().split("T")[0];
    const existingDay = existingMap.get(isoDate);

    // console.log("existingMap: ", existingMap);
    // console.log("date: ", date);
    // console.log("isoDate: ", isoDate);

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
