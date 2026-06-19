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
    const isoDate = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
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

const parseDate = (dateStr: string) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const getDayName = (dateStr: string) =>
  parseDate(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
  });
