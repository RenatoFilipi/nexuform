import Rating from "@/components/ui/rating";
import { EBlock, ETheme } from "@/utils/entities";
import BlockHeaderDesign from "./block-header-design";

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
      <BlockHeaderDesign
        numeric={theme.numeric_blocks}
        uppercase={theme.uppercase_block_name}
        name={name}
        description={description}
        required={required}
        position={position}
      />
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
