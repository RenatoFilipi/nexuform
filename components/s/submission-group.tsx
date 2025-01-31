import useSubmissionStore from "@/stores/submission";
import { EAnswer, EBlock } from "@/utils/entities";
import { formatTime, isValidEmail } from "@/utils/functions";
import { IDesign } from "@/utils/interfaces";
import { createClient } from "@/utils/supabase/client";
import { TAppState } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { CheckCircleIcon, LoaderIcon } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { toast } from "sonner";
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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

const design: IDesign[] = [
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
  const supabase = createClient();
  const [appState, setAppState] = useState<TAppState>("idle");
  const currentColor =
    design.find((x) => x.label === theme.primary_color) ?? design[0];
  const [time, setTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useQuery({
    queryKey: ["submissionGroup"],
    queryFn: () => {
      startTimer();
      return null;
    },
    refetchOnWindowFocus: false,
  });
  const startTimer = () => {
    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    }
  };
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  const resetTimer = () => {
    stopTimer();
    setTime(0);
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
  const onSubmit = async () => {
    stopTimer();
    for (const answer of answers) {
      const block = blocks.find((x) => x.id === answer.block_id);
      if (!block) return;
      const isValidResponse = responseCheck(answer, block);
      if (!isValidResponse) {
        toast.error("Answer all required questions.");
        startTimer();
        return;
      }
    }
    let updatedSubmission = { ...submission, completion_time: time };

    const identifierValue = blocks.find((e) => e.is_identifier === true);
    if (identifierValue) {
      const answerValue = answers.find(
        (e) => e.block_id === identifierValue.id
      );
      if (answerValue) {
        updatedSubmission = {
          ...updatedSubmission,
          identifier: answerValue.value,
        };
      }
    }

    const { error: submissionError } = await supabase
      .from("submissions")
      .insert(updatedSubmission);

    if (submissionError) {
      console.log("erro na submissao");
      console.log(submissionError);
      toast.error("Error on submission, please try again.");
      return;
    }

    const { error: answersError } = await supabase
      .from("answers")
      .insert(answers);

    if (answersError) {
      console.log("erro nas respostas");
      console.log(answersError);
      await supabase
        .from("submissions")
        .delete()
        .eq("id", updatedSubmission.id);
      toast.error("Error on submission, please try again.");
      return;
    }

    setAppState("success");
  };
  const responseCheck = (answer: EAnswer, block: EBlock): boolean => {
    if (!block.required) return true;
    if (answer.value.trim() === "") return false;
    if (block.type === "email_address" && !isValidEmail(answer.value))
      return false;
    return true;
  };

  if (appState === "success")
    return (
      <div className="flex justify-center items-center w-full relative mt-20">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <CheckCircleIcon className="w-8 h-8 text-success" />
              <CardTitle className="text-2xl font-bold">
                Form Submitted Successfully!
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-foreground/80">
              Thank you for submitting your form. We have received your
              information.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col items-stretch space-y-4">
            <span>Want to create a form like this?</span>
            <Button asChild className="w-full">
              <Link
                href="/dashboard/forms"
                className="flex items-center justify-center">
                ⚡️ Access Nebulaform
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <div className="fixed bottom-4 w-full flex justify-center">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:underline flex items-center gap-2">
            <Brand type="logo" className="w-4 h-4 fill-current" />
            <span className="text-xs font-medium">Powered by Nebulaform</span>
          </Link>
        </div>
      </div>
    );

  return (
    <div
      className={`${
        theme.width === "centered" ? "sm:w-[650px]" : "w-full"
      }  flex flex-col gap-6 w-full border rounded m-4 sm:m-8 p-6 bg-background relative`}>
      <span className="hidden">{formatTime(time)}</span>
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
            {appState === "loading" && (
              <LoaderIcon className="animate-spin w-4 h-4 mr-2" />
            )}{" "}
            {form.submit_text}
          </Button>
        </div>
        {theme.nebulaform_branding && (
          <div className="flex justify-center items-center w-full">
            <span className="border rounded p-2 w-fit flex justify-center items-center gap-2 hover:bg-foreground/5 cursor-pointer">
              <Brand type="logo" className="fill-foreground w-4 h-4" />
              <span className="text-foreground/80 text-xs font-semibold">
                Powered by Nebulaform
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionGroup;
