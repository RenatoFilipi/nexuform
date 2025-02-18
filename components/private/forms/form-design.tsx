"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import useEditorStore from "@/stores/editor";
import { minWidth640 } from "@/utils/constants";
import { EBlock } from "@/utils/entities";
import { IDesign } from "@/utils/interfaces";
import { TBlock, TSetState } from "@/utils/types";
import { Reorder } from "framer-motion";
import {
  ArrowDownUpIcon,
  CheckCircleIcon,
  CheckIcon,
  CheckSquareIcon,
  ChevronDownIcon,
  EqualIcon,
  HashIcon,
  Layers2Icon,
  MailIcon,
  PaintbrushIcon,
  ScaleIcon,
  StarIcon,
  TextIcon,
} from "lucide-react";
import { useState, type JSX } from "react";
import { useMedia } from "react-use";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "../../ui/drawer";

const colors: IDesign[] = [
  {
    tw_class: "bg-slate-500 hover:bg-slate-600 text-white dark:bg-slate-800 dark:hover:bg-slate-900",
    label: "slate",
  },
  {
    tw_class: "bg-gray-500 hover:bg-gray-600 text-white dark:bg-gray-800 dark:hover:bg-gray-900",
    label: "gray",
  },
  {
    tw_class: "bg-zinc-500 hover:bg-zinc-600 text-white dark:bg-zinc-800 dark:hover:bg-zinc-900",
    label: "zinc",
  },
  {
    tw_class: "bg-neutral-500 hover:bg-neutral-600 text-white dark:bg-neutral-800 dark:hover:bg-neutral-900",
    label: "neutral",
  },
  {
    tw_class: "bg-stone-500 hover:bg-stone-600 text-white dark:bg-stone-800 dark:hover:bg-stone-900",
    label: "stone",
  },
  {
    tw_class: "bg-red-500 hover:bg-red-600 text-white dark:bg-red-800 dark:hover:bg-red-900",
    label: "red",
  },
  {
    tw_class: "bg-orange-500 hover:bg-orange-600 text-white dark:bg-orange-800 dark:hover:bg-orange-900",
    label: "orange",
  },
  {
    tw_class: "bg-amber-500 hover:bg-amber-600 text-black dark:bg-amber-800 dark:hover:bg-amber-900",
    label: "amber",
  },
  {
    tw_class: "bg-yellow-500 hover:bg-yellow-600 text-black dark:bg-yellow-800 dark:hover:bg-yellow-900",
    label: "yellow",
  },
  {
    tw_class: "bg-lime-500 hover:bg-lime-600 text-black dark:bg-lime-800 dark:hover:bg-lime-900",
    label: "lime",
  },
  {
    tw_class: "bg-green-500 hover:bg-green-600 text-white dark:bg-green-800 dark:hover:bg-green-900",
    label: "green",
  },
  {
    tw_class: "bg-emerald-500 hover:bg-emerald-600 text-white dark:bg-emerald-800 dark:hover:bg-emerald-900",
    label: "emerald",
  },
  {
    tw_class: "bg-teal-500 hover:bg-teal-600 text-white dark:bg-teal-800 dark:hover:bg-teal-900",
    label: "teal",
  },
  {
    tw_class: "bg-cyan-500 hover:bg-cyan-600 text-white dark:bg-cyan-800 dark:hover:bg-cyan-900",
    label: "cyan",
  },
  {
    tw_class: "bg-sky-500 hover:bg-sky-600 text-white dark:bg-sky-800 dark:hover:bg-sky-900",
    label: "sky",
  },
  {
    tw_class: "bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-800 dark:hover:bg-blue-900",
    label: "blue",
  },
  {
    tw_class: "bg-indigo-500 hover:bg-indigo-600 text-white dark:bg-indigo-800 dark:hover:bg-indigo-900",
    label: "indigo",
  },
  {
    tw_class: "bg-violet-500 hover:bg-violet-600 text-white dark:bg-violet-800 dark:hover:bg-violet-900",
    label: "violet",
  },
  {
    tw_class: "bg-purple-500 hover:bg-purple-600 text-white dark:bg-purple-800 dark:hover:bg-purple-900",
    label: "purple",
  },
  {
    tw_class: "bg-fuchsia-500 hover:bg-fuchsia-600 text-white dark:bg-fuchsia-800 dark:hover:bg-fuchsia-900",
    label: "fuchsia",
  },
  {
    tw_class: "bg-pink-500 hover:bg-pink-600 text-white dark:bg-pink-800 dark:hover:bg-pink-900",
    label: "pink",
  },
  {
    tw_class: "bg-rose-500 hover:bg-rose-600 text-white dark:bg-rose-800 dark:hover:bg-rose-900",
    label: "rose",
  },
];
const icons: { [key in TBlock]: JSX.Element } = {
  short_text: <EqualIcon className="w-4 h-4 text-foreground" />,
  paragraph_text: <TextIcon className="w-4 h-4 text-foreground" />,
  checkboxes: <CheckSquareIcon className="w-4 h-4 text-foreground" />,
  multiple_choice: <CheckCircleIcon className="w-4 h-4 text-foreground" />,
  dropdown_menu: <ChevronDownIcon className="w-4 h-4 text-foreground" />,
  number_input: <HashIcon className="w-4 h-4 text-foreground" />,
  email_address: <MailIcon className="w-4 h-4 text-foreground" />,
  star_rating: <StarIcon className="w-4 h-4 text-foreground" />,
  custom_scale: <ScaleIcon className="w-4 h-4 text-foreground" />,
};

