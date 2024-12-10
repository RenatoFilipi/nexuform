import Rating from "@/components/ui/rating";
import { BlockModel } from "@/helpers/models";

const RatingDesign = ({
  block,
  numericBlocks,
}: {
  block: BlockModel;
  numericBlocks: boolean;
}) => {
  const { name, description, required, rating, position } = block;

  const onChange = (rating: number) => {
    console.log(rating);
  };

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
      <Rating maxRating={rating ?? 5} onChange={onChange} />
    </div>
  );
};

export default RatingDesign;
