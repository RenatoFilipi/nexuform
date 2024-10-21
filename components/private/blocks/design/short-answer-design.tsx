import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BlockProps } from "@/models/form";

const ShortAnswerDesign = ({ block }: { block: BlockProps }) => {
  return (
    <Card>
      <div>
        <h1>{block.name}</h1>
        <span>{block.description}</span>
      </div>
      <Input type="text" max={block.max_character_limit ?? 1} />
    </Card>
  );
};

export default ShortAnswerDesign;
