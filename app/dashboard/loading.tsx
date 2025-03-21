import { LoaderIcon } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center w-full h-dvh">
      <LoaderIcon className="w-10 h-10 animate-spin fill-foreground" />
    </div>
  );
};

export default Loading;
