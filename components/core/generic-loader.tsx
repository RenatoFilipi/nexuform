import { LoaderIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";

const GenericLoader = ({ className }: { className?: string }) => {
  return <LoaderIcon className={twMerge("animate-spin", className)} />;
};

export default GenericLoader;
