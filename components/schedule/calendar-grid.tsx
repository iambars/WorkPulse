"use client";

import { getDayName, formatTime12Hr } from "@/lib/schedule";
import { DaySchedule, Shift } from "@/types/schedule";
import { useMemo } from "react";

type CalendarGridProps = {
  shifts: Shift[];
  selectedShift: string;
  setDays: React.Dispatch<React.SetStateAction<DaySchedule[]>>;
  offset: number;
  prevMonthLastDay: number;
  monthDays: DaySchedule[];
};

export default function CalendarGrid({
  shifts,
  selectedShift,
  setDays,
  offset,
  prevMonthLastDay,
  monthDays,
}: CalendarGridProps) {
  const shiftMap = useMemo(
    () => Object.fromEntries(shifts.map((shift) => [shift.name, shift])),
    [shifts],
  );

  const getSafeShift = (shiftId: string | null) => {
    if (!shiftId) return shiftMap[selectedShift];
    return shiftMap[shiftId] ?? shiftMap[selectedShift];
  };

  const updateDay = (date: string, data: Partial<DaySchedule>) => {
    setDays((prev) =>
      prev.map((day) => (day.date === date ? { ...day, ...data } : day)),
    );
  };

  return (
    <>
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
        {/* PREVIOUS MONTH */}
        {Array.from({ length: offset }).map((_, index) => (
          <div
            key={`prev-${index}`}
            className="bg-secondary/5 text-primary/20 border-secondary/10 min-h-28 rounded-lg border p-2"
          >
            {prevMonthLastDay - offset + index + 1}
          </div>
        ))}

        {/* CURRENT MONTH */}
        {monthDays.map((day) => {
          // const shift = day.shiftId ? shiftMap[day.shiftId] : undefined;
          const shift = getSafeShift(day.shiftId);
          const dateObj = new Date(day.date);

          const cardClass = `
            min-h-28 rounded-lg border p-2 text-left
            transition hover:scale-[1.01]
            ${
              day.workDay
                ? (shift?.color ?? "bg-gray-100 text-gray-700 border-gray-300")
                : "bg-gray-100 text-gray-400 border-gray-300"
            }
          `;

          return (
            <button
              key={day.date}
              // aria-label={`${day.date} ${
              //   day.workDay ? (shift?.name ?? "Work Day") : "Rest Day"
              // }`}
              onClick={() => {
                const nextWorkDay = !day.workDay;

                updateDay(day.date, {
                  workDay: nextWorkDay,
                  shiftId: nextWorkDay ? selectedShift : null,
                });
              }}
              className={cardClass}
            >
              <div className="flex justify-between">
                <span className="font-semibold">{dateObj.getDate()}</span>

                <span className="text-xs opacity-70">
                  {getDayName(day.date)}
                </span>
              </div>

              <div className="mt-6 text-center text-[10px] font-medium">
                {day.workDay ? (
                  <>
                    <div>
                      {shift?.startTime ? formatTime12Hr(shift.startTime) : ""}
                    </div>

                    <div>
                      {shift?.endTime ? formatTime12Hr(shift.endTime) : ""}
                    </div>
                  </>
                ) : (
                  "REST DAY"
                )}
              </div>
            </button>
          );
        })}

        {/* NEXT MONTH */}
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
    </>
  );
}
