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
          "border-border text-primary inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition-colors hover:border-blue-600 hover:bg-blue-600 hover:text-white/90 active:scale-[0.98]",
          className,
        )}
      >
        <ChevronLeft size={18} />
        <span>Back to Home</span>
      </Link>
    </div>
  );
}
