import { Loader2Icon } from "lucide-react";

const LoadingUI = () => {
  return (
    <div className="flex justify-center items-center w-full py-36">
      <Loader2Icon className="w-7 h-7 animate-spin" />
    </div>
  );
};

export default LoadingUI;
