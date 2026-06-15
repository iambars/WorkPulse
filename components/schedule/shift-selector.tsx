"use client";

import { Shift } from "@/types/schedule";

type ShiftSelectorProps = {
  shifts: Shift[];
  selectedShift: string | null;
  setSelectedShift: (shift: string | null) => void;
};

export default function ShiftSelector({
  shifts,
  selectedShift,
  setSelectedShift,
}: ShiftSelectorProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {shifts.map((shift) => {
        const isActive = selectedShift === shift.id;
        return (
          <div key={shift.id} className="flex flex-col gap-2">
            <button
              onClick={() => setSelectedShift(shift.id)}
              className={`peer rounded-full border px-3 py-2 text-sm ${
                isActive
                  ? "border-1.5 scale-105 shadow-md ring-1 ring-transparent"
                  : "scale-95 opacity-40 hover:opacity-60"
              } ${shift.color}`}
            >
              {shift.name}
            </button>

            {/* time label */}
            <span
              className={`text-secondary border-secondary/20 invisible rounded-full border px-3 py-1.5 text-center text-xs opacity-0 transition-all peer-hover:visible peer-hover:opacity-100 ${selectedShift === shift.id && "visible opacity-100"}`}
            >
              {shift.startTime} - {shift.endTime}
            </span>
          </div>
        );
      })}
    </div>
  );
}
