import clsx from "clsx";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

type HomeButtonProps = {
  className?: string;
};

export default function HomeButton({ className = "" }: HomeButtonProps) {
  return (
    <div className="mb-6 flex justify-end">
      <Link
        href="/"
        className={clsx(
          "inline-flex items-center gap-2 rounded-full bg-blue-500 px-3 py-2 text-sm text-white transition-colors hover:bg-blue-600 active:scale-[0.98]",
          className,
        )}
      >
        <ChevronLeft size={18} />
        <span>Back to Home</span>
      </Link>
    </div>
  );
}
