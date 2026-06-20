"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  const now = new Date();
  const router = useRouter();
  const firstShiftId = shifts[0]?.id ?? null;

  const [open, setOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [year, setYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [defaultShift, setDefaultShift] = useState<string | null>(firstShiftId);
  const [activeShift, setActiveShift] = useState<string | null>(firstShiftId);
  const [shiftsState, setShiftsState] = useState<Shift[]>(shifts);

  const createInitialSchedule = (year: number) =>
    structuredClone(createYearSchedule(year, initialSchedules));
  const [draftDays, setDraftDays] = useState<DaySchedule[]>(() =>
    createInitialSchedule(year),
  );
  const initialScheduleRef = useRef<DaySchedule[]>(createInitialSchedule(year));

  const { monthName, offset, prevMonthLastDay } = useCalendarMonth({
    year,
    month: currentMonth,
  });

  const monthDays = useMemo(
    () => getMonthDays(draftDays, year, currentMonth),
    [draftDays, currentMonth, year],
  );

  const hasChanges = useMemo(() => {
    return (
      JSON.stringify(draftDays) !== JSON.stringify(initialScheduleRef.current)
    );
  }, [draftDays]);

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

      initialScheduleRef.current = structuredClone(draftDays);
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

  useEffect(() => {
    const schedule = createYearSchedule(year, initialSchedules);

    setDraftDays(schedule);
    initialScheduleRef.current = structuredClone(schedule);
  }, [year, initialSchedules]);

  // console.log("shifts: ", shifts);
  // console.log("defaultShift: ", defaultShift);
  // console.log("initialSchedules: ", initialSchedules);
  // console.log("monthDays: ", monthDays);
  // console.log("selected year:", year);
  // console.log("years in draftDays:", [
  //   ...new Set(draftDays.map((d) => new Date(d.date).getFullYear())),
  // ]);
  // const schedule = createYearSchedule(year, initialSchedules);
  // console.log(
  //   "first date",
  //   schedule[0]?.date,
  //   "last date",
  //   schedule[schedule.length - 1]?.date,
  // );

  return (
    <div className="relative mx-auto w-full max-w-5xl space-y-4 px-2 pt-8 sm:px-4">
      {/* DEFAULT SHIFT CONTROL */}
      {shiftsState.length !== 0 && (
        <div className="">
          <h2 className="text-md dark:text-secondary/80 mb-2 font-semibold">
            Select a default shift
          </h2>
          <ShiftSelector
            shifts={shiftsState}
            selectedShift={defaultShift}
            setSelectedShift={setDefaultShift}
            // setSelectedShift={handleDefaultShiftChange}
          />
        </div>
      )}

      {/* Open or hide Shift Setting */}
      <div className="flex w-full justify-end">
        <ShiftSettingButton open={open} setOpen={setOpen} />
      </div>

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
          <h2 className="text-md dark:text-secondary/80 mb-4 font-semibold">
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
          className={`hover:text-primary dark:text-primary rounded-2xl border border-blue-500/80 px-4 py-2 text-blue-800/80 ${
            isSaving || !hasChanges
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-blue-400/80"
          }`}
        >
          {isSaving ? "Saving..." : "Save Schedule"}
        </button>
      </div>

      <MonthNavigation
        year={year}
        setYear={setYear}
        monthName={monthName}
        currentMonth={currentMonth}
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
      <div className="mt-16 text-sm font-semibold">Month Days</div>
      <pre className="text-secondary scrollbar-thumb-secondary/40 dark:scrollbar-thumb-secondary/20 mb-16 max-h-96 scrollbar-thin scrollbar-track-transparent overflow-auto rounded-xl border p-4 text-xs">
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
    </div>
  );
}
