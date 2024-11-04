import { FrownIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../../ui/button";

const GenericError = () => {
  return (
    <div className="flex h-full justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-3">
        <div className="flex justify-center items-center p-2 rounded bg-secondary/10">
          <FrownIcon />
        </div>
        <div className="flex flex-col justify-center items-center gap-3">
          <span className="text-sm text-foreground/80">
            Something went wrong
          </span>
          <Button variant={"outline"} size={"sm"} className="w-full" asChild>
            <Link href={"/dashboard/forms"}>Go home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GenericError;
