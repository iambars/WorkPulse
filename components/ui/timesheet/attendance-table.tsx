"use client";

import { saveAttendance } from "@/actions/attendance";
import { MonthNavigation } from "@/components/schedule";
import { useCalendarMonth } from "@/hooks/useCalendarMonth";
import {
  formatDate,
  getAttendanceMetrics,
  getStatus,
  getStatusStyle,
} from "@/lib/attendance";

import { AttendanceRecord, Schedule, Shift } from "@/types/schedule";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  shifts: Shift[];
  initialSchedules: Schedule[];
  initialAttendance: AttendanceRecord[];
};

type AttendanceValues = Record<string, { timeIn: string; timeOut: string }>;

export default function AttendanceTable({
  shifts,
  initialSchedules,
  initialAttendance,
}: Props) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const initialAttendanceRef = useRef<AttendanceValues | null>(null);
  const [attendance, setAttendance] = useState<AttendanceValues>({});

  const { monthName } = useCalendarMonth({
    year,
    month: currentMonth,
  });

  const attendanceMap = useMemo(
    () => new Map(initialAttendance.map((a) => [a.date, a])),
    [initialAttendance],
  );

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
        breakHours: 1,
      };
    });
  }, [initialSchedules, shifts, currentMonth, year]);

  useEffect(() => {
    const initialAttendanceState: AttendanceValues = {};

    rows.forEach((row) => {
      const savedAttendance = attendanceMap.get(row.date);

      initialAttendanceState[row.date] = {
        timeIn: savedAttendance?.timeIn ?? row.scheduledIn ?? "",
        timeOut: savedAttendance?.timeOut ?? row.scheduledOut ?? "",
      };
    });

    setAttendance(initialAttendanceState);
    initialAttendanceRef.current = structuredClone(initialAttendanceState);
  }, [rows, attendanceMap]);

  const handleSave = async () => {
    try {
      setIsSaving(true);

      await saveAttendance({
        records: rows.map((row) => {
          const { timeIn, timeOut, hours } = getAttendanceMetrics(
            row,
            attendance,
          );
          const status = getStatus(row, timeIn, hours);

          return {
            date: row.date,
            timeIn,
            timeOut,
            remarks: status,
          };
        }),
      });

      initialAttendanceRef.current = structuredClone(attendance);
      alert("Attendance saved successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to save the attendance");
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = useMemo(() => {
    const initial = initialAttendanceRef.current;
    if (!initial) return false;

    return JSON.stringify(initial) !== JSON.stringify(attendance);
  }, [attendance]);

  const totals = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        const { hours, ot } = getAttendanceMetrics(row, attendance);

        return {
          hours: acc.hours + (hours ?? 0),
          ot: acc.ot + (ot ?? 0),
        };
      },
      { hours: 0, ot: 0 },
    );
  }, [rows, attendance]);

  const updateAttendance = (
    date: string,
    field: "timeIn" | "timeOut",
    value: string,
  ) => {
    setAttendance((prev) => ({
      ...prev,
      [date]: {
        ...prev[date],
        [field]: value,
      },
    }));
  };

  // console.log("monthName: ", monthName);
  // console.log("currentMonth: ", currentMonth);

  return (
    <div className="flex w-full flex-col gap-8 overflow-x-auto py-8">
      <MonthNavigation
        year={year}
        setYear={setYear}
        monthName={monthName}
        currentMonth={currentMonth}
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
          {rows.map((row) => {
            const { timeIn, timeOut, hours, ot } = getAttendanceMetrics(
              row,
              attendance,
            );
            const status = getStatus(row, timeIn, hours);

            return (
              <tr key={row.date}>
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
                  <input
                    type="time"
                    value={timeIn}
                    onChange={(e) =>
                      updateAttendance(row.date, "timeIn", e.target.value)
                    }
                    className="w-full rounded-lg border border-blue-600/50 px-2 py-1"
                    // disabled={row.isRestDay}
                  />
                </td>
                <td
                  className={`border p-2 ${row.isRestDay && "bg-blue-400/30"}`}
                >
                  <input
                    type="time"
                    value={timeOut}
                    onChange={(e) =>
                      updateAttendance(row.date, "timeOut", e.target.value)
                    }
                    className="w-full rounded-lg border border-red-500/50 px-2 py-1"
                    // disabled={row.isRestDay}
                  />{" "}
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

        <tfoot className="bg-gray-100 font-semibold">
          <tr>
            <td colSpan={6} className="border p-2 text-left">
              Total
            </td>

            <td className="border p-2">{totals.hours.toFixed(2)}</td>

            <td className="border p-2">{totals.ot.toFixed(2)}</td>

            <td className="border p-2">-</td>
          </tr>
        </tfoot>
      </table>

      {/* Save button  */}
      <div className="flex w-full justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`rounded-2xl border border-blue-500/80 px-4 py-2 text-blue-800 ${
            isSaving || !hasChanges
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-blue-600 hover:text-white"
          }`}
        >
          Save
        </button>
      </div>
    </div>
  );
}
