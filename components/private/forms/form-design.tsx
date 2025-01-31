"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import useEditorStore from "@/stores/editor";
import { minWidth640 } from "@/utils/constants";
import { IDesign } from "@/utils/interfaces";
import { TSetState } from "@/utils/types";
import { CheckIcon } from "lucide-react";
import { useState } from "react";
import { useMedia } from "react-use";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../ui/drawer";

const colors: IDesign[] = [
  {
    tw_class:
      "bg-slate-500 hover:bg-slate-600 text-white dark:bg-slate-800 dark:hover:bg-slate-900",
    label: "slate",
  },
  {
    tw_class:
      "bg-gray-500 hover:bg-gray-600 text-white dark:bg-gray-800 dark:hover:bg-gray-900",
    label: "gray",
  },
  {
    tw_class:
      "bg-zinc-500 hover:bg-zinc-600 text-white dark:bg-zinc-800 dark:hover:bg-zinc-900",
    label: "zinc",
  },
  {
    tw_class:
      "bg-neutral-500 hover:bg-neutral-600 text-white dark:bg-neutral-800 dark:hover:bg-neutral-900",
    label: "neutral",
  },
  {
    tw_class:
      "bg-stone-500 hover:bg-stone-600 text-white dark:bg-stone-800 dark:hover:bg-stone-900",
    label: "stone",
  },
  {
    tw_class:
      "bg-red-500 hover:bg-red-600 text-white dark:bg-red-800 dark:hover:bg-red-900",
    label: "red",
  },
  {
    tw_class:
      "bg-orange-500 hover:bg-orange-600 text-white dark:bg-orange-800 dark:hover:bg-orange-900",
    label: "orange",
  },
  {
    tw_class:
      "bg-amber-500 hover:bg-amber-600 text-black dark:bg-amber-800 dark:hover:bg-amber-900",
    label: "amber",
  },
  {
    tw_class:
      "bg-yellow-500 hover:bg-yellow-600 text-black dark:bg-yellow-800 dark:hover:bg-yellow-900",
    label: "yellow",
  },
  {
    tw_class:
      "bg-lime-500 hover:bg-lime-600 text-black dark:bg-lime-800 dark:hover:bg-lime-900",
    label: "lime",
  },
  {
    tw_class:
      "bg-green-500 hover:bg-green-600 text-white dark:bg-green-800 dark:hover:bg-green-900",
    label: "green",
  },
  {
    tw_class:
      "bg-emerald-500 hover:bg-emerald-600 text-white dark:bg-emerald-800 dark:hover:bg-emerald-900",
    label: "emerald",
  },
  {
    tw_class:
      "bg-teal-500 hover:bg-teal-600 text-white dark:bg-teal-800 dark:hover:bg-teal-900",
    label: "teal",
  },
  {
    tw_class:
      "bg-cyan-500 hover:bg-cyan-600 text-white dark:bg-cyan-800 dark:hover:bg-cyan-900",
    label: "cyan",
  },
  {
    tw_class:
      "bg-sky-500 hover:bg-sky-600 text-white dark:bg-sky-800 dark:hover:bg-sky-900",
    label: "sky",
  },
  {
    tw_class:
      "bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-800 dark:hover:bg-blue-900",
    label: "blue",
  },
  {
    tw_class:
      "bg-indigo-500 hover:bg-indigo-600 text-white dark:bg-indigo-800 dark:hover:bg-indigo-900",
    label: "indigo",
  },
  {
    tw_class:
      "bg-violet-500 hover:bg-violet-600 text-white dark:bg-violet-800 dark:hover:bg-violet-900",
    label: "violet",
  },
  {
    tw_class:
      "bg-purple-500 hover:bg-purple-600 text-white dark:bg-purple-800 dark:hover:bg-purple-900",
    label: "purple",
  },
  {
    tw_class:
      "bg-fuchsia-500 hover:bg-fuchsia-600 text-white dark:bg-fuchsia-800 dark:hover:bg-fuchsia-900",
    label: "fuchsia",
  },
  {
    tw_class:
      "bg-pink-500 hover:bg-pink-600 text-white dark:bg-pink-800 dark:hover:bg-pink-900",
    label: "pink",
  },
  {
    tw_class:
      "bg-rose-500 hover:bg-rose-600 text-white dark:bg-rose-800 dark:hover:bg-rose-900",
    label: "rose",
  },
];

const FormDesign = ({ children }: { children: React.ReactNode }) => {
  const isDesktop = useMedia(minWidth640);
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="flex flex-col min-w-[550px]">
          <SheetHeader>
            <SheetTitle>Design</SheetTitle>
            <SheetDescription>
              Customize the appearance of your form.
            </SheetDescription>
          </SheetHeader>
          <Body setState={setOpen} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3 flex flex-col gap-8">
        <DrawerHeader>
          <DrawerTitle>Design</DrawerTitle>
          <DrawerDescription>
            Customize the appearance of your form.
          </DrawerDescription>
        </DrawerHeader>
        <Body setState={setOpen} />
      </DrawerContent>
    </Drawer>
  );
};

const Body = ({ setState }: { setState: TSetState<boolean> }) => {
  const { theme, setTheme } = useEditorStore();

  const onSetPrimaryColor = (value: string) => {
    setTheme({ ...theme, primary_color: value });
  };
  const onSetNumericBlocks = (value: boolean) => {
    setTheme({ ...theme, numeric_blocks: value });
  };
  const onSetNebulaformBranding = (value: boolean) => {
    setTheme({ ...theme, nebulaform_branding: value });
  };
  const onSetUppercaseBlockName = (value: boolean) => {
    setTheme({ ...theme, uppercase_block_name: value });
  };
  const onSetWidth = (value: string) => {
    console.log(value);
    setTheme({ ...theme, width: value });
  };

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto w-full">
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 w-full">
        <div className="grid gap-3 overflow-y-auto">
          <div className="flex justify-start items-center gap-2">
            <div className="grid gap-3">
              <Label>Primary color</Label>
            </div>
          </div>
          <div className="grid grid-cols-10 gap-3">
            {colors.map((color, index) => {
              return (
                <button
                  onClick={() => onSetPrimaryColor(color.label)}
                  key={index}
                  className={`${color.tw_class} w-8 h-8 flex justify-center items-center  rounded`}>
                  {theme.primary_color === color.label && (
                    <CheckIcon className="w-5 h-5 text-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <Separator />
        <div className="flex justify-between items-center w-full">
          <div className="grid gap-3">
            <Label>Show numeric blocks</Label>
          </div>
          <Switch
            checked={theme.numeric_blocks}
            onCheckedChange={onSetNumericBlocks}
          />
        </div>
        <div className="flex justify-between items-center w-full">
          <div className="flex justify-center items-center gap-2">
            <Label>Nebulaform branding</Label>
          </div>
          <Switch
            checked={theme.nebulaform_branding}
            onCheckedChange={onSetNebulaformBranding}
          />
        </div>
        <div className="flex justify-between items-center w-full">
          <div className="flex justify-center items-center gap-2">
            <Label>Uppercase Block Name</Label>
          </div>
          <Switch
            checked={theme.uppercase_block_name}
            onCheckedChange={onSetUppercaseBlockName}
          />
        </div>
        <div className="flex justify-between items-center w-full">
          <div className="flex justify-center items-center gap-2">
            <Label>Form Width</Label>
          </div>
          <Select onValueChange={onSetWidth} defaultValue={theme.width}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="centered">Centered</SelectItem>
              <SelectItem value="full">Full Width</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end items-center w-full">
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
