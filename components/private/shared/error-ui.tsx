import { XIcon } from "lucide-react";

const ErrorUI = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-6 sm:px-6 lg:px-36 mt-36 w-full">
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="flex justify-center items-center p-2 w-fit rounded bg-destructive/10">
          <XIcon className="w-6 h-6 text-destructive" />
        </div>
        <div className="text-center flex flex-col justify-center items-center gap-1">
          <h2 className="text-lg font-medium">Oops! Something went wrong.</h2>
          <p className="text-sm text-foreground/70">Please try again later or contact support if the issue persists.</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorUI;
