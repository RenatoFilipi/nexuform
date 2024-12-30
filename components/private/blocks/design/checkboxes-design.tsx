import { Checkbox } from "@/components/ui/checkbox";
import { ColorProps } from "@/utils/interfaces";
import { BlockModel } from "@/utils/models";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

const design: ColorProps[] = [
  {
    label: "Slate",
    tw_class:
      "border-slate-500 data-[state=checked]:bg-slate-500 data-[state=checked]:text-white focus-visible:ring-slate-500",
  },
  {
    label: "Gray",
    tw_class:
      "border-gray-500 data-[state=checked]:bg-gray-500 data-[state=checked]:text-white focus-visible:ring-gray-500",
  },
  {
    label: "Zinc",
    tw_class:
      "border-zinc-500 data-[state=checked]:bg-zinc-500 data-[state=checked]:text-white focus-visible:ring-zinc-500",
  },
  {
    label: "Neutral",
    tw_class:
      "border-neutral-500 data-[state=checked]:bg-neutral-500 data-[state=checked]:text-white focus-visible:ring-neutral-500",
  },
  {
    label: "Stone",
    tw_class:
      "border-stone-500 data-[state=checked]:bg-stone-500 data-[state=checked]:text-white focus-visible:ring-stone-500",
  },
  {
    label: "Red",
    tw_class:
      "border-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:text-white focus-visible:ring-red-500",
  },
  {
    label: "Orange",
    tw_class:
      "border-orange-500 data-[state=checked]:bg-orange-500 data-[state=checked]:text-white focus-visible:ring-orange-500",
  },
  {
    label: "Amber",
    tw_class:
      "border-amber-500 data-[state=checked]:bg-amber-500 data-[state=checked]:text-black focus-visible:ring-amber-500",
  },
  {
    label: "Yellow",
    tw_class:
      "border-yellow-500 data-[state=checked]:bg-yellow-500 data-[state=checked]:text-black focus-visible:ring-yellow-500",
  },
  {
    label: "Lime",
    tw_class:
      "border-lime-500 data-[state=checked]:bg-lime-500 data-[state=checked]:text-black focus-visible:ring-lime-500",
  },
  {
    label: "Green",
    tw_class:
      "border-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:text-white focus-visible:ring-green-500",
  },
  {
    label: "Emerald",
    tw_class:
      "border-emerald-500 data-[state=checked]:bg-emerald-500 data-[state=checked]:text-white focus-visible:ring-emerald-500",
  },
  {
    label: "Teal",
    tw_class:
      "border-teal-500 data-[state=checked]:bg-teal-500 data-[state=checked]:text-white focus-visible:ring-teal-500",
  },
  {
    label: "Cyan",
    tw_class:
      "border-cyan-500 data-[state=checked]:bg-cyan-500 data-[state=checked]:text-white focus-visible:ring-cyan-500",
  },
  {
    label: "Sky",
    tw_class:
      "border-sky-500 data-[state=checked]:bg-sky-500 data-[state=checked]:text-white focus-visible:ring-sky-500",
  },
  {
    label: "Blue",
    tw_class:
      "border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white focus-visible:ring-blue-500",
  },
  {
    label: "Indigo",
    tw_class:
      "border-indigo-500 data-[state=checked]:bg-indigo-500 data-[state=checked]:text-white focus-visible:ring-indigo-500",
  },
  {
    label: "Violet",
    tw_class:
      "border-violet-500 data-[state=checked]:bg-violet-500 data-[state=checked]:text-white focus-visible:ring-violet-500",
  },
  {
    label: "Purple",
    tw_class:
      "border-purple-500 data-[state=checked]:bg-purple-500 data-[state=checked]:text-white focus-visible:ring-purple-500",
  },
  {
    label: "Fuchsia",
    tw_class:
      "border-fuchsia-500 data-[state=checked]:bg-fuchsia-500 data-[state=checked]:text-white focus-visible:ring-fuchsia-500",
  },
  {
    label: "Pink",
    tw_class:
      "border-pink-500 data-[state=checked]:bg-pink-500 data-[state=checked]:text-white focus-visible:ring-pink-500",
  },
  {
    label: "Rose",
    tw_class:
      "border-rose-500 data-[state=checked]:bg-rose-500 data-[state=checked]:text-white focus-visible:ring-rose-500",
  },
];

const CheckBoxesDesign = ({
  block,
  theme,
  numericBlocks,
  onValueChange,
}: {
  block: BlockModel;
  theme: string;
  numericBlocks: boolean;
  onValueChange: (value: string, blockId: string) => void;
}) => {
  const { name, description, required, options, id, position } = block;
  const currentColor = design.find((x) => x.label === theme) ?? design[0];
  const [value, setValue] = useState<string[]>([]);

  const handleCheckboxChange = (optionId: string) => {
    setValue((prevValue) =>
      prevValue.includes(optionId)
        ? prevValue.filter((id) => id !== optionId)
        : [...prevValue, optionId]
    );
  };

  useQuery({
    queryKey: [value],
    queryFn: () => {
      onValueChange(value.toString(), block.id);
      return null;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="grid gap-1">
        <div className="flex gap-2">
          {numericBlocks && (
            <span className="bg-foreground/5 px-2 rounded h-fit">
              {position}
            </span>
          )}
          <h1 className="text-base font-medium">
            {name} {required && <span className="text-red-500">*</span>}
          </h1>
        </div>
        <span className="text-xs text-foreground/80">{description}</span>
      </div>
      {options && options.length >= 1 && (
        <div className="flex flex-col gap-1">
          {options.map((opt) => {
            const isChecked = value.includes(opt.id);
            return (
              <div
                key={opt.id}
                className="flex justify-start items-center gap-3">
                <Checkbox
                  id={id}
                  className={twMerge(currentColor.tw_class)}
                  checked={isChecked}
                  onCheckedChange={() => handleCheckboxChange(opt.id)}
                />
                <span className="text-sm">{opt.text}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CheckBoxesDesign;
