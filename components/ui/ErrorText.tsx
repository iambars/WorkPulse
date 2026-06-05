const ErrorText = ({ message }: { message?: string }) =>
  message ? (
    <p className="mt-1 text-xs text-red-500 dark:text-orange-500/85">
      {message}
    </p>
  ) : null;

export default ErrorText;
