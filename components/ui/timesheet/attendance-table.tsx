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

  const header = [
    "Date",
    "Shift",
    "Scheduled In",
    "Scheduled Out",
    "Time In",
    "Time Out",
    " Hours",
    "OT",
    "Status",
  ];

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
      <table className="border-secondary/80 w-full table-fixed rounded-2xl text-sm">
        <thead className="">
          <tr>
            {header.map((item, i) => (
              <th
                key={i}
                className="border-secondary/50 dark:border-secondary/20 dark:text-secondary/90 dark:text- border bg-blue-600/70 p-2 dark:bg-blue-900/85"
              >
                {item}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => {
            const { timeIn, timeOut, hours, ot } = getAttendanceMetrics(
              row,
              attendance,
            );
            const status = getStatus(row, timeIn, hours);
            const tdClass =
              "border-secondary/50 dark:border-secondary/25 text-primary/80 dark:text-secondary/80 border p-2";

            return (
              <tr key={row.date}>
                {/* Date */}
                <td
                  className={`${tdClass} ${row.isRestDay && "bg-blue-400/30 dark:bg-blue-400/5"}`}
                >
                  {formatDate(row.date)}
                </td>

                {/* SHIFT (colored badge) */}
                <td
                  className={`${tdClass} ${row.isRestDay && "bg-blue-400/30 dark:bg-blue-400/5"}`}
                >
                  <span
                    className={`inline-block rounded px-2 py-1 text-xs dark:border-none dark:bg-transparent ${row.color}`}
                  >
                    {row.shiftName ?? "-"}
                  </span>
                </td>
                {/* SCHEDULE */}
                <td
                  className={`${tdClass} ${row.isRestDay && "bg-blue-400/30 dark:bg-blue-400/5"}`}
                >
                  {row.scheduledIn ?? "-"}
                </td>
                <td
                  className={`${tdClass} ${row.isRestDay && "bg-blue-400/30 dark:bg-blue-400/5"}`}
                >
                  {row.scheduledOut ?? "-"}
                </td>
                {/* ACTUAL */}
                <td
                  className={`${tdClass} ${row.isRestDay && "bg-blue-400/30 dark:bg-blue-400/5"}`}
                >
                  <input
                    type="time"
                    value={timeIn}
                    onChange={(e) =>
                      updateAttendance(row.date, "timeIn", e.target.value)
                    }
                    className="w-full rounded-lg border border-blue-600/50 px-2 py-1 dark:border-blue-800 dark:[color-scheme:dark] dark:opacity-50"
                    // disabled={row.isRestDay}
                  />
                </td>
                <td
                  className={`${tdClass} ${row.isRestDay && "bg-blue-400/30 dark:bg-blue-400/5"}`}
                >
                  <input
                    type="time"
                    value={timeOut}
                    onChange={(e) =>
                      updateAttendance(row.date, "timeOut", e.target.value)
                    }
                    className="w-full rounded-lg border border-red-500/50 px-2 py-1 dark:border-red-500/60 dark:[color-scheme:dark] dark:opacity-50"
                    // disabled={row.isRestDay}
                  />
                </td>
                {/* HOURS */}
                <td
                  className={`${tdClass} ${row.isRestDay && "bg-blue-400/30 dark:bg-blue-400/5"}`}
                >
                  {hours?.toFixed(2) ?? "-"}
                </td>
                {/* OT */}
                <td
                  className={`${tdClass} ${row.isRestDay && "bg-blue-400/30 dark:bg-blue-400/5"}`}
                >
                  {ot?.toFixed(2) ?? "-"}
                </td>

                {/* STATUS (colored badge) */}
                <td
                  className={`${tdClass} ${row.isRestDay && "bg-blue-400/30 dark:bg-blue-400/5"}`}
                >
                  <span
                    className={`inline-block rounded px-2 py-1 text-xs font-medium dark:bg-transparent ${getStatusStyle(
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

        <tfoot className="font-semibold">
          <tr className="dark:bg-blue-900/85">
            <td
              colSpan={6}
              className="border-secondary/50 dark:border-secondary/20 text-primary dark:text-primary/60 border bg-blue-600/70 p-2 text-left"
            >
              Total
            </td>

            <td className="border-secondary/50 dark:border-secondary/20 text-primary/80 dark:text-primary/60 border bg-blue-600/70 p-2">
              {totals.hours.toFixed(2)}
            </td>

            <td className="border-secondary/50 dark:border-secondary/20 text-primary/80 dark:text-primary/60 border bg-blue-600/70 p-2">
              {totals.ot.toFixed(2)}
            </td>

            <td className="border-secondary/50 dark:border-secondary/20 text-primary border bg-blue-600/70 p-2"></td>
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
