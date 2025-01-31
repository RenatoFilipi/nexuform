import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EBlock, ETheme } from "@/utils/entities";
import { IDesign } from "@/utils/interfaces";
import { useState } from "react";

const design: IDesign[] = [
  { label: "slate", tw_class: "focus-visible:ring-slate-500" },
  { label: "gray", tw_class: "focus-visible:ring-gray-500" },
  { label: "zinc", tw_class: "focus-visible:ring-zinc-500" },
  { label: "neutral", tw_class: "focus-visible:ring-neutral-500" },
  { label: "stone", tw_class: "focus-visible:ring-stone-500" },
  { label: "red", tw_class: "focus-visible:ring-red-500" },
  { label: "orange", tw_class: "focus-visible:ring-orange-500" },
  { label: "amber", tw_class: "focus-visible:ring-amber-500" },
  { label: "yellow", tw_class: "focus-visible:ring-yellow-500" },
  { label: "lime", tw_class: "focus-visible:ring-lime-500" },
  { label: "green", tw_class: "focus-visible:ring-green-500" },
  { label: "emerald", tw_class: "focus-visible:ring-emerald-500" },
  { label: "teal", tw_class: "focus-visible:ring-teal-500" },
  { label: "cyan", tw_class: "focus-visible:ring-cyan-500" },
  { label: "sky", tw_class: "focus-visible:ring-sky-500" },
  { label: "blue", tw_class: "focus-visible:ring-blue-500" },
  { label: "indigo", tw_class: "focus-visible:ring-indigo-500" },
  { label: "violet", tw_class: "focus-visible:ring-violet-500" },
  { label: "purple", tw_class: "focus-visible:ring-purple-500" },
  { label: "fuchsia", tw_class: "focus-visible:ring-fuchsia-500" },
  { label: "pink", tw_class: "focus-visible:ring-pink-500" },
  { label: "rose", tw_class: "focus-visible:ring-rose-500" },
];

const DropdownMenuDesign = ({
  block,
  theme,
  onValueChange,
}: {
  block: EBlock;
  theme: ETheme;
  onValueChange: (value: string, blockId: string) => void;
}) => {
  const { options, required, name, description, position } = block;
  const currentColor =
    design.find((x) => x.label === theme.primary_color) ?? design[0];
  const [value, setValue] = useState("");

  return (
    <div className="flex flex-col gap-4  w-full">
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
      {options && options.length >= 1 && (
        <Select
          onValueChange={(e) => {
            setValue(e);
            onValueChange(e, block.id);
          }}
          defaultValue={value}>
          <SelectTrigger className={`${currentColor.tw_class}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default DropdownMenuDesign;
