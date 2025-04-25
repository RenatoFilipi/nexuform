import { Checkbox } from "@/components/ui/checkbox";
import { fallbackColor } from "@/utils/constants";
import { EBlock, ETheme } from "@/utils/entities";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const CheckBoxesDesign = ({
  block,
  theme,
  onValueChange,
}: {
  block: EBlock;
  theme: ETheme;
  onValueChange: (value: string, blockId: string) => void;
}) => {
  const { name, description, required, options, id, position } = block;
  const [value, setValue] = useState<string[]>([]);

  const handleCheckboxChange = (optionId: string) => {
    setValue((prevValue) =>
      prevValue.includes(optionId) ? prevValue.filter((id) => id !== optionId) : [...prevValue, optionId]
    );
  };

  useQuery({
    queryKey: [value],
    queryFn: () => {
      onValueChange(value.toString(), block.id);
      return null;
    },
    refetchOnWindowFocus: false,
  });

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
        <div className="flex flex-col gap-1">
          {options.map((opt) => {
            const isChecked = value.includes(opt);
            return (
              <div key={opt} className="flex justify-start items-center gap-3">
                <Checkbox
                  id={id}
                  style={
                    {
                      "--primary-color": theme.custom_primary_color || fallbackColor,
                    } as React.CSSProperties
                  }
                  className={`
                    border-[var(--primary-color)]
                    data-[state=checked]:bg-[var(--primary-color)]
                    data-[state=checked]:text-white
                    focus-visible:ring-[var(--primary-color)]
                    focus-visible:ring-offset-2
                  `}
                  checked={isChecked}
                  onCheckedChange={() => handleCheckboxChange(opt)}
                />
                <span className="text-sm">{opt}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CheckBoxesDesign;
