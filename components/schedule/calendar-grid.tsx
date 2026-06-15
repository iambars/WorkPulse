"use client";

import { getDayName, formatTime12Hr } from "@/lib/schedule";
import { DaySchedule, Shift } from "@/types/schedule";
import { useMemo } from "react";

type CalendarGridProps = {
  shifts: Shift[];
  setDays: React.Dispatch<React.SetStateAction<DaySchedule[]>>;
  offset: number;
  prevMonthLastDay: number;
  monthDays: DaySchedule[];
  activeShift: string | null;
  defaultShift: string | null;
};

export default function CalendarGrid({
  shifts,
  setDays,
  offset,
  prevMonthLastDay,
  monthDays,
  activeShift,
  defaultShift,
}: CalendarGridProps) {
  // const shiftMap = useMemo(
  //   () => Object.fromEntries(shifts.map((shift) => [shift.id, shift])),
  //   [shifts],
  // );

  const getShift = (day: DaySchedule) => {
    if (!day.workDay) return null;

    const shiftId = day.shiftId ?? defaultShift;
    return shifts.find((s) => s.id === shiftId);
  };

  const handleDayClick = (day: DaySchedule) => {
    setDays((prev) =>
      prev.map((d) => {
        if (d.date !== day.date) return d;

        // toggle rest day
        if (d.workDay) {
          return {
            ...d,
            workDay: false,
            shiftId: null,
          };
        }

        // activate work day with selected shift
        return {
          ...d,
          workDay: true,
          shiftId: activeShift,
        };
      }),
    );
  };

  return (
    <>
      {/* WEEK HEADER */}
      <div className="mb-4 grid grid-cols-7 gap-2 text-center text-sm font-semibold">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="rounded bg-gray-100 p-2">
            {d}
          </div>
        ))}
      </div>

      {/* CALENDAR GRID */}
      <div className="grid grid-cols-7 gap-2">
        {/* PREV MONTH */}
        {Array.from({ length: offset }).map((_, i) => (
          <div
            key={`prev-${i}`}
            className="min-h-28 rounded-lg border bg-gray-50 p-2 text-gray-300"
          >
            {prevMonthLastDay - offset + i + 1}
          </div>
        ))}

        {/* CURRENT MONTH */}
        {monthDays.map((day) => {
          const shift = getShift(day);
          const dateObj = new Date(day.date);

          return (
            <button
              key={day.date}
              type="button"
              onClick={() => handleDayClick(day)}
              className={`min-h-28 rounded-lg border p-2 text-left transition hover:scale-[1.01] ${
                day.workDay
                  ? (shift?.color ?? "bg-gray-100")
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {/* header */}
              <div className="flex justify-between">
                <span className="font-semibold">{dateObj.getDate()}</span>

                <span className="text-xs opacity-70">
                  {getDayName(day.date)}
                </span>
              </div>

              {/* shift info */}
              <div className="mt-6 text-center text-[10px] font-medium">
                {!day.workDay ? (
                  <span className="mt-6 text-center text-[10px] font-medium text-gray-400">
                    REST DAY
                  </span>
                ) : (
                  <>
                    <div>
                      {shift?.startTime ? formatTime12Hr(shift.startTime) : ""}
                    </div>
                    <div>
                      {shift?.endTime ? formatTime12Hr(shift.endTime) : ""}
                    </div>
                  </>
                )}
              </div>

              {/* override indicator */}
              {day.shiftId && day.shiftId !== defaultShift && (
                <div className="mt-2 text-[10px] text-blue-500">overridden</div>
              )}
            </button>
          );
        })}

        {/* NEXT MONTH (filler) */}
        {Array.from({
          length: (7 - ((offset + monthDays.length) % 7)) % 7,
        }).map((_, i) => (
          <div
            key={`next-${i}`}
            className="min-h-28 rounded-lg border bg-gray-50 p-2 text-gray-300"
          >
            {i + 1}
          </div>
        ))}
      </div>
    </>
  );
}
