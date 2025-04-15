import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { fallbackColor } from "@/utils/constants";
import { EBlock, ETheme } from "@/utils/entities";
import { useState } from "react";

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
      <div className="grid gap-1">
        <div className="flex gap-2">
          {theme.numeric_blocks && <span className="">{position}.</span>}
          <h1 className={`${theme.uppercase_block_name && "uppercase"} text-sm font-semibold`}>
            {name} {required && <span className="text-red-500">*</span>}
          </h1>
        </div>
        <span className="text-xs text-foreground/80">{description}</span>
      </div>
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
