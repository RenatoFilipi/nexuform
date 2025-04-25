import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fallbackColor } from "@/utils/constants";
import { EBlock, ETheme } from "@/utils/entities";
import { useState } from "react";
import BlockHeaderDesign from "../block-header-design";

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
      {options && options.length >= 1 && (
        <Select
          onValueChange={(e) => {
            setValue(e);
            onValueChange(e, block.id);
          }}
          defaultValue={value}>
          <SelectTrigger
            style={
              {
                "--ring-color": theme.custom_primary_color || fallbackColor,
              } as React.CSSProperties
            }
            className="
              focus-visible:ring-2
              focus-visible:ring-[var(--ring-color)]
              focus-visible:ring-offset-2
            ">
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
