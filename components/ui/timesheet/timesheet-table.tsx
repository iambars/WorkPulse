"use client";

import { useState } from "react";

type Row = {
  date: string;
  shift: "SHIFT_1" | "SHIFT_2";
  scheduledIn: string;
  scheduledOut: string;
  timeIn: string;
  timeOut: string;
  breakHours: number;
  remarks?: string;
};

type Shift = {
  name: string;
  color: string;
};

export default function TimesheetTable() {
  const [shifts] = useState<Shift[]>([
    { name: "SHIFT_1", color: "bg-blue-100 text-blue-700" },
    { name: "SHIFT_2", color: "bg-green-100 text-green-700" },
  ]);

  const [rows] = useState<Row[]>([
    {
      date: "2026-06-01",
      shift: "SHIFT_1",
      scheduledIn: "08:00",
      scheduledOut: "17:00",
      timeIn: "08:05",
      timeOut: "17:30",
      breakHours: 1,
      remarks: "",
    },
    {
      date: "2026-06-02",
      shift: "SHIFT_1",
      scheduledIn: "08:00",
      scheduledOut: "17:00",
      timeIn: "08:00",
      timeOut: "17:00",
      breakHours: 1,
      remarks: "On time",
    },
    {
      date: "2026-06-03",
      shift: "SHIFT_2",
      scheduledIn: "09:00",
      scheduledOut: "18:00",
      timeIn: "09:10",
      timeOut: "18:20",
      breakHours: 1,
      remarks: "Late login",
    },
  ]);

  // ---------------- helpers ----------------

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const getHours = (inT: string, outT: string, breakH: number) => {
    const [ih, im] = inT.split(":").map(Number);
    const [oh, om] = outT.split(":").map(Number);

    return (oh * 60 + om - (ih * 60 + im)) / 60 - breakH;
  };

  const getOT = (hours: number) => Math.max(0, hours - 8);

  const getStatus = (row: Row, hours: number) => {
    const [sh, sm] = row.scheduledIn.split(":").map(Number);
    const [ih, im] = row.timeIn.split(":").map(Number);

    const lateMinutes = ih * 60 + im - (sh * 60 + sm);

    if (lateMinutes > 0) return "Late";
    if (hours >= 8) return "Present";
    return "Undertime";
  };

  const getShiftStyle = (shiftName: string) =>
    shifts.find((s) => s.name === shiftName)?.color ??
    "bg-gray-100 text-gray-600";

  const getStatusStyle = (status: string) => {
    switch (status) {
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
    <div className="w-full overflow-x-auto">
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
            const hours = getHours(row.timeIn, row.timeOut, row.breakHours);
            const ot = getOT(hours);
            const status = getStatus(row, hours);

            return (
              <tr key={i} className="hover:bg-gray-50">
                {/* DATE */}
                <td className="border p-2 font-medium">
                  {formatDate(row.date)}
                </td>

                {/* SHIFT (colored badge) */}
                <td className="border p-2">
                  <span
                    className={`inline-block rounded px-2 py-1 text-xs ${getShiftStyle(
                      row.shift,
                    )}`}
                  >
                    {row.shift}
                  </span>
                </td>

                {/* SCHEDULE */}
                <td className="border p-2">{row.scheduledIn}</td>
                <td className="border p-2">{row.scheduledOut}</td>

                {/* ACTUAL */}
                <td className="border p-2">{row.timeIn}</td>
                <td className="border p-2">{row.timeOut}</td>

                {/* HOURS */}
                <td className="border p-2 font-medium">{hours.toFixed(2)}</td>

                {/* OT */}
                <td className="border p-2">{ot.toFixed(2)}</td>

                {/* STATUS (colored badge) */}
                <td className="border p-2">
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
