import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { appState, setState } from "@/helpers/types";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

const Feedback = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="mr-20 w-80">
        <Body setState={setOpen} />
      </PopoverContent>
    </Popover>
  );
};

const Body = ({ setState }: { setState: setState<boolean> }) => {
  const [appState, setAppState] = useState<appState>("idle");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <Textarea placeholder="Suggestions for improving the product." />
        <span className="text-foreground/80 text-xs hidden">
          Suggestions for improving the product.
        </span>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center w-full">
          <Button
            size={"sm"}
            variant={"outline"}
            onClick={() => setState(false)}>
            Cancel
          </Button>
          <Button size={"sm"} variant={"secondary"}>
            Send
          </Button>
        </div>
        <p className="text-xs text-foreground/80">
          Trouble with something technical? Let us know via the{" "}
          <Link
            href={"/"}
            className="hover:underline text-info dark:text-blue-500">
            Support Form.
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Feedback;
