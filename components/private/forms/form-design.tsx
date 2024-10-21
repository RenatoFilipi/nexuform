"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { minWidth640 } from "@/helpers/constants";
import { setState } from "@/helpers/types";
import useEditorStore from "@/stores/editor";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Drawer, DrawerContent, DrawerTrigger } from "../../ui/drawer";

export interface ColorProps {
  color: string;
  label: string;
}

export const colors: ColorProps[] = [
  {
    color:
      "bg-slate-500 hover:bg-slate-600 text-white dark:bg-slate-800 dark:hover:bg-slate-900",
    label: "Slate",
  },
  {
    color:
      "bg-gray-500 hover:bg-gray-600 text-white dark:bg-gray-800 dark:hover:bg-gray-900",
    label: "Gray",
  },
  {
    color:
      "bg-zinc-500 hover:bg-zinc-600 text-white dark:bg-zinc-800 dark:hover:bg-zinc-900",
    label: "Zinc",
  },
  {
    color:
      "bg-neutral-500 hover:bg-neutral-600 text-white dark:bg-neutral-800 dark:hover:bg-neutral-900",
    label: "Neutral",
  },
  {
    color:
      "bg-stone-500 hover:bg-stone-600 text-white dark:bg-stone-800 dark:hover:bg-stone-900",
    label: "Stone",
  },
  {
    color:
      "bg-red-500 hover:bg-red-600 text-white dark:bg-red-800 dark:hover:bg-red-900",
    label: "Red",
  },
  {
    color:
      "bg-orange-500 hover:bg-orange-600 text-white dark:bg-orange-800 dark:hover:bg-orange-900",
    label: "Orange",
  },
  {
    color:
      "bg-amber-500 hover:bg-amber-600 text-black dark:bg-amber-800 dark:hover:bg-amber-900",
    label: "Amber",
  },
  {
    color:
      "bg-yellow-500 hover:bg-yellow-600 text-black dark:bg-yellow-800 dark:hover:bg-yellow-900",
    label: "Yellow",
  },
  {
    color:
      "bg-lime-500 hover:bg-lime-600 text-black dark:bg-lime-800 dark:hover:bg-lime-900",
    label: "Lime",
  },
  {
    color:
      "bg-green-500 hover:bg-green-600 text-white dark:bg-green-800 dark:hover:bg-green-900",
    label: "Green",
  },
  {
    color:
      "bg-emerald-500 hover:bg-emerald-600 text-white dark:bg-emerald-800 dark:hover:bg-emerald-900",
    label: "Emerald",
  },
  {
    color:
      "bg-teal-500 hover:bg-teal-600 text-white dark:bg-teal-800 dark:hover:bg-teal-900",
    label: "Teal",
  },
  {
    color:
      "bg-cyan-500 hover:bg-cyan-600 text-white dark:bg-cyan-800 dark:hover:bg-cyan-900",
    label: "Cyan",
  },
  {
    color:
      "bg-sky-500 hover:bg-sky-600 text-white dark:bg-sky-800 dark:hover:bg-sky-900",
    label: "Sky",
  },
  {
    color:
      "bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-800 dark:hover:bg-blue-900",
    label: "Blue",
  },
  {
    color:
      "bg-indigo-500 hover:bg-indigo-600 text-white dark:bg-indigo-800 dark:hover:bg-indigo-900",
    label: "Indigo",
  },
  {
    color:
      "bg-violet-500 hover:bg-violet-600 text-white dark:bg-violet-800 dark:hover:bg-violet-900",
    label: "Violet",
  },
  {
    color:
      "bg-purple-500 hover:bg-purple-600 text-white dark:bg-purple-800 dark:hover:bg-purple-900",
    label: "Purple",
  },
  {
    color:
      "bg-fuchsia-500 hover:bg-fuchsia-600 text-white dark:bg-fuchsia-800 dark:hover:bg-fuchsia-900",
    label: "Fuchsia",
  },
  {
    color:
      "bg-pink-500 hover:bg-pink-600 text-white dark:bg-pink-800 dark:hover:bg-pink-900",
    label: "Pink",
  },
  {
    color:
      "bg-rose-500 hover:bg-rose-600 text-white dark:bg-rose-800 dark:hover:bg-rose-900",
    label: "Rose",
  },
];

const FormDesign = ({ children }: { children: React.ReactNode }) => {
  const isDesktop = useMediaQuery({ query: minWidth640 });
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="min-w-[420px]">
          <Body setState={setOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3 flex flex-col gap-8 h-[95%]">
        <Body setState={setOpen} />
      </DrawerContent>
    </Drawer>
  );
};

const Body = ({ setState }: { setState: setState<boolean> }) => {
  const { primaryColor, setPrimaryColor } = useEditorStore();

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto">
      <h1 className="text-xl font-semibold">Design</h1>
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-2">
          {colors.map((color, index) => {
            return (
              <button
                onClick={() => setPrimaryColor(color.label)}
                key={index}
                className={`${
                  color.label === primaryColor &&
                  "bg-primary/10 border-primary hover:bg-primary/10"
                } flex justify-start items-center gap-4 border py-1 px-3 rounded hover:bg-foreground/10`}>
                <div className={`${color.color} w-4 h-4 rounded-full`}></div>
                <span>{color.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex justify-end items-center ">
        <Button
          onClick={() => setState(false)}
          variant={"outline"}
          size={"sm"}
          className="w-full sm:w-fit">
          Close
        </Button>
      </div>
    </div>
  );
};

export default FormDesign;
