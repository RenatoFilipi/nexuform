import { Checkbox } from "@/components/ui/checkbox";
import { BlockProps } from "@/models/form";

const MultipleChoiceDesign = ({
  block,
  primaryColor,
}: {
  block: BlockProps;
  primaryColor: string;
}) => {
  const { name, description, required, options } = block;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid">
        <h1 className="text-base font-medium">
          {name} {required && <span className="text-red-500">*</span>}
        </h1>
        <span className="text-xs text-foreground/80">{description}</span>
      </div>
      {options && options.length >= 1 && (
        <div className="flex flex-col gap-1">
          {options.map((opt) => {
            return (
              <div
                key={opt.id}
                className="flex justify-start items-center gap-3">
                <Checkbox />
                <span className="text-sm">{opt.text}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceDesign;
