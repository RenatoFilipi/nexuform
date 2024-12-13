import Rating from "@/components/ui/rating";
import { BlockModel } from "@/helpers/models";

const StarRatingDesign = ({
  block,
  numericBlocks,
  onValueChange,
}: {
  block: BlockModel;
  numericBlocks: boolean;
  onValueChange: (value: string, blockId: string) => void;
}) => {
  const { name, description, required, rating, position } = block;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="grid gap-1">
        <div className="flex gap-2">
          {numericBlocks && (
            <span className="bg-foreground/5 px-2 rounded h-fit">
              {position}
            </span>
          )}
          <h1 className="text-base font-medium">
            {name} {required && <span className="text-red-500">*</span>}
          </h1>
        </div>
        <span className="text-xs text-foreground/80">{description}</span>
      </div>
      <Rating
        maxRating={rating ?? 5}
        onChange={(e) => {
          onValueChange(e.toString(), block.id);
        }}
      />
    </div>
  );
};

export default StarRatingDesign;
