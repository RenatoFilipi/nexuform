import { ShieldCloseIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../../ui/button";

const GenericError = () => {
  return (
    <div className="flex h-full justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-3">
        <ShieldCloseIcon className="w-8 h-8" />
        <div className="flex flex-col justify-center items-center gap-3">
          <span className="text-sm text-foreground/80">
            Something went wrong
          </span>
          <Button variant={"secondary"} size={"sm"} asChild>
            <Link href={"/dashboard/forms"}>Go home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GenericError;
