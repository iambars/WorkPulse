"use client";

import { saveSchedule } from "@/actions/schedule";
import {
  CalendarGrid,
  MonthNavigation,
  ShiftSelector,
} from "@/components/schedule";
import { DEFAULT_SHIFTS } from "@/constants/shifts";
import { getMonthDays, useCalendarMonth } from "@/hooks/useCalendarMonth";
import { createYearSchedule } from "@/lib/schedule";
import { DaySchedule } from "@/types/schedule";
import { useMemo, useState } from "react";

export default function ScheduleCalendar() {
  const year = 2026;
  const shifts = DEFAULT_SHIFTS;

  const [currentMonth, setCurrentMonth] = useState(5); // June
  const [days, setDays] = useState<DaySchedule[]>(createYearSchedule(year));
  const [draftDays, setDraftDays] = useState<DaySchedule[]>(
    createYearSchedule(year),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [selectedShift, setSelectedShift] = useState("Shift 1");

  const { monthName, offset, prevMonthLastDay } = useCalendarMonth({
    year,
    month: currentMonth,
  });

  const monthDays = useMemo(() => {
    return getMonthDays(draftDays, year, currentMonth);
  }, [draftDays, currentMonth, year]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await saveSchedule(
        draftDays.map((day) => ({
          employeeId: "user 1",
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

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
      >
        {isSaving ? "Saving..." : "Save Schedule"}{" "}
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

      {/* SHIFT TABLE */}
      <div>
        <h2 className="mb-2 text-lg font-semibold">Shift Settings</h2>

        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Shift</th>
              <th className="border p-2">Start</th>
              <th className="border p-2">End</th>
            </tr>
          </thead>

          <tbody>
            {shifts.map((shift) => (
              <tr key={shift.name}>
                <td className={`border p-2 ${shift.color}`}>{shift.name}</td>
                <td className="border p-2">{shift.start}</td>
                <td className="border p-2">{shift.end}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DEBUG */}
      <div>
        <h2 className="mb-2 text-lg font-semibold">Generated Schedule</h2>

        <pre className="max-h-96 overflow-auto rounded bg-gray-100 p-4 text-xs">
          {JSON.stringify(days, null, 2)}
        </pre>
      </div>
    </div>
  );
}
