"use client";

import ModeToggle2 from "@/components/shared/mode-toggle2";
import PoweredByBadge from "@/components/shared/powered-by-badge";
import useSubmissionStore from "@/stores/submission";
import { EAnswer, EBlock, EForm, EOrganization, ESubmission, ESubscription, ETheme } from "@/utils/entities";
import { isValidEmail, nanoid, uuid } from "@/utils/functions";
import { createClient } from "@/utils/supabase/client";
import { TAppState, TBlock } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRef, useState } from "react";
import { toast } from "sonner";
import CheckBoxesDesign from "../../private/shared/blocks-design/checkboxes-design";
import CustomScaleDesign from "../../private/shared/blocks-design/custom-scale-design";
import DatePickerDesign from "../../private/shared/blocks-design/date-picker-design";
import DropdownMenuDesign from "../../private/shared/blocks-design/dropdown-menu-design";
import EmailAddressDesign from "../../private/shared/blocks-design/email-address-design";
import MultipleChoiceDesign from "../../private/shared/blocks-design/multiple-choice-design";
import NumberInputDesign from "../../private/shared/blocks-design/number-input-design";
import ParagraphTextDesign from "../../private/shared/blocks-design/paragraph-text-design";
import ShortTextDesign from "../../private/shared/blocks-design/short-text-design";
import StarRatingDesign from "../../private/shared/blocks-design/star-rating-design";
import SubmissionSuccess from "./submission-success";

interface IProps {
  locale: string;
  organization: EOrganization;
  subscription: ESubscription;
  form: EForm;
  theme: ETheme;
  blocks: EBlock[];
}
const SubmissionWrapper = (props: IProps) => {
  const sub = useSubmissionStore();

  const query = useQuery({
    queryKey: ["submission-page"],
    queryFn: () => {
      sub.setForm(props.form);
      sub.setTheme(props.theme);
      sub.setBlocks(props.blocks);
      const submission: ESubmission = {
        id: uuid(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        form_id: props.form.id,
        identifier: nanoid(),
        status: "not_reviewed",
        completion_time: 0,
      };
      const answers: EAnswer[] = props.blocks.map((blo) => {
        return {
          id: uuid(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          block_id: blo.id,
          submission_id: submission.id,
          value: "",
        };
      });
      sub.setSubmission(submission);
      sub.setAnswers(answers);
      sub.setOrganization(props.organization);
      return null;
    },
  });

  if (query.isPending) return null;

  return <SubmissionEnvironment />;
};

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
const SubmissionEnvironment = () => {
  const t = useTranslations("s");
  const sub = useSubmissionStore();
  const supabase = createClient();
  const [appState, setAppState] = useState<TAppState>("idle");
  const [submissionState, setSubmissionState] = useState<TAppState>("idle");
  const [time, setTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
  const onValueChange = (value: string, blockId: string) => {
    const currentAnswer = sub.answers.find((answer) => answer.block_id === blockId);
    if (!currentAnswer) return;
    currentAnswer.value = value;
    const updatedAnswer = sub.answers.map((answer) => {
      if (answer.id === currentAnswer.id) return currentAnswer;
      return answer;
    });
    sub.setAnswers(updatedAnswer);
  };
  const responseCheck = (answer: EAnswer, block: EBlock): boolean => {
    if (!block.required) return true;
    if (answer.value.trim() === "") return false;
    if (block.type === "email_address" && !isValidEmail(answer.value)) return false;
    return true;
  };
  const onSubmit = async () => {
    stopTimer();
    for (const answer of sub.answers) {
      const block = sub.blocks.find((x) => x.id === answer.block_id);
      if (!block) return;
      const isValidResponse = responseCheck(answer, block);
      if (!isValidResponse) {
        toast.error(t("err_required_all"));
        startTimer();
        return;
      }
    }
    let updatedSubmission = { ...sub.submission, completion_time: time };

    const identifierValue = sub.blocks.find((e) => e.is_identifier === true);
    if (identifierValue) {
      const answerValue = sub.answers.find((e) => e.block_id === identifierValue.id);
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

    const { error: answersError } = await supabase.from("answers").insert(sub.answers);

    if (answersError) {
      await supabase.from("submissions").delete().eq("id", updatedSubmission.id);
      setSubmissionState("idle");
      toast.error(t("err_sub"));
      return;
    }

    await supabase.from("submission_logs").insert({
      form_id: sub.form.id,
      submission_id: sub.submission.id,
      org_id: sub.organization.id,
      completion_time: time,
    });

    setAppState("success");
    setSubmissionState("idle");
  };
  const query = useQuery({
    queryKey: ["submission-group"],
    queryFn: () => {
      startTimer();
      return null;
    },
  });

  if (query.isPending) return null;

  return (
    <div className="flex justify-center items-start flex-1 w-full">
      {appState === "success" && (
        <div className="flex justify-center items-center h-dvh w-full">
          <SubmissionSuccess />
        </div>
      )}
      {appState === "idle" && (
        <div className="flex flex-col gap-6 sm:w-[720px] w-full mt-10 px-4 sm:px-0">
          {/* Header */}
          <div className="flex flex-col gap-2 justify-center items-start">
            <h1 className="text-2xl font-bold">{sub.form.name}</h1>
            <p className="text-sm text-muted-foreground text-wrap">{sub.form.description}</p>
          </div>
          {/* Blocks */}
          <div className="flex flex-col gap-2 w-full">
            {sub.blocks.map((block) => {
              const Component = COMPONENT_MAP[block.type as TBlock];
              if (!Component) return null;
              return (
                <div key={block.id} className="py-3">
                  <Component block={block} theme={sub.theme} onValueChange={onValueChange} />
                </div>
              );
            })}
          </div>
          {/* Footer */}
          <div className="flex justify-center items-center w-full flex-col gap-6 mb-10">
            <button
              disabled={submissionState === "loading"}
              onClick={onSubmit}
              style={{ backgroundColor: sub.theme.custom_primary_color }}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 text-white w-full">
              {submissionState === "loading" && <LoaderIcon className="animate-spin w-4 h-4 mr-2" />}{" "}
              {sub.form.submit_label}
            </button>
            <span className="text-xs text-muted-foreground text-wrap">{t("label_form_notice")}</span>
            <div className="flex justify-between sm:justify-between items-center w-full gap-2 h-1/4">
              <ModeToggle2 />
              {sub.theme.app_branding && (
                <Link href="/">
                  <PoweredByBadge version="default" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionWrapper;
