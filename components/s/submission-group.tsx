import useSubmissionStore from "@/stores/submission";
import { ColorProps } from "@/utils/interfaces";
import { appState } from "@/utils/types";
import { LoaderIcon } from "lucide-react";
import { useState } from "react";
import Brand from "../core/brand";
import CheckBoxesDesign from "../private/blocks/design/checkboxes-design";
import CustomScaleDesign from "../private/blocks/design/custom-scale-design";
import DropdownMenuDesign from "../private/blocks/design/dropdown-menu-design";
import EmailAddressDesign from "../private/blocks/design/email-address-design";
import MultipleChoiceDesign from "../private/blocks/design/multiple-choice-design";
import NumberInputDesign from "../private/blocks/design/number-input-design";
import ParagraphTextDesign from "../private/blocks/design/paragraph-text-design";
import ShortTextDesign from "../private/blocks/design/short-text-design";
import StarRatingDesign from "../private/blocks/design/star-rating-design";
import { Button } from "../ui/button";

const design: ColorProps[] = [
  {
    label: "slate",
    tw_class: "bg-slate-500 hover:bg-slate-600 text-white",
  },
  {
    label: "gray",
    tw_class: "bg-gray-500 hover:bg-gray-600 text-white",
  },
  {
    label: "zinc",
    tw_class: "bg-zinc-500 hover:bg-zinc-600 text-white",
  },
  {
    label: "neutral",
    tw_class: "bg-neutral-500 hover:bg-neutral-600 text-white",
  },
  {
    label: "stone",
    tw_class: "bg-stone-500 hover:bg-stone-600 text-white",
  },
  {
    label: "red",
    tw_class: "bg-red-500 hover:bg-red-600 text-white",
  },
  {
    label: "orange",
    tw_class: "bg-orange-500 hover:bg-orange-600 text-white",
  },
  {
    label: "amber",
    tw_class: "bg-amber-500 hover:bg-amber-600 text-black",
  },
  {
    label: "yellow",
    tw_class: "bg-yellow-500 hover:bg-yellow-600 text-black",
  },
  {
    label: "lime",
    tw_class: "bg-lime-500 hover:bg-lime-600 text-black",
  },
  {
    label: "green",
    tw_class: "bg-green-500 hover:bg-green-600 text-white",
  },
  {
    label: "emerald",
    tw_class: "bg-emerald-500 hover:bg-emerald-600 text-white",
  },
  {
    label: "teal",
    tw_class: "bg-teal-500 hover:bg-teal-600 text-white",
  },
  {
    label: "cyan",
    tw_class: "bg-cyan-500 hover:bg-cyan-600 text-white",
  },
  {
    label: "sky",
    tw_class: "bg-sky-500 hover:bg-sky-600 text-white",
  },
  {
    label: "blue",
    tw_class: "bg-blue-500 hover:bg-blue-600 text-white",
  },
  {
    label: "indigo",
    tw_class: "bg-indigo-500 hover:bg-indigo-600 text-white",
  },
  {
    label: "violet",
    tw_class: "bg-violet-500 hover:bg-violet-600 text-white",
  },
  {
    label: "purple",
    tw_class: "bg-purple-500 hover:bg-purple-600 text-white",
  },
  {
    label: "fuchsia",
    tw_class: "bg-fuchsia-500 hover:bg-fuchsia-600 text-white",
  },
  {
    label: "pink",
    tw_class: "bg-pink-500 hover:bg-pink-600 text-white",
  },
  {
    label: "rose",
    tw_class: "bg-rose-500 hover:bg-rose-600 text-white",
  },
];

const SubmissionGroup = () => {
  const { form, theme, blocks, submission, answers, setAnswers } =
    useSubmissionStore();
  const [appState, setAppState] = useState<appState>("idle");
  const currentColor =
    design.find((x) => x.label === theme.primary_color) ?? design[0];

  const onSubmit = () => {
    console.log(submission);
    console.log(answers);
  };

  const onValueChange = (value: string, blockId: string) => {
    const currentAnswer = answers.find((answer) => answer.block_id === blockId);
    if (!currentAnswer) return;
    currentAnswer.value = value;
    const updatedAnswer = answers.map((answer) => {
      if (answer.id === currentAnswer.id) return currentAnswer;
      return answer;
    });
    setAnswers(updatedAnswer);
  };

  return (
    <div className="flex flex-col gap-6 w-full border rounded m-4 sm:m-8 p-6 sm:w-[650px] bg-background relative">
      <div
        className={`h-1 absolute top-0 w-full left-0 ${currentColor.tw_class}`}></div>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">{form.name}</h1>
        <p className="text-sm text-foreground/80">{form.description}</p>
      </div>
      <div className="flex flex-col justify-center items-center gap-8 w-full">
        {blocks.map((block) => {
          switch (block.type) {
            case "short_text":
              return (
                <ShortTextDesign
                  key={block.id}
                  block={block}
                  theme={theme}
                  onValueChange={onValueChange}
                />
              );
            case "paragraph_text":
              return (
                <ParagraphTextDesign
                  key={block.id}
                  block={block}
                  theme={theme}
                  onValueChange={onValueChange}
                />
              );
            case "checkboxes":
              return (
                <CheckBoxesDesign
                  key={block.id}
                  block={block}
                  theme={theme}
                  onValueChange={onValueChange}
                />
              );
            case "multiple_choice":
              return (
                <MultipleChoiceDesign
                  key={block.id}
                  block={block}
                  theme={theme}
                  onValueChange={onValueChange}
                />
              );
            case "dropdown_menu":
              return (
                <DropdownMenuDesign
                  key={block.id}
                  block={block}
                  theme={theme}
                  onValueChange={onValueChange}
                />
              );
            case "number_input":
              return (
                <NumberInputDesign
                  key={block.id}
                  block={block}
                  theme={theme}
                  onValueChange={onValueChange}
                />
              );
            case "email_address":
              return (
                <EmailAddressDesign
                  key={block.id}
                  block={block}
                  theme={theme}
                  onValueChange={onValueChange}
                />
              );
            case "star_rating":
              return (
                <StarRatingDesign
                  key={block.id}
                  block={block}
                  theme={theme}
                  onValueChange={onValueChange}
                />
              );
            case "custom_scale":
              return (
                <CustomScaleDesign
                  key={block.id}
                  block={block}
                  theme={theme}
                  onValueChange={onValueChange}
                />
              );
          }
        })}
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-end items-center w-full">
          <Button
            onClick={onSubmit}
            size={"sm"}
            className={`${currentColor.tw_class} w-full sm:w-fit`}>
            {appState === "loading" ? <LoaderIcon /> : `${form.submit_text}`}
          </Button>
        </div>
        <div className="flex justify-center items-center w-full">
          <span className="border rounded p-2 w-fit flex justify-center items-center gap-2 hover:bg-foreground/5 cursor-pointer">
            <Brand type="logo" className="fill-foreground w-4 h-4" />
            <span className="text-foreground/80 text-sm font-semibold">
              Powered by Nebulaform
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SubmissionGroup;
