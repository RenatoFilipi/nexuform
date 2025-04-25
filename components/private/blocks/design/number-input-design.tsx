import { Input } from "@/components/ui/input";
import { fallbackColor } from "@/utils/constants";
import { EBlock, ETheme } from "@/utils/entities";
import { useState } from "react";

const NumberInputDesign = ({
  block,
  theme,
  onValueChange,
}: {
  block: EBlock;
  theme: ETheme;
  onValueChange: (value: string, blockId: string) => void;
}) => {
  const { name, description, max_char, min_char, required, id, position, placeholder } = block;
  const [value, setValue] = useState("");

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onValueChange(newValue, block.id);
  };

  const enforceMinMax = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    const value = parseFloat(input.value);

    // Se o valor não for um número válido, não fazemos nada
    if (isNaN(value)) return;

    // Aplica max_char apenas se não for null
    if (max_char !== null && max_char !== undefined && value > max_char) {
      input.value = max_char.toString();
      setValue(max_char.toString());
      onValueChange(max_char.toString(), block.id);
    }
    // Aplica min_char apenas se não for null
    else if (min_char !== null && min_char !== undefined && value < min_char) {
      input.value = min_char.toString();
      setValue(min_char.toString());
      onValueChange(min_char.toString(), block.id);
    }
  };

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
      <div>
        <Input
          value={value}
          placeholder={placeholder ?? ""}
          onChange={handleValueChange}
          onKeyUp={enforceMinMax}
          id={id}
          style={
            {
              "--ring-color": theme.custom_primary_color || fallbackColor,
            } as React.CSSProperties
          }
          className="
            transition-colors
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[var(--ring-color)]
            focus-visible:ring-offset-2
          "
          type="number"
          min={min_char ?? undefined}
          max={max_char ?? undefined}
        />
      </div>
    </div>
  );
};

export default NumberInputDesign;
