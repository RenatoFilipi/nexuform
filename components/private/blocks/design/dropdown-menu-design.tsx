import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fallbackColor } from "@/utils/constants";
import { EBlock, ETheme } from "@/utils/entities";
import { useState } from "react";

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
      <div className="grid gap-1">
        <div className="flex gap-2">
          {theme.numeric_blocks && <span className="">{position}.</span>}
          <h1 className={`${theme.uppercase_block_name && "uppercase"} text-sm font-semibold`}>
            {name} {required && <span className="text-red-500">*</span>}
          </h1>
        </div>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
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
