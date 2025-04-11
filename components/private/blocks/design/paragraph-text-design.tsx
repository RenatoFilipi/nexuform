import { Textarea } from "@/components/ui/textarea";
import { fallbackColor } from "@/utils/constants";
import { EBlock, ETheme } from "@/utils/entities";
import { useState } from "react";

const ParagraphTextDesign = ({
  block,
  theme,
  onValueChange,
}: {
  block: EBlock;
  theme: ETheme;
  onValueChange: (value: string, blockId: string) => void;
}) => {
  const { name, description, max_char, show_char, required, id, position, min_char, placeholder } = block;
  const [value, setValue] = useState("");
  const [charCount, setCharCount] = useState(0);

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
      <div className="">
        <Textarea
          value={value}
          placeholder={placeholder ?? ""}
          onChange={(e) => {
            setCharCount(e.target.value.length);
            setValue(e.target.value);
            onValueChange(e.target.value, block.id);
          }}
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
          minLength={min_char ?? 1}
          maxLength={max_char ?? 256}
        />
        {show_char && (
          <div className="w-full flex justify-end mt-1">
            <span className="text-xs">
              {charCount}/{max_char}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParagraphTextDesign;
