import { Checkbox } from "@/components/ui/checkbox";
import { EBlock, ETheme } from "@/utils/entities";
import { IDesign } from "@/utils/interfaces";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

const design: IDesign[] = [
  {
    label: "slate",
    tw_class:
      "border-slate-500 data-[state=checked]:bg-slate-500 data-[state=checked]:text-white focus-visible:ring-slate-500",
  },
  {
    label: "gray",
    tw_class:
      "border-gray-500 data-[state=checked]:bg-gray-500 data-[state=checked]:text-white focus-visible:ring-gray-500",
  },
  {
    label: "zinc",
    tw_class:
      "border-zinc-500 data-[state=checked]:bg-zinc-500 data-[state=checked]:text-white focus-visible:ring-zinc-500",
  },
  {
    label: "neutral",
    tw_class:
      "border-neutral-500 data-[state=checked]:bg-neutral-500 data-[state=checked]:text-white focus-visible:ring-neutral-500",
  },
  {
    label: "stone",
    tw_class:
      "border-stone-500 data-[state=checked]:bg-stone-500 data-[state=checked]:text-white focus-visible:ring-stone-500",
  },
  {
    label: "red",
    tw_class:
      "border-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:text-white focus-visible:ring-red-500",
  },
  {
    label: "orange",
    tw_class:
      "border-orange-500 data-[state=checked]:bg-orange-500 data-[state=checked]:text-white focus-visible:ring-orange-500",
  },
  {
    label: "amber",
    tw_class:
      "border-amber-500 data-[state=checked]:bg-amber-500 data-[state=checked]:text-black focus-visible:ring-amber-500",
  },
  {
    label: "yellow",
    tw_class:
      "border-yellow-500 data-[state=checked]:bg-yellow-500 data-[state=checked]:text-black focus-visible:ring-yellow-500",
  },
  {
    label: "lime",
    tw_class:
      "border-lime-500 data-[state=checked]:bg-lime-500 data-[state=checked]:text-black focus-visible:ring-lime-500",
  },
  {
    label: "green",
    tw_class:
      "border-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:text-white focus-visible:ring-green-500",
  },
  {
    label: "emerald",
    tw_class:
      "border-emerald-500 data-[state=checked]:bg-emerald-500 data-[state=checked]:text-white focus-visible:ring-emerald-500",
  },
  {
    label: "teal",
    tw_class:
      "border-teal-500 data-[state=checked]:bg-teal-500 data-[state=checked]:text-white focus-visible:ring-teal-500",
  },
  {
    label: "cyan",
    tw_class:
      "border-cyan-500 data-[state=checked]:bg-cyan-500 data-[state=checked]:text-white focus-visible:ring-cyan-500",
  },
  {
    label: "sky",
    tw_class:
      "border-sky-500 data-[state=checked]:bg-sky-500 data-[state=checked]:text-white focus-visible:ring-sky-500",
  },
  {
    label: "blue",
    tw_class:
      "border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white focus-visible:ring-blue-500",
  },
  {
    label: "indigo",
    tw_class:
      "border-indigo-500 data-[state=checked]:bg-indigo-500 data-[state=checked]:text-white focus-visible:ring-indigo-500",
  },
  {
    label: "violet",
    tw_class:
      "border-violet-500 data-[state=checked]:bg-violet-500 data-[state=checked]:text-white focus-visible:ring-violet-500",
  },
  {
    label: "purple",
    tw_class:
      "border-purple-500 data-[state=checked]:bg-purple-500 data-[state=checked]:text-white focus-visible:ring-purple-500",
  },
  {
    label: "fuchsia",
    tw_class:
      "border-fuchsia-500 data-[state=checked]:bg-fuchsia-500 data-[state=checked]:text-white focus-visible:ring-fuchsia-500",
  },
  {
    label: "pink",
    tw_class:
      "border-pink-500 data-[state=checked]:bg-pink-500 data-[state=checked]:text-white focus-visible:ring-pink-500",
  },
  {
    label: "rose",
    tw_class:
      "border-rose-500 data-[state=checked]:bg-rose-500 data-[state=checked]:text-white focus-visible:ring-rose-500",
  },
];

const CheckBoxesDesign = ({
  block,
  theme,
  onValueChange,
}: {
  block: EBlock;
  theme: ETheme;
  onValueChange: (value: string, blockId: string) => void;
}) => {
  const { name, description, required, options, id, position } = block;
  const currentColor = design.find((x) => x.label === theme.primary_color) ?? design[0];
  const [value, setValue] = useState<string[]>([]);

  const handleCheckboxChange = (optionId: string) => {
    setValue((prevValue) =>
      prevValue.includes(optionId) ? prevValue.filter((id) => id !== optionId) : [...prevValue, optionId]
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
          {theme.numeric_blocks && <span className="">{position}.</span>}
          <h1 className={`${theme.uppercase_block_name && "uppercase"} text-base font-medium`}>
            {name} {required && <span className="text-red-500">*</span>}
          </h1>
        </div>
        <span className="text-xs text-foreground/80">{description}</span>
      </div>
      {options && options.length >= 1 && (
        <div className="flex flex-col gap-1">
          {options.map((opt) => {
            const isChecked = value.includes(opt);
            return (
              <div key={opt} className="flex justify-start items-center gap-3">
                <Checkbox
                  id={id}
                  className={twMerge(currentColor.tw_class)}
                  checked={isChecked}
                  onCheckedChange={() => handleCheckboxChange(opt)}
                />
                <span className="text-sm">{opt}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CheckBoxesDesign;
