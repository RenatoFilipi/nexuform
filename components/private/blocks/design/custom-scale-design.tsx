import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { EBlock, ETheme } from "@/utils/entities";
import { IDesign } from "@/utils/interfaces";
import { useState } from "react";

const design: IDesign[] = [
  {
    label: "slate",
    tw_class:
      "peer-data-[state=checked]:border-slate-500 peer-data-[state=checked]:bg-slate-500/20 [&:has([data-state=checked])]:border-slate-500",
  },
  {
    label: "gray",
    tw_class:
      "peer-data-[state=checked]:border-gray-500 peer-data-[state=checked]:bg-gray-500/20 [&:has([data-state=checked])]:border-gray-500",
  },
  {
    label: "zinc",
    tw_class:
      "peer-data-[state=checked]:border-zinc-500 peer-data-[state=checked]:bg-zinc-500/20 [&:has([data-state=checked])]:border-zinc-500",
  },
  {
    label: "neutral",
    tw_class:
      "peer-data-[state=checked]:border-neutral-500 peer-data-[state=checked]:bg-neutral-500/20 [&:has([data-state=checked])]:border-neutral-500",
  },
  {
    label: "stone",
    tw_class:
      "peer-data-[state=checked]:border-stone-500 peer-data-[state=checked]:bg-stone-500/20 [&:has([data-state=checked])]:border-stone-500",
  },
  {
    label: "red",
    tw_class:
      "peer-data-[state=checked]:border-red-500 peer-data-[state=checked]:bg-red-500/20 [&:has([data-state=checked])]:border-red-500",
  },
  {
    label: "orange",
    tw_class:
      "peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:bg-orange-500/20 [&:has([data-state=checked])]:border-orange-500",
  },
  {
    label: "amber",
    tw_class:
      "peer-data-[state=checked]:border-amber-500 peer-data-[state=checked]:bg-amber-500/20 [&:has([data-state=checked])]:border-amber-500",
  },
  {
    label: "yellow",
    tw_class:
      "peer-data-[state=checked]:border-yellow-500 peer-data-[state=checked]:bg-yellow-500/20 [&:has([data-state=checked])]:border-yellow-500",
  },
  {
    label: "lime",
    tw_class:
      "peer-data-[state=checked]:border-lime-500 peer-data-[state=checked]:bg-lime-500/20 [&:has([data-state=checked])]:border-lime-500",
  },
  {
    label: "green",
    tw_class:
      "peer-data-[state=checked]:border-green-500 peer-data-[state=checked]:bg-green-500/20 [&:has([data-state=checked])]:border-green-500",
  },
  {
    label: "emerald",
    tw_class:
      "peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-500/20 [&:has([data-state=checked])]:border-emerald-500",
  },
  {
    label: "teal",
    tw_class:
      "peer-data-[state=checked]:border-teal-500 peer-data-[state=checked]:bg-teal-500/20 [&:has([data-state=checked])]:border-teal-500",
  },
  {
    label: "cyan",
    tw_class:
      "peer-data-[state=checked]:border-cyan-500 peer-data-[state=checked]:bg-cyan-500/20 [&:has([data-state=checked])]:border-cyan-500",
  },
  {
    label: "sky",
    tw_class:
      "peer-data-[state=checked]:border-sky-500 peer-data-[state=checked]:bg-sky-500/20 [&:has([data-state=checked])]:border-sky-500",
  },
  {
    label: "blue",
    tw_class:
      "peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-500/20 [&:has([data-state=checked])]:border-blue-500",
  },
  {
    label: "indigo",
    tw_class:
      "peer-data-[state=checked]:border-indigo-500 peer-data-[state=checked]:bg-indigo-500/20 [&:has([data-state=checked])]:border-indigo-500",
  },
  {
    label: "violet",
    tw_class:
      "peer-data-[state=checked]:border-violet-500 peer-data-[state=checked]:bg-violet-500/20 [&:has([data-state=checked])]:border-violet-500",
  },
  {
    label: "purple",
    tw_class:
      "peer-data-[state=checked]:border-purple-500 peer-data-[state=checked]:bg-purple-500/20 [&:has([data-state=checked])]:border-purple-500",
  },
  {
    label: "fuchsia",
    tw_class:
      "peer-data-[state=checked]:border-fuchsia-500 peer-data-[state=checked]:bg-fuchsia-500/20 [&:has([data-state=checked])]:border-fuchsia-500",
  },
  {
    label: "pink",
    tw_class:
      "peer-data-[state=checked]:border-pink-500 peer-data-[state=checked]:bg-pink-500/20 [&:has([data-state=checked])]:border-pink-500",
  },
  {
    label: "rose",
    tw_class:
      "peer-data-[state=checked]:border-rose-500 peer-data-[state=checked]:bg-rose-500/20 [&:has([data-state=checked])]:border-rose-500",
  },
];

const CustomScaleDesign = ({
  block,
  theme,
  onValueChange,
}: {
  block: EBlock;
  theme: ETheme;
  onValueChange: (value: string, blockId: string) => void;
}) => {
  const { name, description, required, max_scale, id, position } = block;
  const maxScaleArray = Array.from({ length: max_scale ?? 5 }, (_, i) => i + 1);
  const currentColor =
    design.find((x) => x.label === theme.primary_color) ?? design[0];
  const [value, setValue] = useState("");

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="grid gap-1">
        <div className="flex gap-2">
          {theme.numeric_blocks && (
            <span className="bg-foreground/5 px-2 rounded h-fit">
              {position}
            </span>
          )}
          <h1
            className={`${
              theme.uppercase_block_name && "uppercase"
            } text-base font-medium`}>
            {name} {required && <span className="text-red-500">*</span>}
          </h1>
        </div>
        <span className="text-xs text-foreground/80">{description}</span>
      </div>
      <RadioGroup
        defaultValue={value}
        onValueChange={(e) => {
          setValue(e);
          onValueChange(e, block.id);
        }}
        className="flex w-full">
        {maxScaleArray.map((scale) => {
          const scaleId = `${id}_${scale}`;
          return (
            <div key={scale} className="w-full">
              <RadioGroupItem
                value={scale.toString()}
                id={scaleId}
                className="peer sr-only"
              />
              <Label
                htmlFor={scaleId}
                className={`${currentColor.tw_class} text-sm cursor-pointer flex items-center justify-center gap-2 rounded-md border-2 border-muted bg-popover h-14 hover:bg-accent hover:text-accent-foreground`}>
                {scale}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};

export default CustomScaleDesign;
