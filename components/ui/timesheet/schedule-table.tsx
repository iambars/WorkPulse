"use client";

import { useState } from "react";

type Row = {
  date: string;
  shift: string;
  selected: boolean;
};

type Shift = {
  name: string;
  start: string;
  end: string;
  color: string;
};

export default function ScheduleTable() {
  const cutoffStart = new Date("2026-06-01");

  const [defaultShift, setDefaultShift] = useState("SHIFT_1");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const [shifts] = useState<Shift[]>([
    {
      name: "SHIFT_1",
      start: "08:00",
      end: "17:00",
      color: "bg-blue-100 text-blue-700",
    },
    {
      name: "SHIFT_2",
      start: "09:00",
      end: "18:00",
      color: "bg-green-100 text-green-700",
    },
  ]);

  const [rows, setRows] = useState<Row[]>(
    Array.from({ length: 15 }, (_, i) => {
      const d = new Date(cutoffStart);
      d.setDate(cutoffStart.getDate() + i);

      return {
        date: d.toISOString().split("T")[0],
        shift: "SHIFT_1",
        selected: true,
      };
    }),
  );

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const getDay = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
    });

  const updateRow = (index: number, data: Partial<Row>) => {
    const copy = [...rows];
    copy[index] = { ...copy[index], ...data };
    setRows(copy);
  };

  const applyDefaultShift = (shift: string) => {
    setDefaultShift(shift);

    setRows((prev) =>
      prev.map((r) =>
        r.selected
          ? {
              ...r,
              shift,
            }
          : r,
      ),
    );
  };

  const getShiftStyle = (shiftName: string) => {
    return (
      shifts.find((s) => s.name === shiftName)?.color ??
      "bg-gray-100 text-gray-600"
    );
  };

  return (
    <div className="space-y-8">
      {/* ================= SHIFT SETTINGS ================= */}
      <div>
        <h2 className="mb-2 font-semibold">Shift Settings</h2>

        <div className="mb-4">
          <label className="text-sm font-medium">Default Shift:</label>

          <select
            value={defaultShift}
            onChange={(e) => applyDefaultShift(e.target.value)}
            className="ml-2 border p-1"
          >
            {shifts.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name} ({s.start}-{s.end})
              </option>
            ))}
          </select>
        </div>

        {/* TOP SHIFT TABLE (RESTORED) */}
        <table className="w-full table-fixed border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="w-40 border p-2">Shift</th>
              <th className="w-24 border p-2">Start</th>
              <th className="w-24 border p-2">End</th>
            </tr>
          </thead>

          <tbody>
            {shifts.map((s, i) => (
              <tr key={i}>
                <td className={`border p-2 ${s.color}`}>{s.name}</td>
                <td className="border p-2">{s.start}</td>
                <td className="border p-2">{s.end}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= ROSTER TABLE ================= */}
      <table className="w-full table-fixed border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="w-40 border p-2">Date</th>
            <th className="w-24 border p-2">Day</th>
            <th className="w-48 border p-2">Shift</th>
            <th className="w-28 border p-2">Work Day</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {/* DATE */}
              <td className="border p-2 font-medium">{formatDate(row.date)}</td>

              {/* DAY */}
              <td className="border p-2">{getDay(row.date)}</td>

              {/* SHIFT DROPDOWN */}
              <td className="border p-2">
                <div className="relative w-36">
                  <div
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="cursor-pointer p-1"
                  >
                    <span
                      className={`inline-block w-full rounded px-2 py-1 text-xs ${getShiftStyle(
                        row.shift,
                      )}`}
                    >
                      {row.shift}
                    </span>
                  </div>

                  {openIndex === i && (
                    <div className="absolute z-10 mt-1 w-full border bg-white shadow">
                      {shifts.map((s) => (
                        <div
                          key={s.name}
                          onClick={() => {
                            updateRow(i, {
                              shift: s.name,
                            });
                            setOpenIndex(null);
                          }}
                          className="flex cursor-pointer items-center justify-between px-2 py-1 hover:bg-gray-100"
                        >
                          <span className="text-xs">{s.name}</span>

                          <span
                            className={`rounded px-2 py-0.5 text-[10px] ${s.color}`}
                          >
                            ●
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </td>

              {/* WORK DAY */}
              <td className="border p-2 text-center">
                <input
                  type="checkbox"
                  checked={row.selected}
                  onChange={() =>
                    updateRow(i, {
                      selected: !row.selected,
                      shift: !row.selected ? defaultShift : row.shift,
                    })
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
