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
  // const [selectedShift, setSelectedShift] = useState(shifts?.[0]?.id ?? "");
  const defaultShift = useMemo(() => shifts[0]?.name ?? "", [shifts]);

  const [selectedShift, setSelectedShift] = useState(defaultShift);
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
    <div className="mx-auto w-full max-w-5xl space-y-4 px-2 sm:px-4">
      <ShiftSelector
        shifts={shifts}
        selectedShift={selectedShift}
        setSelectedShift={setSelectedShift}
      />

      <ShiftSetting shifts={shifts} />

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
        selectedShift={selectedShift}
      />

      <div>
        <h2 className="mb-2 text-lg font-semibold">Shift Settings</h2>

        <table className="w-full border text-sm">
          <tbody>
            {shifts.map((shift) => (
              <tr key={shift.id}>
                <td className={`border p-2 ${shift.color}`}>{shift.name}</td>
                <td className="border p-2">{shift.startTime}</td>
                <td className="border p-2">{shift.endTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <pre className="max-h-96 overflow-auto rounded bg-gray-100 p-4 text-xs">
        {JSON.stringify(days, null, 2)}
      </pre>
    </div>
  );
}
