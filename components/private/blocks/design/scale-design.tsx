import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ColorProps } from "@/helpers/interfaces";
import { BlockProps } from "@/models/form";

const design: ColorProps[] = [
  {
    label: "Slate",
    tw_class:
      "peer-data-[state=checked]:border-slate-500 peer-data-[state=checked]:bg-slate-500/20 [&:has([data-state=checked])]:border-slate-500",
  },
  {
    label: "Gray",
    tw_class:
      "peer-data-[state=checked]:border-gray-500 peer-data-[state=checked]:bg-gray-500/20 [&:has([data-state=checked])]:border-gray-500",
  },
  {
    label: "Zinc",
    tw_class:
      "peer-data-[state=checked]:border-zinc-500 peer-data-[state=checked]:bg-zinc-500/20 [&:has([data-state=checked])]:border-zinc-500",
  },
  {
    label: "Neutral",
    tw_class:
      "peer-data-[state=checked]:border-neutral-500 peer-data-[state=checked]:bg-neutral-500/20 [&:has([data-state=checked])]:border-neutral-500",
  },
  {
    label: "Stone",
    tw_class:
      "peer-data-[state=checked]:border-stone-500 peer-data-[state=checked]:bg-stone-500/20 [&:has([data-state=checked])]:border-stone-500",
  },
  {
    label: "Red",
    tw_class:
      "peer-data-[state=checked]:border-red-500 peer-data-[state=checked]:bg-red-500/20 [&:has([data-state=checked])]:border-red-500",
  },
  {
    label: "Orange",
    tw_class:
      "peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:bg-orange-500/20 [&:has([data-state=checked])]:border-orange-500",
  },
  {
    label: "Amber",
    tw_class:
      "peer-data-[state=checked]:border-amber-500 peer-data-[state=checked]:bg-amber-500/20 [&:has([data-state=checked])]:border-amber-500",
  },
  {
    label: "Yellow",
    tw_class:
      "peer-data-[state=checked]:border-yellow-500 peer-data-[state=checked]:bg-yellow-500/20 [&:has([data-state=checked])]:border-yellow-500",
  },
  {
    label: "Lime",
    tw_class:
      "peer-data-[state=checked]:border-lime-500 peer-data-[state=checked]:bg-lime-500/20 [&:has([data-state=checked])]:border-lime-500",
  },
  {
    label: "Green",
    tw_class:
      "peer-data-[state=checked]:border-green-500 peer-data-[state=checked]:bg-green-500/20 [&:has([data-state=checked])]:border-green-500",
  },
  {
    label: "Emerald",
    tw_class:
      "peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-500/20 [&:has([data-state=checked])]:border-emerald-500",
  },
  {
    label: "Teal",
    tw_class:
      "peer-data-[state=checked]:border-teal-500 peer-data-[state=checked]:bg-teal-500/20 [&:has([data-state=checked])]:border-teal-500",
  },
  {
    label: "Cyan",
    tw_class:
      "peer-data-[state=checked]:border-cyan-500 peer-data-[state=checked]:bg-cyan-500/20 [&:has([data-state=checked])]:border-cyan-500",
  },
  {
    label: "Sky",
    tw_class:
      "peer-data-[state=checked]:border-sky-500 peer-data-[state=checked]:bg-sky-500/20 [&:has([data-state=checked])]:border-sky-500",
  },
  {
    label: "Blue",
    tw_class:
      "peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-500/20 [&:has([data-state=checked])]:border-blue-500",
  },
  {
    label: "Indigo",
    tw_class:
      "peer-data-[state=checked]:border-indigo-500 peer-data-[state=checked]:bg-indigo-500/20 [&:has([data-state=checked])]:border-indigo-500",
  },
  {
    label: "Violet",
    tw_class:
      "peer-data-[state=checked]:border-violet-500 peer-data-[state=checked]:bg-violet-500/20 [&:has([data-state=checked])]:border-violet-500",
  },
  {
    label: "Purple",
    tw_class:
      "peer-data-[state=checked]:border-purple-500 peer-data-[state=checked]:bg-purple-500/20 [&:has([data-state=checked])]:border-purple-500",
  },
  {
    label: "Fuchsia",
    tw_class:
      "peer-data-[state=checked]:border-fuchsia-500 peer-data-[state=checked]:bg-fuchsia-500/20 [&:has([data-state=checked])]:border-fuchsia-500",
  },
  {
    label: "Pink",
    tw_class:
      "peer-data-[state=checked]:border-pink-500 peer-data-[state=checked]:bg-pink-500/20 [&:has([data-state=checked])]:border-pink-500",
  },
  {
    label: "Rose",
    tw_class:
      "peer-data-[state=checked]:border-rose-500 peer-data-[state=checked]:bg-rose-500/20 [&:has([data-state=checked])]:border-rose-500",
  },
];

const ScaleDesign = ({
  block,
  primaryColor,
}: {
  block: BlockProps;
  primaryColor: string;
}) => {
  const { name, description, required, max_scale, id } = block;
  const maxScaleArray = Array.from({ length: max_scale ?? 5 }, (_, i) => i + 1);
  const currentColor =
    design.find((x) => x.label === primaryColor) ?? design[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid">
        <h1 className="text-base font-medium">
          {name} {required && <span className="text-red-500">*</span>}
        </h1>
        <span className="text-xs text-foreground/80">{description}</span>
      </div>
      <RadioGroup className="flex w-full">
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
                className={`${currentColor.tw_class} text-sm cursor-pointer flex items-center justify-center gap-2 rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground`}>
                {scale}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};

export default ScaleDesign;
