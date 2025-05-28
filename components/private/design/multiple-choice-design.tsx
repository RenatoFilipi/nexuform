import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { fallbackColor } from "@/utils/constants";
import { EBlock, ETheme } from "@/utils/entities";
import { twMerge } from "tailwind-merge";
import BlockHeaderDesign from "./block-header-design";

const MultipleChoiceDesign = ({
  block,
  theme,
  onValueChange,
}: {
  block: EBlock;
  theme: ETheme;
  onValueChange: (value: string, blockId: string) => void;
}) => {
  const { name, description, required, options, id, position } = block;

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
        <RadioGroup
          className="flex flex-col gap-1"
          onValueChange={(e) => {
            onValueChange(e, block.id);
          }}>
          {options.map((opt) => {
            const optionId = `${id}_${opt}`;
            return (
              <div key={opt} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={opt}
                  id={optionId}
                  style={
                    {
                      "--primary-color": theme.custom_primary_color || fallbackColor,
                    } as React.CSSProperties
                  }
                  className={twMerge(`
                    border-[var(--primary-color)]
                    text-[var(--primary-color)]
                    focus-visible:ring-[var(--primary-color)]
                    focus-visible:ring-offset-2
                  `)}
                />
                <Label htmlFor={optionId} className="text-sm">
                  {opt}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      )}
    </div>
  );
};

export default MultipleChoiceDesign;
