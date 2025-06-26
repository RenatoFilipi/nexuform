import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { fallbackColor } from "@/utils/constants";
import { EBlock, ETheme } from "@/utils/entities";
import { useState } from "react";
import BlockHeaderDesign from "./block-header-design";

const CustomScaleDesign = ({
  block,
  theme,
  onValueChange,
}: {
  block: EBlock;
  theme: ETheme;
  onValueChange: (value: string, blockId: string) => void;
}) => {
  const { name, description, required, max_scale, id, position } = block;
  const maxScaleArray = Array.from({ length: max_scale ?? 5 }, (_, i) => i + 1);
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
      <RadioGroup
        defaultValue={value}
        onValueChange={(e) => {
          setValue(e);
          onValueChange(e, block.id);
        }}
        className="flex w-full">
        {maxScaleArray.map((scale) => {
          const scaleId = `${id}_${scale}`;
          return (
            <div key={scale} className="w-full">
              <RadioGroupItem value={scale.toString()} id={scaleId} className="peer sr-only" />
              <Label
                htmlFor={scaleId}
                style={
                  {
                    "--primary-color": theme.custom_primary_color || fallbackColor,
                  } as React.CSSProperties
                }
                className="
                  text-sm 
                  cursor-pointer 
                  flex 
                  items-center 
                  justify-center 
                  gap-2
                  border
                  border-muted 
                  bg-popover 
                  h-14 
                  hover:bg-accent 
                  hover:text-accent-foreground
                  peer-data-[state=checked]:border-[var(--primary-color)]
                  peer-data-[state=checked]:bg-[color-mix(in_srgb,var(--primary-color)_20%,transparent)]
                  [&:has([data-state=checked])]:border-[var(--primary-color)]
                ">
                {scale}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};

export default CustomScaleDesign;
