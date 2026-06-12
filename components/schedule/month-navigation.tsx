import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

type MonthNavigationProps = {
  monthName: string;
  setCurrentMonth: Dispatch<SetStateAction<number>>;
};

export default function MonthNavigation({
  monthName,
  setCurrentMonth,
}: MonthNavigationProps) {
  return (
    <div className="flex items-center justify-between">
      <button
        onClick={() => setCurrentMonth((m) => (m === 0 ? 11 : m - 1))}
        className="border-border/10 hover:border-border/50 rounded-lg border px-3 py-2 hover:text-blue-500"
      >
        <ChevronLeft />
      </button>

      <h2 className="text-xl font-bold">{monthName}</h2>

      <button
        onClick={() => setCurrentMonth((m) => (m === 11 ? 0 : m + 1))}
        className="border-border/10 hover:border-border/50 rounded-lg border px-3 py-2 hover:text-blue-500"
      >
        <ChevronRight />
      </button>
    </div>
  );
}
