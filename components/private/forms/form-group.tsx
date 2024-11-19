import { BlockProps } from "@/models/form";
import CheckboxesDesign from "../blocks/design/checkboxes-design";
import DropdownDesign from "../blocks/design/dropdown-design";
import EmailDesign from "../blocks/design/email-design";
import LongAnswerDesign from "../blocks/design/long-answer-design";
import MultipleChoiceDesign from "../blocks/design/multiple-choice-design";
import NumberDesign from "../blocks/design/number-design";
import RatingDesign from "../blocks/design/rating-design";
import ScaleDesign from "../blocks/design/scale-design";
import ShortAnswerDesign from "../blocks/design/short-answer-design";

interface Props {
  blocks: BlockProps[];
  primaryColor: string;
}

const FormGroup = ({ blocks, primaryColor }: Props) => {
  return (
    <div className="flex flex-col justify-center items-center gap-4 w-full">
      {blocks.map((block) => {
        switch (block.type) {
          case "short_answer":
            return (
              <ShortAnswerDesign block={block} primaryColor={primaryColor} />
            );
          case "long_answer":
            return (
              <LongAnswerDesign block={block} primaryColor={primaryColor} />
            );
          case "multiple_choice":
            return (
              <MultipleChoiceDesign block={block} primaryColor={primaryColor} />
            );
          case "checkboxes":
            return (
              <CheckboxesDesign block={block} primaryColor={primaryColor} />
            );
          case "dropdown":
            return <DropdownDesign block={block} primaryColor={primaryColor} />;
          case "number":
            return <NumberDesign block={block} primaryColor={primaryColor} />;
          case "email":
            return <EmailDesign block={block} primaryColor={primaryColor} />;
          case "rating":
            return <RatingDesign block={block} />;
          case "scale":
            return <ScaleDesign block={block} primaryColor={primaryColor} />;
        }
      })}
    </div>
  );
};

export default FormGroup;
