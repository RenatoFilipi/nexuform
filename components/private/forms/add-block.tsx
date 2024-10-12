"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { minWidth640 } from "@/helpers/constants";
import { block, setState } from "@/helpers/types";
import {
  CheckCheckIcon,
  CheckCircleIcon,
  CheckSquareIcon,
  ChevronDownIcon,
  HashIcon,
  MailIcon,
  MinusIcon,
  StarIcon,
  TextIcon,
} from "lucide-react";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Drawer, DrawerContent, DrawerTrigger } from "../../ui/drawer";

interface BlockProps {
  type: block;
  label: string;
  icon: JSX.Element | null;
}
const blocks: BlockProps[] = [
  {
    type: "short_answer",
    label: "Short answer",
    icon: <MinusIcon className="w-4 h-4" />,
  },
  {
    type: "long_answer",
    label: "Long answer",
    icon: <TextIcon className="w-4 h-4" />,
  },
  {
    type: "multiple_choice",
    label: "Multiple choice",
    icon: <CheckSquareIcon className="w-4 h-4" />,
  },
  {
    type: "checkboxes",
    label: "Checkboxes",
    icon: <CheckCircleIcon className="w-4 h-4" />,
  },
  {
    type: "dropdown",
    label: "Dropdown",
    icon: <ChevronDownIcon className="w-4 h-4" />,
  },
  {
    type: "multi_select",
    label: "Multi select",
    icon: <CheckCheckIcon className="w-4 h-4" />,
  },
  { type: "number", label: "Number", icon: <HashIcon className="w-4 h-4" /> },
  { type: "email", label: "Email", icon: <MailIcon className="w-4 h-4" /> },
  { type: "rating", label: "Rating", icon: <StarIcon className="w-4 h-4" /> },
];

const AddBlock = ({ children }: { children: React.ReactNode }) => {
  const isDesktop = useMediaQuery({ query: minWidth640 });
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="">
          <Body setState={setOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3">
        <Body setState={setOpen} />
      </DrawerContent>
    </Drawer>
  );
};

const Body = ({ setState }: { setState: setState<boolean> }) => {
  return (
    <div className="flex flex-col gap-6 h-full">
      <h1 className="text-xl font-semibold">Blocks</h1>
      <RadioGroup className="grid gap-2">
        {blocks.map((block, index) => {
          return (
            <div key={index}>
              <RadioGroupItem value={block.type} id={block.type} className="peer sr-only" />
              <Label
                htmlFor={block.type}
                className="text-sm cursor-pointer flex items-center justify-start gap-2 rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 [&:has([data-state=checked])]:border-primary">
                {block.icon}
                {block.label}
              </Label>
            </div>
          );
        })}
      </RadioGroup>

      <div className="flex justify-end items-center gap-4 sm:flex-row flex-col-reverse">
        <Button onClick={() => setState(false)} variant={"outline"} size={"sm"} className="w-full sm:w-fit">
          Cancel
        </Button>
        <Button variant={"secondary"} size={"sm"} className="w-full sm:w-fit">
          Add Block
        </Button>
      </div>
    </div>
  );
};

export default AddBlock;
