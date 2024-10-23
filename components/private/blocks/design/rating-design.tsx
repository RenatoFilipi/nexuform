import Rating from "@/components/ui/rating";
import { BlockProps } from "@/models/form";

const RatingDesign = ({ block }: { block: BlockProps }) => {
  const { name, description, required, max_rating } = block;

  const onChange = (rating: number) => {
    console.log(rating);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid">
        <h1 className="text-base font-medium">
          {name} {required && <span className="text-red-500">*</span>}
        </h1>
        <span className="text-xs text-foreground/80">{description}</span>
      </div>
      <Rating maxRating={max_rating ?? 5} onChange={onChange} />
    </div>
  );
};

export default RatingDesign;
