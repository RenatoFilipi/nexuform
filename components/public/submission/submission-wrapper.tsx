"use client";

import useSubmissionStore from "@/stores/submission";
import { EAnswer, EBlock, EForm, ESubmission, ETheme } from "@/utils/entities";
import { nanoid, uuid } from "@/utils/functions";
import { useQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { useTransition } from "react";
import SubmissionGroup from "./submission-group";

interface IProps {
  form: EForm;
  theme: ETheme;
  blocks: EBlock[];
}

const SubmissionWrapper = ({ form, theme, blocks }: IProps) => {
  const s = useSubmissionStore();
  const [isPending, startTransition] = useTransition();

  useQuery({
    queryKey: ["SubmissionData"],
    queryFn: () => {
      startTransition(() => {
        s.setForm(form);
        s.setTheme(theme);
        s.setBlocks(blocks);
        const submission: ESubmission = {
          id: uuid(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          form_id: form.id,
          identifier: nanoid(),
          status: "not_reviewed",
          completion_time: 0,
        };
        const answers: EAnswer[] = blocks.map((blo) => {
          return {
            id: uuid(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            block_id: blo.id,
            submission_id: submission.id,
            value: "",
          };
        });
        s.setSubmission(submission);
        s.setAnswers(answers);
      });
      return null;
    },
  });

  if (isPending) {
    return (
      <div className="flex justify-center items-center w-full h-dvh">
        <LoaderIcon className="w-10 h-10 animate-spin fill-foreground" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start flex-1 border-t-foreground/5 w-full">
      {s.blocks.length > 0 && <SubmissionGroup />}
    </div>
  );
};

export default SubmissionWrapper;
