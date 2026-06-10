"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

type DaySchedule = {
  date: string;
  workDay: boolean;
  shift: string;
};

type Shift = {
  name: string;
  start: string;
  end: string;
  color: string;
};

export default function ScheduleCalendar() {
  const year = 2026;

  const [shifts] = useState<Shift[]>([
    {
      name: "SHIFT_1",
      start: "08:00",
      end: "17:00",
      color: "bg-blue-100 text-blue-800 border-blue-300",
    },
    {
      name: "SHIFT_2",
      start: "09:00",
      end: "18:00",
      color: "bg-green-100 text-green-800 border-green-300",
    },
    {
      name: "SHIFT_3",
      start: "13:00",
      end: "22:00",
      color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    },
  ]);

  const [selectedShift, setSelectedShift] = useState("SHIFT_1");
  const [currentMonth, setCurrentMonth] = useState(5); // June

  const createYearSchedule = (): DaySchedule[] => {
    const result: DaySchedule[] = [];

    for (
      let date = new Date(year, 0, 1);
      date <= new Date(year, 11, 31);
      date.setDate(date.getDate() + 1)
    ) {
      result.push({
        date: new Date(date).toISOString().split("T")[0],
        workDay: true,
        shift: "SHIFT_1",
      });
    }

    return result;
  };

  const [days, setDays] = useState<DaySchedule[]>(createYearSchedule);

  const updateDay = (date: string, data: Partial<DaySchedule>) => {
    setDays((prev) =>
      prev.map((day) => (day.date === date ? { ...day, ...data } : day)),
    );
  };

  const getShift = (name: string) =>
    shifts.find((shift) => shift.name === name);

  const formatTime = (time: string) => {
    const [hourStr, minute] = time.split(":");
    let hour = parseInt(hourStr, 10);

    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    if (hour === 0) hour = 12;

    return `${hour}:${minute} ${ampm}`;
  };

  const getDayName = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
    });

  const monthName = new Date(year, currentMonth).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const monthDays = useMemo(() => {
    return days.filter((day) => {
      const date = new Date(day.date);

      return date.getFullYear() === year && date.getMonth() === currentMonth;
    });
  }, [days, currentMonth]);

  const firstDay = new Date(year, currentMonth, 1).getDay();
  const offset = firstDay;
  const prevMonthLastDay = new Date(year, currentMonth, 0).getDate();

  return (
    // <div className="space-y-8">
    <div className="mx-auto w-full max-w-5xl space-y-4 px-2 sm:px-4">
      {/* SHIFT SELECTOR */}
      <div className="flex flex-wrap gap-8">
        {shifts.map((shift) => (
          <div key={shift.name} className="flex flex-col gap-2">
            <button
              onClick={() => setSelectedShift(shift.name)}
              className={`peer rounded-full border px-3 py-2 text-sm ${
                selectedShift === shift.name
                  ? "border-1.5 scale-105 shadow-md ring-1 ring-transparent"
                  : "scale-95 opacity-40 hover:opacity-60"
              } ${shift.color}`}
            >
              {shift.name}
            </button>

            <span className="text-secondary border-secondary/20 invisible rounded-full border px-3 py-1.5 text-center text-xs opacity-0 transition-all peer-hover:visible peer-hover:opacity-100">
              {shift.start} - {shift.end}
            </span>
          </div>
        ))}
      </div>

      {/* MONTH NAVIGATION */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentMonth((m) => (m === 0 ? 11 : m - 1))}
          className="border-border/10 hover:border-border/50 rounded-lg border px-3 py-2 hover:text-blue-500"
        >
          <ChevronLeft />
        </button>

        <h2 className="text-xl font-bold">{monthName}</h2>

        <button
          onClick={() => setCurrentMonth((m) => (m === 11 ? 0 : m + 1))}
          className="border-border/10 hover:border-border/50 rounded-lg border px-3 py-2 hover:text-blue-500"
        >
          <ChevronRight />
        </button>
      </div>

      {/* WEEK HEADER */}
      <div className="mb-4 grid grid-cols-7 gap-2 text-center text-sm font-semibold">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="rounded bg-gray-100 p-2">
            {day}
          </div>
        ))}
      </div>

      {/* CALENDAR */}
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: offset }).map((_, index) => (
          <div
            key={`prev-${index}`}
            className="bg-secondary/5 text-primary/20 border-secondary/10 min-h-28 rounded-lg border p-2"
          >
            {prevMonthLastDay - offset + index + 1}
          </div>
        ))}

        {monthDays.map((day) => {
          const shift = getShift(day.shift);

          const cardClass = day.workDay
            ? (shift?.color ?? "bg-gray-100 text-gray-700 border-gray-300")
            : "bg-gray-100 text-gray-400 border-gray-300";

          return (
            <button
              key={day.date}
              onClick={() =>
                updateDay(day.date, {
                  workDay: !day.workDay,
                  shift: selectedShift,
                })
              }
              className={`min-h-28 rounded-lg border p-2 text-left transition hover:scale-[1.01] ${cardClass}`}
            >
              <div className="flex justify-between">
                <span className="font-semibold">
                  {new Date(day.date).getDate()}
                </span>

                <span className="text-xs opacity-70">
                  {getDayName(day.date)}
                </span>
              </div>

              <div className="mt-6 text-center text-[10px] font-medium">
                {day.workDay ? (
                  <>
                    <div>{shift?.start ? formatTime(shift.start) : ""}</div>
                    <div>{shift?.end ? formatTime(shift.end) : ""}</div>
                  </>
                ) : (
                  "REST DAY"
                )}
              </div>
            </button>
          );
        })}

        {Array.from({
          length: (7 - ((offset + monthDays.length) % 7)) % 7,
        }).map((_, index) => (
          <div
            key={`next-${index}`}
            className="bg-secondary/5 text-primary/20 border-secondary/10 min-h-28 rounded-lg border p-2"
          >
            {index + 1}
          </div>
        ))}
      </div>

      {/* SHIFT TABLE */}
      <div>
        <h2 className="mb-2 text-lg font-semibold">Shift Settings</h2>

        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Shift</th>
              <th className="border p-2">Start</th>
              <th className="border p-2">End</th>
            </tr>
          </thead>

          <tbody>
            {shifts.map((shift) => (
              <tr key={shift.name}>
                <td className={`border p-2 ${shift.color}`}>{shift.name}</td>
                <td className="border p-2">{shift.start}</td>
                <td className="border p-2">{shift.end}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DEBUG */}
      <div>
        <h2 className="mb-2 text-lg font-semibold">Generated Schedule</h2>

        <pre className="max-h-96 overflow-auto rounded bg-gray-100 p-4 text-xs">
          {JSON.stringify(days, null, 2)}
        </pre>
      </div>
    </div>
  );
}
