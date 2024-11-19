import Rating from "@/components/ui/rating";
import { BlockProps } from "@/models/form";
import useEditorStore from "@/stores/editor";

const RatingDesign = ({ block }: { block: BlockProps }) => {
  const { name, description, required, max_rating, position } = block;
  const { numericBlocks } = useEditorStore();

  const onChange = (rating: number) => {
    console.log(rating);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="grid gap-1">
        <div className="flex gap-2">
          {numericBlocks && (
            <span className="bg-foreground/5 px-2 rounded">{position}</span>
          )}
          <h1 className="text-base font-medium">
            {name} {required && <span className="text-red-500">*</span>}
          </h1>
        </div>
        <span className="text-xs text-foreground/80">{description}</span>
      </div>
      <Rating maxRating={max_rating ?? 5} onChange={onChange} />
    </div>
  );
};

export default RatingDesign;
