import { Input } from "@/components/ui/input";
import { fallbackColor } from "@/utils/constants";
import { EBlock, ETheme } from "@/utils/entities";
import { useState } from "react";

const DatePickerDesign = ({
  block,
  theme,
  onValueChange,
}: {
  block: EBlock;
  theme: ETheme;
  onValueChange: (value: string, blockId: string) => void;
}) => {
  const { name, description, required, id, position, placeholder, min_date, max_date } = block;
  const [value, setValue] = useState("");

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="grid gap-1">
        <div className="flex gap-2">
          {theme.numeric_blocks && <span className="">{position}.</span>}
          <h1 className={`${theme.uppercase_block_name && "uppercase"} text-sm font-semibold`}>
            {name} {required && <span className="text-red-500">*</span>}
          </h1>
        </div>
        <span className="text-xs text-foreground/80">{description}</span>
      </div>
      <div className="flex flex-col">
        <Input
          value={value}
          placeholder={placeholder ?? ""}
          min={min_date ?? ""}
          max={max_date ?? ""}
          onChange={(e) => {
            setValue(e.target.value);
            onValueChange(e.target.value, block.id);
          }}
          type="date"
          id={id}
          style={
            {
              "--ring-color": theme.custom_primary_color || fallbackColor,
            } as React.CSSProperties
          }
          className="
            focus-visible:ring-2
            focus-visible:ring-[var(--ring-color)]
            focus-visible:ring-offset-2
            transition-colors
          "
        />
      </div>
    </div>
  );
};

export default DatePickerDesign;
