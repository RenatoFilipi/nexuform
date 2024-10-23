import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BlockProps } from "@/models/form";

const DropdownDesign = ({ block }: { block: BlockProps }) => {
  const { id, options, required, name, description } = block;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid">
        <h1 className="text-base font-medium">
          {name} {required && <span className="text-red-500">*</span>}
        </h1>
        <span className="text-xs text-foreground/80">{description}</span>
      </div>
      {options && options.length >= 1 && (
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.id} value={opt.text}>
                {opt.text}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default DropdownDesign;
