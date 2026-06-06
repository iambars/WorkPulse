import { GoogleIcon } from "../icons";

type GoogleButtonProps = {
  action?: () => void | Promise<void>;
};

export default function GoogleButton({ action }: GoogleButtonProps) {
  return (
    <button
      onClick={action}
      type="button"
      className="border-border text-primary w-full rounded-md border py-2 text-sm transition hover:bg-gray-800 hover:text-white/80 active:scale-[0.99]"
    >
      <span className="flex items-center justify-center gap-2">
        <GoogleIcon className="shrink-0" />
        Continue with Google
      </span>
    </button>
  );
}
