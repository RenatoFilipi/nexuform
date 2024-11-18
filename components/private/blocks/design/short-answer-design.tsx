import { Input } from "@/components/ui/input";
import { ColorProps } from "@/helpers/interfaces";
import { BlockProps } from "@/models/form";

const design: ColorProps[] = [
  { label: "Slate", tw_class: "focus-visible:ring-slate-500" },
  { label: "Gray", tw_class: "focus-visible:ring-gray-500" },
  { label: "Zinc", tw_class: "focus-visible:ring-zinc-500" },
  { label: "Neutral", tw_class: "focus-visible:ring-neutral-500" },
  { label: "Stone", tw_class: "focus-visible:ring-stone-500" },
  { label: "Red", tw_class: "focus-visible:ring-red-500" },
  { label: "Orange", tw_class: "focus-visible:ring-orange-500" },
  { label: "Amber", tw_class: "focus-visible:ring-amber-500" },
  { label: "Yellow", tw_class: "focus-visible:ring-yellow-500" },
  { label: "Lime", tw_class: "focus-visible:ring-lime-500" },
  { label: "Green", tw_class: "focus-visible:ring-green-500" },
  { label: "Emerald", tw_class: "focus-visible:ring-emerald-500" },
  { label: "Teal", tw_class: "focus-visible:ring-teal-500" },
  { label: "Cyan", tw_class: "focus-visible:ring-cyan-500" },
  { label: "Sky", tw_class: "focus-visible:ring-sky-500" },
  { label: "Blue", tw_class: "focus-visible:ring-blue-500" },
  { label: "Indigo", tw_class: "focus-visible:ring-indigo-500" },
  { label: "Violet", tw_class: "focus-visible:ring-violet-500" },
  { label: "Purple", tw_class: "focus-visible:ring-purple-500" },
  { label: "Fuchsia", tw_class: "focus-visible:ring-fuchsia-500" },
  { label: "Pink", tw_class: "focus-visible:ring-pink-500" },
  { label: "Rose", tw_class: "focus-visible:ring-rose-500" },
];

const ShortAnswerDesign = ({
  block,
  primaryColor,
}: {
  block: BlockProps;
  primaryColor: string;
}) => {
  const {
    name,
    description,
    max_character_limit,
    show_character_limit,
    required,
    id,
  } = block;

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
      <div className="flex flex-col">
        <Input
          type="text"
          id={id}
          className={`${currentColor.tw_class}`}
          maxLength={max_character_limit ?? 256}
        />
        {show_character_limit && (
          <div className="w-full flex justify-end mt-1">
            <span className="text-xs">{max_character_limit}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShortAnswerDesign;
