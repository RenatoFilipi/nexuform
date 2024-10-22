import { Textarea } from "@/components/ui/textarea";
import { BlockProps } from "@/models/form";

const LongAnswerDesign = ({ block }: { block: BlockProps }) => {
  const {
    name,
    description,
    max_character_limit,
    show_character_limit,
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
        <Textarea maxLength={max_character_limit ?? 256} />
        {show_character_limit && (
          <div className="w-full flex justify-end mt-1">
            <span className="text-xs">{max_character_limit}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LongAnswerDesign;
