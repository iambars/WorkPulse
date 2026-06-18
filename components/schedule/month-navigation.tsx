"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

type MonthNavigationProps = {
  monthName: string;
  year: number;
  setYear: Dispatch<SetStateAction<number>>;
  currentMonth: number;
  setCurrentMonth: Dispatch<SetStateAction<number>>;
};

export default function MonthNavigation({
  monthName,
  currentMonth,
  setCurrentMonth,
  year,
  setYear,
}: MonthNavigationProps) {
  const [isEditingYear, setIsEditingYear] = useState(false);
  const [tempYear, setTempYear] = useState(year.toString());

  const saveYear = () => {
    const parsed = parseInt(tempYear);
    if (!isNaN(parsed)) {
      setYear(parsed);
    } else {
      setTempYear(year.toString());
    }

    setIsEditingYear(false);
  };

  const goPrev = () => {
    setCurrentMonth((m) => {
      if (m === 0) return 11;
      return m - 1;
    });

    setYear((y) => (currentMonth === 0 ? y - 1 : y));
  };

  const goNext = () => {
    setCurrentMonth((m) => {
      if (m === 11) return 0;
      return m + 1;
    });

    setYear((y) => (currentMonth === 11 ? y + 1 : y));
  };

  // console.log("month-year: ", monthName, year);
  // console.log("currentMonth: ", currentMonth);

  return (
    <div className="flex items-center justify-between">
      <button
        onClick={goPrev}
        className="border-border/10 hover:border-border/50 rounded-lg border px-3 py-2 hover:text-blue-500"
      >
        <ChevronLeft />
      </button>

      <h2 className="text-xl font-bold">
        {monthName}{" "}
        {isEditingYear ? (
          <input
            value={tempYear}
            autoFocus
            onChange={(e) => setTempYear(e.target.value)}
            onBlur={saveYear}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveYear();
              if (e.key === "Escape") {
                setTempYear(year.toString());
                setIsEditingYear(false);
              }
            }}
            className="w-16 border-b bg-transparent text-center outline-none"
          />
        ) : (
          <span
            onClick={() => {
              setTempYear(year.toString());
              setIsEditingYear(true);
            }}
            className="hover:bg-secondary/20 cursor-pointer rounded-xl p-2"
          >
            {year}
          </span>
        )}
      </h2>

      <button
        onClick={goNext}
        className="border-border/10 hover:border-border/50 rounded-lg border px-3 py-2 hover:text-blue-500"
      >
        <ChevronRight />
      </button>
    </div>
  );
}