const FormDesign = ({ children }: { children: React.ReactNode }) => {
  const isDesktop = useMedia(minWidth640);
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="flex flex-col min-w-[650px] h-[600px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Design</DialogTitle>
            <DialogDescription>Customize the appearance of your form.</DialogDescription>
          </DialogHeader>
          <Body setState={setOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3 flex flex-col gap-8">
        <DrawerHeader>
          <DrawerTitle>Design</DrawerTitle>
          <DrawerDescription>Customize the appearance of your form.</DrawerDescription>
        </DrawerHeader>
        <Body setState={setOpen} />
      </DrawerContent>
    </Drawer>
  );
};

type TView = "general" | "colors" | "reorder";

const views = [
  { label: "General", icon: Layers2Icon, view: "general", enabled: true },
  { label: "Colors", icon: PaintbrushIcon, view: "colors", enabled: true },
  { label: "Reorder", icon: ArrowDownUpIcon, view: "reorder", enabled: true },
];
const Body = ({ setState }: { setState: TSetState<boolean> }) => {
  const [view, setView] = useState<TView>("general");
  const enabledViews = views.filter((x) => x.enabled);

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto pt-4 sm:pt-0">
      <div className="flex flex-col gap-4 overflow-y-auto h-full">
        <div className="flex sm:w-fit sm:gap-2 gap-1">
          {enabledViews.map((v) => {
            return (
              <button
                key={v.view}
                onClick={() => setView(v.view as TView)}
                className={`${
                  v.view === view
                    ? "border-foreground/30 text-foreground/100 font-medium"
                    : "border-transparent text-foreground/70"
                } border p-2 flex items-center justify-center gap-2 text-sm hover:bg-foreground/5 rounded flex-1`}>
                <v.icon className={`${v.view === view ? "text-primary" : "text-foreground/70"} w-4 h-4`} />
                {v.label}
              </button>
            );
          })}
        </div>
        <div className="flex w-full overflow-y-auto flex-1 h-full">
          {view === "general" && <GeneralDesign />}
          {view === "colors" && <ColorsDesign />}
          {view === "reorder" && <ReorderDesign />}
        </div>
      </div>
      <div className="flex justify-end items-center gap-2 flex-col sm:flex-row">
        <Button onClick={() => setState(false)} variant={"outline"} size={"sm"} className="w-full sm:w-fit">
          Close
        </Button>
      </div>
    </div>
  );
};
const GeneralDesign = () => {
  const { theme, setTheme } = useEditorStore();

  const onSetNumericBlocks = (value: boolean) => {
    setTheme({ ...theme, numeric_blocks: value });
  };
  const onSetUppercaseBlockName = (value: boolean) => {
    setTheme({ ...theme, uppercase_block_name: value });
  };
  const onSetWidth = (value: string) => {
    console.log(value);
    setTheme({ ...theme, width: value });
  };

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="flex justify-between items-center w-full">
        <div className="grid gap-1">
          <Label>Show numeric blocks</Label>
          <p className="text-xs text-foreground/60">
            Enable this option to display numeric identifiers for each block.
          </p>
        </div>
        <Switch checked={theme.numeric_blocks} onCheckedChange={onSetNumericBlocks} />
      </div>
      <div className="flex justify-between items-center w-full">
        <div className="grid gap-1">
          <Label>Uppercase Block Name</Label>
          <p className="text-xs text-foreground/60">When enabled, block names will be displayed in uppercase.</p>
        </div>
        <Switch checked={theme.uppercase_block_name} onCheckedChange={onSetUppercaseBlockName} />
      </div>
      <div className="flex justify-between items-center w-full">
        <div className="grid gap-1">
          <Label>Form Width</Label>
          <p className="text-xs text-foreground/60">
            Choose how the form width should be displayed: centered or full width.
          </p>
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
  );
};
const ColorsDesign = () => {
  const { theme, setTheme } = useEditorStore();

  const onSetPrimaryColor = (value: string) => {
    setTheme({ ...theme, primary_color: value });
  };

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="grid gap-3">
        <div className="flex justify-start items-center gap-2">
          <div className="grid gap-1">
            <Label>Primary color</Label>
            <span className="text-xs text-foreground/60">
              Choose the main color for your design. This color will be used for key elements.
            </span>
          </div>
        </div>
        <div className="grid grid-cols-10 gap-4">
          {colors.map((color, index) => {
            return (
              <button
                onClick={() => onSetPrimaryColor(color.label)}
                key={index}
                className={`${color.tw_class} w-11 h-11 flex justify-center items-center rounded`}>
                {theme.primary_color === color.label && <CheckIcon className="w-5 h-5 text-white" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
const ReorderDesign = () => {
  const { blocks, setBlocks } = useEditorStore();
  const empty = blocks.length <= 0;
  const onReorderedBlocks = (payload: EBlock[]) => {
    const newPositionBlocks = payload.map((pay, index) => {
      return { ...pay, position: index + 1 };
    });
    setBlocks(newPositionBlocks);
  };

  return (
    <div className="flex flex-col gap-6 overflow-y-auto pt-4 sm:pt-0 flex-1 h-full">
      {empty && (
        <div className="flex justify-center items-center py-14 gap-4 flex-col h-full">
          <div className="flex justify-center items-center flex-col gap-1">
            <span className="font-medium text-base">No blocks to reorder</span>
            <p className="text-xs text-foreground/70 text-center">
              There are currently no blocks available to reorder. Add blocks to start organizing them.
            </p>
          </div>
        </div>
      )}
      {!empty && (
        <Reorder.Group
          axis="y"
          onReorder={(e) => onReorderedBlocks(e)}
          values={blocks}
          className="flex flex-col gap-3 overflow-y-auto h-full">
          {blocks.map((block) => {
            return (
              <Reorder.Item
                key={block.id}
                value={block}
                id={block.id}
                className="flex cursor-grab border rounded gap-2 px-1 justify-start items-center">
                <div className="flex justify-center items-center rounded relative p-2 h-full">
                  {icons[block.type as TBlock]}
                </div>
                {block.is_identifier && (
                  <Badge variant={"green"} className="p-0 px-2 h-fit">
                    Identifier
                  </Badge>
                )}
                <div className="flex justify-start items-center overflow-y-auto">
                  <p className="text-xs text-foreground/80 truncate max-w-sm font-medium">{block.name}</p>
                </div>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      )}
    </div>
  );
};

export default FormDesign;
