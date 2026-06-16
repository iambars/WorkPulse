"use client";

import { useMemo, useState } from "react";
import { saveSchedule } from "@/actions/schedule";
import {
  ShiftSelector,
  ShiftSetting,
  MonthNavigation,
  CalendarGrid,
  ShiftSettingButton,
} from "@/components/schedule";
import { useCalendarMonth, getMonthDays } from "@/hooks/useCalendarMonth";
import { createYearSchedule } from "@/lib/schedule";
import { DaySchedule, Schedule, Shift } from "@/types/schedule";
import { useRouter } from "next/navigation";

type Props = {
  shifts: Shift[];
  initialSchedules: Schedule[];
};

export default function ScheduleClient({ shifts, initialSchedules }: Props) {
  const year = 2026;
  const router = useRouter();
  const firstShiftId = shifts[0]?.id ?? null;
  const [shiftsState, setShiftsState] = useState<Shift[]>(shifts);

  const [draftDays, setDraftDays] = useState<DaySchedule[]>(() =>
    createYearSchedule(year, initialSchedules),
  );

  const [currentMonth, setCurrentMonth] = useState(5);

  const [defaultShift, setDefaultShift] = useState<string | null>(firstShiftId);
  const [activeShift, setActiveShift] = useState<string | null>(firstShiftId);

  const [open, setOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { monthName, offset, prevMonthLastDay } = useCalendarMonth({
    year,
    month: currentMonth,
  });

  const monthDays = useMemo(
    () => getMonthDays(draftDays, year, currentMonth),
    [draftDays, currentMonth, year],
  );

  const hasChanges = JSON.stringify(monthDays) !== JSON.stringify(draftDays);

  // Save the current month shifts
  const handleSave = async () => {
    try {
      setIsSaving(true);

      await saveSchedule(
        monthDays.map((day) => ({
          date: day.date,
          workDay: day.workDay,
          shiftId: day.workDay ? (day.shiftId ?? defaultShift) : null,
        })),
      );
      alert("Schedule saved successfully");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to save schedule");
    } finally {
      setIsSaving(false);
    }
  };

  const usedShiftIds = useMemo(
    () =>
      new Set(
        draftDays
          .filter((day) => day.workDay && day.shiftId)
          .map((day) => day.shiftId),
      ),
    [draftDays],
  );

  // console.log("shifts: ", shifts);
  // console.log("defaultShift: ", defaultShift);
  // console.log("initialSchedules: ", initialSchedules);

  return (
    <div className="relative mx-auto w-full max-w-5xl space-y-4 px-2 pt-8 sm:px-4">
      {/* DEFAULT SHIFT CONTROL */}
      {shiftsState.length !== 0 && (
        <div className="">
          <h2 className="text-md mb-2 font-semibold">Select a default shift</h2>
          <ShiftSelector
            shifts={shiftsState}
            selectedShift={defaultShift}
            setSelectedShift={setDefaultShift}
            // setSelectedShift={handleDefaultShiftChange}
          />
        </div>
      )}

      {/* Open or hide Shift Setting */}
      <ShiftSettingButton open={open} setOpen={setOpen} />

      {/* Shift Setting */}
      <div className="relative w-full">
        <ShiftSetting
          shifts={shiftsState}
          open={open}
          setShifts={setShiftsState}
          usedShiftIds={usedShiftIds}
        />
      </div>

      {/* ACTIVE SHIFT (For overiding the default shift) */}
      {shiftsState.length !== 0 && (
        <div className="p-4">
          <h2 className="text-md mb-4 font-semibold">
            Select shift to overide the default shift individually
          </h2>
          <ShiftSelector
            shifts={shiftsState}
            selectedShift={activeShift}
            setSelectedShift={setActiveShift}
          />
        </div>
      )}

      {/* Save Schedule to the database */}
      <div className="flex w-full justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
          className="rounded-2xl border border-blue-500/80 px-4 py-2 text-blue-800 hover:bg-blue-600 hover:text-white"
        >
          {isSaving ? "Saving..." : "Save Schedule"}
        </button>
      </div>

      <MonthNavigation
        monthName={monthName}
        setCurrentMonth={setCurrentMonth}
      />

      {/* Calendar */}
      <CalendarGrid
        shifts={shiftsState}
        setDays={setDraftDays}
        offset={offset}
        prevMonthLastDay={prevMonthLastDay}
        monthDays={monthDays}
        activeShift={activeShift}
        defaultShift={defaultShift}
      />

      {/* DEBUG */}
      <div className="mt-4 text-sm font-semibold">Month Days</div>
      <pre className="max-h-96 overflow-auto rounded bg-gray-100 p-4 text-xs">
        {JSON.stringify(
          monthDays.map((day) => ({
            date: day.date,
            workDay: day.workDay,
            defaultShift: defaultShift,
            overrideShift: day.shiftId,
          })),
          null,
          2,
        )}
      </pre>

      <div className="mt-4 text-sm font-semibold">Draft Days (Full Year)</div>
      <pre className="max-h-96 overflow-auto rounded bg-gray-100 p-4 text-xs">
        {JSON.stringify(draftDays, null, 2)}
      </pre>
    </div>
  );
}
