"use client";

import { saveAttendance } from "@/actions/attendance";
import { MonthNavigation } from "@/components/schedule";
import { useCalendarMonth } from "@/hooks/useCalendarMonth";

import { Schedule, Shift } from "@/types/schedule";
import { useEffect, useMemo, useState } from "react";

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

type AttendanceValues = Record<string, { timeIn: string; timeOut: string }>;

export default function AttendanceTable({ shifts, initialSchedules }: Props) {
  const year = 2026;
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [currentMonth, setCurrentMonth] = useState(5);
  const { monthName } = useCalendarMonth({
    year,
    month: currentMonth,
  });
  // const initialScheduleRef = useRef<DaySchedule[]>(
  //   structuredClone(createYearSchedule(year, initialSchedules)),
  // );

  const [attendance, setAttendance] = useState<AttendanceValues>({});

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
    const initialAttendance: AttendanceValues = {};

    rows.forEach((row) => {
      initialAttendance[row.date] = {
        timeIn: row.scheduledIn ?? "",
        timeOut: row.scheduledOut ?? "",
      };
    });
    setAttendance(initialAttendance);
  }, [rows]);

  const handleSave = async () => {
    try {
      setIsSaving(true);

      await saveAttendance({
        records: rows.map((row) => {
          const { timeIn, timeOut, hours } = getAttendanceMetrics(row);
          const status = getStatus(row, timeIn, hours);

          return {
            date: row.date,
            timeIn,
            timeOut,
            remarks: status,
          };
        }),
      });

      alert("Attendance saved successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to save the attendance");
    } finally {
      setIsSaving(false);
    }
  };

  // ---------------- helpers ----------------

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      // year: "numeric",
    });

  const getWorkedHours = (inT: string, outT: string, breakH: number) => {
    const [ih, im] = inT.split(":").map(Number);
    const [oh, om] = outT.split(":").map(Number);

    return (oh * 60 + om - (ih * 60 + im)) / 60 - breakH;
  };

  const getRegularHours = (workedHours: number, isRestDay: boolean) => {
    if (isRestDay) return null;
    return Math.min(workedHours, 8);
  };

  const getOT = (workedHours: number, isRestDay: boolean) => {
    if (isRestDay) return workedHours;

    const ot = workedHours - 8;

    return ot > 0 ? ot : null;
  };

  const getAttendanceTimes = (date: string) => ({
    timeIn: attendance[date]?.timeIn ?? "",
    timeOut: attendance[date]?.timeOut ?? "",
  });

  const getAttendanceMetrics = (row: Row) => {
    const { timeIn, timeOut } = getAttendanceTimes(row.date);

    const workedHours =
      timeIn && timeOut
        ? getWorkedHours(timeIn, timeOut, row.breakHours)
        : null;

    const hours =
      workedHours !== null ? getRegularHours(workedHours, row.isRestDay) : null;

    const ot = workedHours !== null ? getOT(workedHours, row.isRestDay) : null;

    return {
      timeIn,
      timeOut,
      workedHours,
      hours,
      ot,
    };
  };

  const getStatus = (row: Row, timeIn: string, hours: number | null) => {
    if (row.isRestDay) return "Rest Day";
    if (!row.scheduledIn || !timeIn || hours === null) return "Unknown";

    const [sh, sm] = row.scheduledIn.split(":").map(Number);
    const [ih, im] = timeIn.split(":").map(Number);

    const isLate = ih * 60 + im > sh * 60 + sm;
    const isUndertime = hours < 8;

    if (isLate && isUndertime) return "Late & Undertime";
    if (isLate) return "Late";
    if (isUndertime) return "Undertime";
    return "Present";
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Rest Day":
        return "text-gray-600 bg-gray-100";
      case "Late":
      case "Late & Undertime":
        return "text-red-600 bg-red-50";
      case "Present":
        return "text-green-700 bg-green-50";
      case "Undertime":
        return "text-yellow-700 bg-yellow-50";
      default:
        return "text-gray-600";
    }
  };

  const totals = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        const { hours, ot } = getAttendanceMetrics(row);

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
          {rows.map((row) => {
            const { timeIn, timeOut, hours, ot } = getAttendanceMetrics(row);
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
            isSaving
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
