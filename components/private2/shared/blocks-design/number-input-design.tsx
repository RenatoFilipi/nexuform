import { Input } from "@/components/ui/input";
import { fallbackColor } from "@/utils/constants";
import { EBlock, ETheme } from "@/utils/entities";
import { useState } from "react";
import BlockHeaderDesign from "./block-header-design";

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
      <BlockHeaderDesign
        numeric={theme.numeric_blocks}
        uppercase={theme.uppercase_block_name}
        name={name}
        description={description}
        required={required}
        position={position}
      />
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
