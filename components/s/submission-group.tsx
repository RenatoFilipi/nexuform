import useSubmissionStore from "@/stores/submission";
import { EAnswer, EBlock, ETheme } from "@/utils/entities";
import { isValidEmail } from "@/utils/functions";
import { createClient } from "@/utils/supabase/client";
import { TAppState, TBlock } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRef, useState } from "react";
import { toast } from "sonner";
import ModeToggle2 from "../core/mode-toggle2";
import CheckBoxesDesign from "../private/blocks/design/checkboxes-design";
import CustomScaleDesign from "../private/blocks/design/custom-scale-design";
import DatePickerDesign from "../private/blocks/design/date-picker-design";
import DropdownMenuDesign from "../private/blocks/design/dropdown-menu-design";
import EmailAddressDesign from "../private/blocks/design/email-address-design";
import MultipleChoiceDesign from "../private/blocks/design/multiple-choice-design";
import NumberInputDesign from "../private/blocks/design/number-input-design";
import ParagraphTextDesign from "../private/blocks/design/paragraph-text-design";
import ShortTextDesign from "../private/blocks/design/short-text-design";
import StarRatingDesign from "../private/blocks/design/star-rating-design";
import PoweredBy from "../shared/powered-by";
import SubmissionSuccess from "./submission-success";

interface IBlockComponent {
  block: EBlock;
  theme: ETheme;
  onValueChange: (value: string, blockId: string) => void;
}
const COMPONENT_MAP: Record<TBlock, React.ComponentType<IBlockComponent>> = {
  short_text: ShortTextDesign,
  paragraph_text: ParagraphTextDesign,
  multiple_choice: MultipleChoiceDesign,
  checkboxes: CheckBoxesDesign,
  dropdown_menu: DropdownMenuDesign,
  number_input: NumberInputDesign,
  email_address: EmailAddressDesign,
  star_rating: StarRatingDesign,
  custom_scale: CustomScaleDesign,
  date_picker: DatePickerDesign,
};

const SubmissionGroup = () => {
  const t = useTranslations("s");
  const supabase = createClient();
  const { form, theme, blocks, submission, answers, setAnswers } = useSubmissionStore();
  const [appState, setAppState] = useState<TAppState>("idle");
  const [submissionState, setSubmissionState] = useState<TAppState>("idle");
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
  const responseCheck = (answer: EAnswer, block: EBlock): boolean => {
    if (!block.required) return true;
    if (answer.value.trim() === "") return false;
    if (block.type === "email_address" && !isValidEmail(answer.value)) return false;
    return true;
  };
  const onSubmit = async () => {
    stopTimer();
    for (const answer of answers) {
      const block = blocks.find((x) => x.id === answer.block_id);
      if (!block) return;
      const isValidResponse = responseCheck(answer, block);
      if (!isValidResponse) {
        toast.error(t("err_required_all"));
        startTimer();
        return;
      }
    }
    let updatedSubmission = { ...submission, completion_time: time };

    const identifierValue = blocks.find((e) => e.is_identifier === true);
    if (identifierValue) {
      const answerValue = answers.find((e) => e.block_id === identifierValue.id);
      if (answerValue) {
        updatedSubmission = {
          ...updatedSubmission,
          identifier: answerValue.value,
        };
      }
    }

    setSubmissionState("loading");
    const { error: submissionError } = await supabase.from("submissions").insert(updatedSubmission);

    if (submissionError) {
      setSubmissionState("idle");
      toast.error(t("err_sub"));
      return;
    }

    const { error: answersError } = await supabase.from("answers").insert(answers);

    if (answersError) {
      await supabase.from("submissions").delete().eq("id", updatedSubmission.id);
      setSubmissionState("idle");
      toast.error(t("err_sub"));
      return;
    }

    setAppState("success");
    setSubmissionState("idle");
  };

  if (appState === "success")
    return (
      <div className="flex justify-center items-center h-dvh w-full">
        <SubmissionSuccess />
      </div>
    );

  return (
    <div className="flex flex-col gap-6 sm:w-[620px] my-10 px-4 sm:px-0 min-h-dvh">
      <div className="flex flex-col gap-2 justify-center items-start">
        <h1 className="text-2xl font-bold">{form.name}</h1>
        <p className="text-sm text-foreground/80">{form.description}</p>
      </div>
      <div className="flex flex-col gap-2 w-full">
        {blocks.map((block) => {
          const Component = COMPONENT_MAP[block.type as TBlock];
          if (!Component) return null;
          return (
            <div key={block.id} className="py-3">
              <Component block={block} theme={theme} onValueChange={onValueChange} />
            </div>
          );
        })}
      </div>
      <div className="flex justify-center items-center w-full flex-col gap-6">
        <button
          disabled={submissionState === "loading"}
          onClick={onSubmit}
          style={{ backgroundColor: theme.custom_primary_color }}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 text-white w-full">
          {submissionState === "loading" && <LoaderIcon className="animate-spin w-4 h-4 mr-2" />} {form.submit_text}
        </button>
        <div className="flex justify-between items-center w-full gap-2 h-1/4">
          <ModeToggle2 />
          {form.nebulaform_branding && (
            <Link href="/">
              <PoweredBy version="default" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionGroup;
