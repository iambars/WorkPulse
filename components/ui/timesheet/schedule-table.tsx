"use client";

import { useMemo, useState } from "react";
import { saveSchedule } from "@/actions/schedule";
import {
  ShiftSelector,
  ShiftSetting,
  MonthNavigation,
  CalendarGrid,
} from "@/components/schedule";
import { useCalendarMonth, getMonthDays } from "@/hooks/useCalendarMonth";
import { createYearSchedule } from "@/lib/schedule";
import { DaySchedule, Shift } from "@/types/schedule";

type Props = {
  shifts: Shift[];
  employeeId: string;
};

export default function ScheduleClient({ shifts, employeeId }: Props) {
  const year = 2026;

  const initialSchedule = useMemo(() => createYearSchedule(year), [year]);

  const [days, setDays] = useState<DaySchedule[]>(initialSchedule);
  const [draftDays, setDraftDays] = useState<DaySchedule[]>(initialSchedule);
  const [currentMonth, setCurrentMonth] = useState(5);

  // const [selectedShift, setSelectedShift] = useState(initialShift);

  const initialShift = shifts[0]?.name ?? "";
  const [defaultShift, setDefaultShift] = useState(initialShift);
  const [activeShift, setActiveShift] = useState(initialShift);

  const [isSaving, setIsSaving] = useState(false);

  const { monthName, offset, prevMonthLastDay } = useCalendarMonth({
    year,
    month: currentMonth,
  });

  const monthDays = useMemo(
    () => getMonthDays(draftDays, year, currentMonth),
    [draftDays, currentMonth, year],
  );

  const hasChanges = JSON.stringify(days) !== JSON.stringify(draftDays);

  const handleSave = async () => {
    try {
      setIsSaving(true);

      await saveSchedule(
        draftDays.map((day) => ({
          date: day.date,
          workDay: day.workDay,
          shiftId: day.shiftId ?? null,
        })),
      );

      setDays(draftDays);
    } catch (error) {
      console.error(error);
      alert("Failed to save schedule");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-4 px-2 pt-8 sm:px-4">
      {/* DEFAULT SHIFT CONTROL */}

      <div className="">
        <h2 className="text-md mb-2 font-semibold">Select a default shift</h2>

        <ShiftSelector
          shifts={shifts}
          selectedShift={defaultShift}
          setSelectedShift={setDefaultShift}
        />
      </div>

      <ShiftSetting shifts={shifts} />

      {/* ACTIVE SHIFT (FOR OVERRIDES) */}
      <ShiftSelector
        shifts={shifts}
        selectedShift={activeShift}
        setSelectedShift={setActiveShift}
      />

      <button
        onClick={handleSave}
        disabled={isSaving || !hasChanges}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white"
      >
        {isSaving ? "Saving..." : "Save Schedule"}
      </button>

      <MonthNavigation
        monthName={monthName}
        setCurrentMonth={setCurrentMonth}
      />

      <CalendarGrid
        shifts={shifts}
        setDays={setDraftDays}
        offset={offset}
        prevMonthLastDay={prevMonthLastDay}
        monthDays={monthDays}
        activeShift={activeShift}
        defaultShift={defaultShift}
      />

      <pre className="max-h-96 overflow-auto rounded bg-gray-100 p-4 text-xs">
        {JSON.stringify(draftDays, null, 2)}
      </pre>
    </div>
  );
}
