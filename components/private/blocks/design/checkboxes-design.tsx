import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ColorProps } from "@/helpers/interfaces";
import { BlockProps } from "@/models/form";
import { twMerge } from "tailwind-merge";

export const checkboxDesign: ColorProps[] = [
  {
    label: "Slate",
    tw_class: "border-slate-500 text-slate-500",
  },
  {
    label: "Gray",
    tw_class: "border-gray-500 text-gray-500",
  },
  {
    label: "Zinc",
    tw_class: "border-zinc-500 text-zinc-500",
  },
  {
    label: "Neutral",
    tw_class: "border-neutral-500 text-neutral-500",
  },
  {
    label: "Stone",
    tw_class: "border-stone-500 text-stone-500",
  },
  {
    label: "Red",
    tw_class: "border-red-500 text-red-500",
  },
  {
    label: "Orange",
    tw_class: "border-orange-500 text-orange-500",
  },
  {
    label: "Amber",
    tw_class: "border-amber-500 text-amber-500",
  },
  {
    label: "Yellow",
    tw_class: "border-yellow-500 text-yellow-500",
  },
  {
    label: "Lime",
    tw_class: "border-lime-500 text-lime-500",
  },
  {
    label: "Green",
    tw_class: "border-green-500 text-green-500",
  },
  {
    label: "Emerald",
    tw_class: "border-emerald-500 text-emerald-500",
  },
  {
    label: "Teal",
    tw_class: "border-teal-500 text-teal-500",
  },
  {
    label: "Cyan",
    tw_class: "border-cyan-500 text-cyan-500",
  },
  {
    label: "Sky",
    tw_class: "border-sky-500 text-sky-500",
  },
  {
    label: "Blue",
    tw_class: "border-blue-500 text-blue-500",
  },
  {
    label: "Indigo",
    tw_class: "border-indigo-500 text-indigo-500",
  },
  {
    label: "Violet",
    tw_class: "border-violet-500 text-violet-500",
  },
  {
    label: "Purple",
    tw_class: "border-purple-500 text-purple-500",
  },
  {
    label: "Fuchsia",
    tw_class: "border-fuchsia-500 text-fuchsia-500",
  },
  {
    label: "Pink",
    tw_class: "border-pink-500 text-pink-500",
  },
  {
    label: "Rose",
    tw_class: "border-rose-500 text-rose-500",
  },
];

const CheckboxesDesign = ({
  block,
  primaryColor,
}: {
  block: BlockProps;
  primaryColor: string;
}) => {
  const { name, description, required, options } = block;
  const currentColor =
    checkboxDesign.find((x) => x.label === primaryColor) ?? checkboxDesign[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid">
        <h1 className="text-base font-medium">
          {name} {required && <span className="text-red-500">*</span>}
        </h1>
        <span className="text-xs text-foreground/80">{description}</span>
      </div>
      {options && options.length >= 1 && (
        <RadioGroup className="flex flex-col gap-1">
          {options.map((opt) => (
            <div key={opt.id} className="flex items-center space-x-2">
              <RadioGroupItem
                className={twMerge(currentColor.tw_class)}
                value={opt.text}
                id={opt.text}
              />
              <Label htmlFor={opt.text} className="text-sm">
                {opt.text}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}
    </div>
  );
};

export default CheckboxesDesign;
