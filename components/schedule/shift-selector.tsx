"use client";

import { Shift } from "@/types/schedule";

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
  // const [open, setOpen] = useState(true);
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
      {/* create shift */}
      <button
        // onClick={() => setOpen(true)}
        className="rounded-full border px-3 py-2 text-sm opacity-60 hover:opacity-100"
      >
        + Add Shift
      </button>
      {/* <ShiftManagerModal
        open={open}
        shifts={shifts}
        onClose={() => setOpen(false)}
        onCreate={() => {}}
        onUpdate={() => {}}
        onDelete={() => {}}
      /> */}
    </div>
  );
}
