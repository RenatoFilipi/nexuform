import { Input } from "@/components/ui/input";
import { BlockProps } from "@/models/form";

const NumberDesign = ({ block }: { block: BlockProps }) => {
  const {
    name,
    description,
    max_character_limit,
    min_character_limit,
    required,
  } = block;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid">
        <h1 className="text-base font-medium">
          {name} {required && <span className="text-red-500">*</span>}
        </h1>
        <span className="text-xs text-foreground/80">{description}</span>
      </div>
      <div className="">
        <Input
          type="number"
          min={min_character_limit ?? 1}
          max={max_character_limit ?? 256}
        />
      </div>
    </div>
  );
};

export default NumberDesign;
