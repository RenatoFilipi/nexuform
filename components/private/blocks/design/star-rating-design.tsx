import Rating from "@/components/ui/rating";
import { EBlock, ETheme } from "@/utils/entities";

const StarRatingDesign = ({
  block,
  theme,
  onValueChange,
}: {
  block: EBlock;
  theme: ETheme;
  onValueChange: (value: string, blockId: string) => void;
}) => {
  const { name, description, required, rating, position } = block;

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
