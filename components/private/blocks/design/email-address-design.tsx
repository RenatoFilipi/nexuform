import { Input } from "@/components/ui/input";
import { fallbackColor } from "@/utils/constants";
import { EBlock, ETheme } from "@/utils/entities";
import { MailIcon } from "lucide-react";
import { useState } from "react";
import BlockHeaderDesign from "../block-header-design";

const EmailAddressDesign = ({
  block,
  theme,
  onValueChange,
}: {
  block: EBlock;
  theme: ETheme;
  onValueChange: (value: string, blockId: string) => void;
}) => {
  const { name, description, required, id, position, placeholder } = block;
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
      <div className="relative">
        <Input
          value={value}
          placeholder={placeholder ?? ""}
          onChange={(e) => {
            setValue(e.target.value);
            onValueChange(e.target.value, block.id);
          }}
          id={id}
          type="email"
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
            pl-3 pr-10  // Ajuste de padding para o ícone
          "
        />
        <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80 peer-disabled:opacity-50">
          <MailIcon size={16} strokeWidth={2} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};

export default EmailAddressDesign;
