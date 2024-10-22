import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ColorProps } from "@/helpers/interfaces";
import { BlockProps } from "@/models/form";
import { twMerge } from "tailwind-merge";
import LongAnswerDesign from "../blocks/design/long-answer-design";
import MultipleChoiceDesign from "../blocks/design/multiple-choice-design";
import ShortAnswerDesign from "../blocks/design/short-answer-design";

interface FormWrapperProps {
  mode: "preview" | "release";
  name: string;
  description: string | null;
  primaryColor: string;
  label: string;
  blocks: BlockProps[];
}
const submitButtonDesign: ColorProps[] = [
  {
    label: "Slate",
    tw_class:
      "bg-slate-500 hover:bg-slate-600 text-white dark:bg-slate-800 dark:hover:bg-slate-900",
  },
  {
    label: "Gray",
    tw_class:
      "bg-gray-500 hover:bg-gray-600 text-white dark:bg-gray-800 dark:hover:bg-gray-900",
  },
  {
    label: "Zinc",
    tw_class:
      "bg-zinc-500 hover:bg-zinc-600 text-white dark:bg-zinc-800 dark:hover:bg-zinc-900",
  },
  {
    label: "Neutral",
    tw_class:
      "bg-neutral-500 hover:bg-neutral-600 text-white dark:bg-neutral-800 dark:hover:bg-neutral-900",
  },
  {
    label: "Stone",
    tw_class:
      "bg-stone-500 hover:bg-stone-600 text-white dark:bg-stone-800 dark:hover:bg-stone-900",
  },
  {
    label: "Red",
    tw_class:
      "bg-red-500 hover:bg-red-600 text-white dark:bg-red-800 dark:hover:bg-red-900",
  },
  {
    label: "Orange",
    tw_class:
      "bg-orange-500 hover:bg-orange-600 text-white dark:bg-orange-800 dark:hover:bg-orange-900",
  },
  {
    label: "Amber",
    tw_class:
      "bg-amber-500 hover:bg-amber-600 text-black dark:bg-amber-800 dark:hover:bg-amber-900",
  },
  {
    label: "Yellow",
    tw_class:
      "bg-yellow-500 hover:bg-yellow-600 text-black dark:bg-yellow-800 dark:hover:bg-yellow-900",
  },
  {
    label: "Lime",
    tw_class:
      "bg-lime-500 hover:bg-lime-600 text-black dark:bg-lime-800 dark:hover:bg-lime-900",
  },
  {
    label: "Green",
    tw_class:
      "bg-green-500 hover:bg-green-600 text-white dark:bg-green-800 dark:hover:bg-green-900",
  },
  {
    label: "Emerald",
    tw_class:
      "bg-emerald-500 hover:bg-emerald-600 text-white dark:bg-emerald-800 dark:hover:bg-emerald-900",
  },
  {
    label: "Teal",
    tw_class:
      "bg-teal-500 hover:bg-teal-600 text-white dark:bg-teal-800 dark:hover:bg-teal-900",
  },
  {
    label: "Cyan",
    tw_class:
      "bg-cyan-500 hover:bg-cyan-600 text-white dark:bg-cyan-800 dark:hover:bg-cyan-900",
  },
  {
    label: "Sky",
    tw_class:
      "bg-sky-500 hover:bg-sky-600 text-white dark:bg-sky-800 dark:hover:bg-sky-900",
  },
  {
    label: "Blue",
    tw_class:
      "bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-800 dark:hover:bg-blue-900",
  },
  {
    label: "Indigo",
    tw_class:
      "bg-indigo-500 hover:bg-indigo-600 text-white dark:bg-indigo-800 dark:hover:bg-indigo-900",
  },
  {
    label: "Violet",
    tw_class:
      "bg-violet-500 hover:bg-violet-600 text-white dark:bg-violet-800 dark:hover:bg-violet-900",
  },
  {
    label: "Purple",
    tw_class:
      "bg-purple-500 hover:bg-purple-600 text-white dark:bg-purple-800 dark:hover:bg-purple-900",
  },
  {
    label: "Fuchsia",
    tw_class:
      "bg-fuchsia-500 hover:bg-fuchsia-600 text-white dark:bg-fuchsia-800 dark:hover:bg-fuchsia-900",
  },
  {
    label: "Pink",
    tw_class:
      "bg-pink-500 hover:bg-pink-600 text-white dark:bg-pink-800 dark:hover:bg-pink-900",
  },
  {
    label: "Rose",
    tw_class:
      "bg-rose-500 hover:bg-rose-600 text-white dark:bg-rose-800 dark:hover:bg-rose-900",
  },
];

const FormWrapper = ({
  mode,
  name,
  description,
  blocks,
  primaryColor,
}: FormWrapperProps) => {
  const sortedBlocks = blocks.sort((a, b) => a.position - b.position);
  const currentColor =
    submitButtonDesign.find((x) => x.label === primaryColor) ??
    submitButtonDesign[0];

  return (
    <div className="flex flex-col w-full h-full gap-6 p-2 justify-start items-center">
      <div className="flex flex-col justify-center items-center w-full gap-1">
        <h1 className="font-bold text-3xl">{name}</h1>
        {description && (
          <p className="text-sm text-foreground/80">{description}</p>
        )}
      </div>
      <div className="w-full flex-1 p-2 gap-6 flex flex-col justify-start items-center max-w-[700px] ">
        <div className="flex flex-col gap-8 w-full">
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
                return <Card>{block.type}</Card>;
              case "dropdown":
                return <Card>{block.type}</Card>;
              case "number":
                return <Card>{block.type}</Card>;
              case "email":
                return <Card>{block.type}</Card>;
              case "rating":
                return <Card>{block.type}</Card>;
              case "scale":
                return <Card>{block.type}</Card>;
            }
          })}
        </div>
        <div className="flex w-full">
          <Button
            variant={"secondary"}
            size={"sm"}
            className={twMerge(currentColor.tw_class)}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormWrapper;
