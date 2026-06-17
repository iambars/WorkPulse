"use client";

import { MonthNavigation } from "@/components/schedule";
import { useCalendarMonth } from "@/hooks/useCalendarMonth";

import { Schedule, Shift } from "@/types/schedule";
import { useMemo, useState } from "react";

type Row = {
  date: string;
  isRestDay: boolean;
  shiftName?: string;
  color?: string;
  scheduledIn?: string;
  scheduledOut?: string;
  timeIn?: string;
  timeOut?: string;
  breakHours: number;
  remarks?: string;
};

type Props = {
  shifts: Shift[];
  initialSchedules: Schedule[];
};

export default function AttendanceTable({ shifts, initialSchedules }: Props) {
  console.log("initialSchedules: ", initialSchedules);

  const year = 2026;
  const [currentMonth, setCurrentMonth] = useState(5);
  const { monthName } = useCalendarMonth({
    year,
    month: currentMonth,
  });
  // const initialScheduleRef = useRef<DaySchedule[]>(
  //   structuredClone(createYearSchedule(year, initialSchedules)),
  // );

  const rows = useMemo(() => {
    const monthSchedules = initialSchedules.filter((sched) => {
      const date = new Date(sched.date);

      return date.getFullYear() === year && date.getMonth() === currentMonth;
    });

    return monthSchedules.map((sched) => {
      const workDayShift = shifts.find((s) => s.id === sched.shiftId);

      return {
        date: sched.date,
        isRestDay: !workDayShift,
        shiftName: workDayShift?.name,
        color: workDayShift?.color,
        scheduledIn: workDayShift?.startTime,
        scheduledOut: workDayShift?.endTime,

        // temp values
        timeIn: "09:00",
        timeOut: "18:00",
        // timeIn: workDayShift?.startTime,
        // timeOut: workDayShift?.endTime,
        breakHours: 1,
        remarks: "Late login",
      };
    });
  }, [initialSchedules, shifts, currentMonth, year]);

  // ---------------- helpers ----------------

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      // year: "numeric",
    });

  const getHours = (inT: string, outT: string, breakH: number) => {
    const [ih, im] = inT.split(":").map(Number);
    const [oh, om] = outT.split(":").map(Number);

    return (oh * 60 + om - (ih * 60 + im)) / 60 - breakH;
  };

  const getOT = (hours: number, isRestDay: boolean) => {
    if (isRestDay) return hours;
    const ot = Math.max(0, hours - 8);

    return ot === 0 ? null : ot;
  };

  const getStatus = (row: Row, hours: number) => {
    if (row.isRestDay) return "Rest Day";
    if (!row.scheduledIn || !row.timeIn) return "Unknown";

    const [sh, sm] = row.scheduledIn.split(":").map(Number);
    const [ih, im] = row.timeIn.split(":").map(Number);

    const lateMinutes = ih * 60 + im - (sh * 60 + sm);

    if (lateMinutes > 0) return "Late";
    if (hours >= 8) return "Present";
    return "Undertime";
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Rest Day":
        return "text-gray-600 bg-gray-100";
      case "Late":
        return "text-red-600 bg-red-50";
      case "Present":
        return "text-green-700 bg-green-50";
      case "Undertime":
        return "text-yellow-700 bg-yellow-50";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="flex w-full flex-col gap-8 overflow-x-auto py-8">
      <MonthNavigation
        monthName={monthName}
        setCurrentMonth={setCurrentMonth}
      />
      <table className="w-full table-fixed border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Date</th>
            <th className="border p-2">Shift</th>
            <th className="border p-2">Scheduled In</th>
            <th className="border p-2">Scheduled Out</th>
            <th className="border p-2">Time In</th>
            <th className="border p-2">Time Out</th>
            <th className="border p-2">Hours</th>
            <th className="border p-2">OT</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => {
            if (!row) return;

            const workedHours =
              row.timeIn && row.timeOut
                ? getHours(row.timeIn, row.timeOut, row.breakHours)
                : null;

            const hours = !row.isRestDay ? workedHours : null;

            const ot =
              workedHours !== null ? getOT(workedHours, row.isRestDay) : null;

            const status = hours !== null ? getStatus(row, hours) : "Rest Day";

            return (
              <tr key={i}>
                {/* Date */}
                <td
                  className={`border p-2 ${row.isRestDay && "bg-blue-400/30"}`}
                >
                  {formatDate(row.date)}
                </td>
                {/* SHIFT (colored badge) */}
                <td
                  className={`border p-2 ${row.isRestDay && "bg-blue-400/30"}`}
                >
                  <span
                    className={`inline-block rounded px-2 py-1 text-xs ${row.color} `}
                  >
                    {row.shiftName ?? "-"}
                  </span>
                </td>
                {/* SCHEDULE */}
                <td
                  className={`border p-2 ${row.isRestDay && "bg-blue-400/30"}`}
                >
                  {row.scheduledIn ?? "-"}
                </td>
                <td
                  className={`border p-2 ${row.isRestDay && "bg-blue-400/30"}`}
                >
                  {row.scheduledOut ?? "-"}
                </td>
                {/* ACTUAL */}
                <td
                  className={`border p-2 ${row.isRestDay && "bg-blue-400/30"}`}
                >
                  {row.timeIn ?? "-"}
                </td>
                <td
                  className={`border p-2 ${row.isRestDay && "bg-blue-400/30"}`}
                >
                  {row.timeOut ?? "-"}
                </td>
                {/* HOURS */}
                <td
                  className={`border p-2 ${row.isRestDay && "bg-blue-400/30"}`}
                >
                  {hours?.toFixed(2) ?? "-"}
                </td>
                {/* OT */}
                <td
                  className={`border p-2 ${row.isRestDay && "bg-blue-400/30"}`}
                >
                  {ot?.toFixed(2) ?? "-"}
                </td>

                {/* STATUS (colored badge) */}
                <td
                  className={`border p-2 ${row.isRestDay && "bg-blue-400/30"}`}
                >
                  <span
                    className={`inline-block rounded px-2 py-1 text-xs font-medium ${getStatusStyle(
                      status,
                    )}`}
                  >
                    {status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
