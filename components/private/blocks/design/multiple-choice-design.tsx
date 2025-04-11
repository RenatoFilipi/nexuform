import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { EBlock, ETheme } from "@/utils/entities";
import { IDesign } from "@/utils/interfaces";
import { twMerge } from "tailwind-merge";

const design: IDesign[] = [
  {
    label: "slate",
    tw_class: "border-slate-500 text-slate-500 focus-visible:ring-slate-500",
  },
  {
    label: "gray",
    tw_class: "border-gray-500 text-gray-500 focus-visible:ring-gray-500",
  },
  {
    label: "zinc",
    tw_class: "border-zinc-500 text-zinc-500 focus-visible:ring-zinc-500",
  },
  {
    label: "neutral",
    tw_class: "border-neutral-500 text-neutral-500 focus-visible:ring-neutral-500",
  },
  {
    label: "stone",
    tw_class: "border-stone-500 text-stone-500 focus-visible:ring-stone-500",
  },
  {
    label: "red",
    tw_class: "border-red-500 text-red-500 focus-visible:ring-red-500",
  },
  {
    label: "orange",
    tw_class: "border-orange-500 text-orange-500 focus-visible:ring-orange-500",
  },
  {
    label: "amber",
    tw_class: "border-amber-500 text-amber-500 focus-visible:ring-amber-500",
  },
  {
    label: "yellow",
    tw_class: "border-yellow-500 text-yellow-500 focus-visible:ring-yellow-500",
  },
  {
    label: "lime",
    tw_class: "border-lime-500 text-lime-500 focus-visible:ring-lime-500",
  },
  {
    label: "green",
    tw_class: "border-green-500 text-green-500 focus-visible:ring-green-500",
  },
  {
    label: "emerald",
    tw_class: "border-emerald-500 text-emerald-500 focus-visible:ring-emerald-500",
  },
  {
    label: "teal",
    tw_class: "border-teal-500 text-teal-500 focus-visible:ring-teal-500",
  },
  {
    label: "cyan",
    tw_class: "border-cyan-500 text-cyan-500 focus-visible:ring-cyan-500",
  },
  {
    label: "sky",
    tw_class: "border-sky-500 text-sky-500 focus-visible:ring-sky-500",
  },
  {
    label: "blue",
    tw_class: "border-blue-500 text-blue-500 focus-visible:ring-blue-500",
  },
  {
    label: "indigo",
    tw_class: "border-indigo-500 text-indigo-500 focus-visible:ring-indigo-500",
  },
  {
    label: "violet",
    tw_class: "border-violet-500 text-violet-500 focus-visible:ring-violet-500",
  },
  {
    label: "purple",
    tw_class: "border-purple-500 text-purple-500 focus-visible:ring-purple-500",
  },
  {
    label: "fuchsia",
    tw_class: "border-fuchsia-500 text-fuchsia-500 focus-visible:ring-fuchsia-500",
  },
  {
    label: "pink",
    tw_class: "border-pink-500 text-pink-500 focus-visible:ring-pink-500",
  },
  {
    label: "rose",
    tw_class: "border-rose-500 text-rose-500 focus-visible:ring-rose-500",
  },
];

const MultipleChoiceDesign = ({
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
        <RadioGroup
          className="flex flex-col gap-1"
          onValueChange={(e) => {
            onValueChange(e, block.id);
          }}>
          {options.map((opt) => {
            const optionId = `${id}_${opt}`;
            return (
              <div key={opt} className="flex items-center space-x-2">
                <RadioGroupItem className={twMerge(currentColor.tw_class)} value={opt} id={optionId} />
                <Label htmlFor={optionId} className="text-sm">
                  {opt}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      )}
    </div>
  );
};

export default MultipleChoiceDesign;
