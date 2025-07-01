import { Input } from "@/components/ui/input";
import { fallbackColor } from "@/utils/constants";
import { EBlock, ETheme } from "@/utils/entities";
import { useState } from "react";
import BlockHeaderDesign from "./block-header-design";

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
      <BlockHeaderDesign
        numeric={theme.numeric_blocks}
        uppercase={theme.uppercase_block_name}
        name={name}
        description={description}
        required={required}
        position={position}
      />
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
