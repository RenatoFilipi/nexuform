import { Button } from "@/components/ui/button";
import { ColorProps } from "@/helpers/interfaces";
import { BlockProps } from "@/models/form";
import { twMerge } from "tailwind-merge";
import CheckboxesDesign from "../blocks/design/checkboxes-design";
import DropdownDesign from "../blocks/design/dropdown-design";
import EmailDesign from "../blocks/design/email-design";
import LongAnswerDesign from "../blocks/design/long-answer-design";
import MultipleChoiceDesign from "../blocks/design/multiple-choice-design";
import NumberDesign from "../blocks/design/number-design";
import RatingDesign from "../blocks/design/rating-design";
import ScaleDesign from "../blocks/design/scale-design";
import ShortAnswerDesign from "../blocks/design/short-answer-design";

interface FormWrapperProps {
  mode: "preview" | "release";
  name: string;
  description: string | null;
  primaryColor: string;
  submitLabel: string;
  blocks: BlockProps[];
}

const submitButtonDesign: ColorProps[] = [
  {
    label: "Slate",
    tw_class: "bg-slate-500 hover:bg-slate-600 text-white",
  },
  {
    label: "Gray",
    tw_class: "bg-gray-500 hover:bg-gray-600 text-white",
  },
  {
    label: "Zinc",
    tw_class: "bg-zinc-500 hover:bg-zinc-600 text-white",
  },
  {
    label: "Neutral",
    tw_class: "bg-neutral-500 hover:bg-neutral-600 text-white",
  },
  {
    label: "Stone",
    tw_class: "bg-stone-500 hover:bg-stone-600 text-white",
  },
  {
    label: "Red",
    tw_class: "bg-red-500 hover:bg-red-600 text-white",
  },
  {
    label: "Orange",
    tw_class: "bg-orange-500 hover:bg-orange-600 text-white",
  },
  {
    label: "Amber",
    tw_class: "bg-amber-500 hover:bg-amber-600 text-black",
  },
  {
    label: "Yellow",
    tw_class: "bg-yellow-500 hover:bg-yellow-600 text-black",
  },
  {
    label: "Lime",
    tw_class: "bg-lime-500 hover:bg-lime-600 text-black",
  },
  {
    label: "Green",
    tw_class: "bg-green-500 hover:bg-green-600 text-white",
  },
  {
    label: "Emerald",
    tw_class: "bg-emerald-500 hover:bg-emerald-600 text-white",
  },
  {
    label: "Teal",
    tw_class: "bg-teal-500 hover:bg-teal-600 text-white",
  },
  {
    label: "Cyan",
    tw_class: "bg-cyan-500 hover:bg-cyan-600 text-white",
  },
  {
    label: "Sky",
    tw_class: "bg-sky-500 hover:bg-sky-600 text-white",
  },
  {
    label: "Blue",
    tw_class: "bg-blue-500 hover:bg-blue-600 text-white",
  },
  {
    label: "Indigo",
    tw_class: "bg-indigo-500 hover:bg-indigo-600 text-white",
  },
  {
    label: "Violet",
    tw_class: "bg-violet-500 hover:bg-violet-600 text-white",
  },
  {
    label: "Purple",
    tw_class: "bg-purple-500 hover:bg-purple-600 text-white",
  },
  {
    label: "Fuchsia",
    tw_class: "bg-fuchsia-500 hover:bg-fuchsia-600 text-white",
  },
  {
    label: "Pink",
    tw_class: "bg-pink-500 hover:bg-pink-600 text-white",
  },
  {
    label: "Rose",
    tw_class: "bg-rose-500 hover:bg-rose-600 text-white",
  },
];

const FormWrapper = ({
  mode,
  name,
  description,
  blocks,
  primaryColor,
  submitLabel,
}: FormWrapperProps) => {
  const sortedBlocks = blocks.sort((a, b) => a.position - b.position);
  const currentColor =
    submitButtonDesign.find((x) => x.label === primaryColor) ??
    submitButtonDesign[0];

  return (
    <div className="flex flex-col w-full gap-6 p-2 justify-start items-center overflow-y-auto">
      <div className="flex flex-col justify-center items-center w-full gap-1 max-w-[700px] px-2 sm:pt-6">
        <h1 className="font-bold text-3xl">{name}</h1>
        {description && (
          <p className="text-sm text-foreground/80">{description}</p>
        )}
      </div>
      <div className="w-full flex-1 px-2 gap-6 flex flex-col justify-start items-center max-w-[700px] sm:pb-8">
        <div className="flex flex-col gap-8 w-full ">
          {sortedBlocks.map((block) => {
            switch (block.type) {
              case "short_answer":
                return <ShortAnswerDesign block={block} />;
              case "long_answer":
                return <LongAnswerDesign block={block} />;
              case "multiple_choice":
                return (
                  <MultipleChoiceDesign
                    block={block}
                    primaryColor={primaryColor}
                  />
                );
              case "checkboxes":
                return (
                  <CheckboxesDesign block={block} primaryColor={primaryColor} />
                );
              case "dropdown":
                return <DropdownDesign block={block} />;
              case "number":
                return <NumberDesign block={block} />;
              case "email":
                return <EmailDesign block={block} />;
              case "rating":
                return <RatingDesign block={block} />;
              case "scale":
                return (
                  <ScaleDesign block={block} primaryColor={primaryColor} />
                );
            }
          })}
        </div>
        <div className="flex w-full justify-end">
          <Button
            variant={"secondary"}
            size={"sm"}
            className={twMerge(currentColor.tw_class)}>
            {submitLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormWrapper;
