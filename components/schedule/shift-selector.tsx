"use client";

import { Shift } from "@/types/schedule";
import { Settings } from "lucide-react";
import { useState } from "react";

type ShiftSelectorProps = {
  shifts: Shift[];
  selectedShift: string;
  setSelectedShift: (shift: string) => void;
};

export default function ShiftSelector({
  shifts,
  selectedShift,
  setSelectedShift,
}: ShiftSelectorProps) {
  const [open, setOpen] = useState(true);
  console.log(open);
  return (
    <div className="flex items-start justify-between">
      <div className="flex flex-wrap gap-4">
        {shifts.map((shift) => (
          <div key={shift.id} className="flex flex-col gap-2">
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

            {/* time label */}
            <span
              className={`text-secondary border-secondary/20 invisible rounded-full border px-3 py-1.5 text-center text-xs opacity-0 transition-all peer-hover:visible peer-hover:opacity-100 ${selectedShift === shift.name && "visible opacity-100"}`}
            >
              {shift.startTime} - {shift.endTime}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={() => setOpen(!open)}
        className="bg-secondary/10 text-secondary hover:text-primary hover:border-secondary/20 flex items-center gap-2 rounded-full px-4 py-2 hover:border"
      >
        <span>Shift Settings</span>
        <Settings size={20} />
      </button>
    </div>
  );
}
