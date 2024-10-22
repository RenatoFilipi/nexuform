import { Checkbox } from "@/components/ui/checkbox";
import { ColorProps } from "@/helpers/interfaces";
import { BlockProps } from "@/models/form";
import { twMerge } from "tailwind-merge";

export const multipleChoicesDesign: ColorProps[] = [
  {
    label: "Slate",
    tw_class:
      "border-slate-500 data-[state=checked]:bg-slate-500 data-[state=checked]:text-white",
  },
  {
    label: "Gray",
    tw_class:
      "border-gray-500 data-[state=checked]:bg-gray-500 data-[state=checked]:text-white",
  },
  {
    label: "Zinc",
    tw_class:
      "border-zinc-500 data-[state=checked]:bg-zinc-500 data-[state=checked]:text-white",
  },
  {
    label: "Neutral",
    tw_class:
      "border-neutral-500 data-[state=checked]:bg-neutral-500 data-[state=checked]:text-white",
  },
  {
    label: "Stone",
    tw_class:
      "border-stone-500 data-[state=checked]:bg-stone-500 data-[state=checked]:text-white",
  },
  {
    label: "Red",
    tw_class:
      "border-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:text-white",
  },
  {
    label: "Orange",
    tw_class:
      "border-orange-500 data-[state=checked]:bg-orange-500 data-[state=checked]:text-white",
  },
  {
    label: "Amber",
    tw_class:
      "border-amber-500 data-[state=checked]:bg-amber-500 data-[state=checked]:text-black",
  },
  {
    label: "Yellow",
    tw_class:
      "border-yellow-500 data-[state=checked]:bg-yellow-500 data-[state=checked]:text-black",
  },
  {
    label: "Lime",
    tw_class:
      "border-lime-500 data-[state=checked]:bg-lime-500 data-[state=checked]:text-black",
  },
  {
    label: "Green",
    tw_class:
      "border-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:text-white",
  },
  {
    label: "Emerald",
    tw_class:
      "border-emerald-500 data-[state=checked]:bg-emerald-500 data-[state=checked]:text-white",
  },
  {
    label: "Teal",
    tw_class:
      "border-teal-500 data-[state=checked]:bg-teal-500 data-[state=checked]:text-white",
  },
  {
    label: "Cyan",
    tw_class:
      "border-cyan-500 data-[state=checked]:bg-cyan-500 data-[state=checked]:text-white",
  },
  {
    label: "Sky",
    tw_class:
      "border-sky-500 data-[state=checked]:bg-sky-500 data-[state=checked]:text-white",
  },
  {
    label: "Blue",
    tw_class:
      "border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white",
  },
  {
    label: "Indigo",
    tw_class:
      "border-indigo-500 data-[state=checked]:bg-indigo-500 data-[state=checked]:text-white",
  },
  {
    label: "Violet",
    tw_class:
      "border-violet-500 data-[state=checked]:bg-violet-500 data-[state=checked]:text-white",
  },
  {
    label: "Purple",
    tw_class:
      "border-purple-500 data-[state=checked]:bg-purple-500 data-[state=checked]:text-white",
  },
  {
    label: "Fuchsia",
    tw_class:
      "border-fuchsia-500 data-[state=checked]:bg-fuchsia-500 data-[state=checked]:text-white",
  },
  {
    label: "Pink",
    tw_class:
      "border-pink-500 data-[state=checked]:bg-pink-500 data-[state=checked]:text-white",
  },
  {
    label: "Rose",
    tw_class:
      "border-rose-500 data-[state=checked]:bg-rose-500 data-[state=checked]:text-white",
  },
];

const MultipleChoiceDesign = ({
  block,
  primaryColor,
}: {
  block: BlockProps;
  primaryColor: string;
}) => {
  const { name, description, required, options } = block;
  const currentColor =
    multipleChoicesDesign.find((x) => x.label === primaryColor) ??
    multipleChoicesDesign[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid">
        <h1 className="text-base font-medium">
          {name} {required && <span className="text-red-500">*</span>}
        </h1>
        <span className="text-xs text-foreground/80">{description}</span>
      </div>
      {options && options.length >= 1 && (
        <div className="flex flex-col gap-1">
          {options.map((opt) => {
            return (
              <div
                key={opt.id}
                className="flex justify-start items-center gap-3">
                <Checkbox className={twMerge(currentColor.tw_class)} />
                <span className="text-sm">{opt.text}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceDesign;
