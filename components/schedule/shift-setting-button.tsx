import { Settings } from "lucide-react";

export default function ShiftSettingButton({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <button
      onClick={() => setOpen(!open)}
      className="bg-secondary/5 text-secondary hover:text-primary border-secondary/20 hover:border-primary/50 flex items-center gap-2 rounded-full border px-4 py-2 shadow"
    >
      <span>Shift Settings</span>
      <Settings size={20} />
    </button>
  );
}
