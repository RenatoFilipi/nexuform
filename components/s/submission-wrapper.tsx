"use client";

import useSubmissionStore from "@/stores/submission";
import { EAnswer, EBlock, EForm, ESubmission, ETheme } from "@/utils/entities";
import { nanoid, uuid } from "@/utils/functions";
import { useQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { useTransition } from "react";
import SubmissionGroup from "./submission-group";

const SubmissionWrapper = ({
  form,
  theme,
  blocks,
}: {
  form: EForm;
  theme: ETheme;
  blocks: EBlock[];
}) => {
  const {
    setForm,
    setTheme,
    setBlocks,
    blocks: b,
    setSubmission,
    setAnswers,
  } = useSubmissionStore();
  const [isPending, startTransition] = useTransition();

  useQuery({
    queryKey: ["SubmissionData"],
    queryFn: () => {
      startTransition(() => {
        setForm(form);
        setTheme(theme);
        setBlocks(blocks);
        const submission: ESubmission = {
          id: uuid(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          form_id: form.id,
          sent_by: nanoid(),
          status: "not_reviewed",
          completion_time: null,
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
        setSubmission(submission);
        setAnswers(answers);
      });
      return null;
    },
    refetchOnWindowFocus: false,
  });

  if (isPending) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <LoaderIcon className="w-10 h-10 animate-spin fill-foreground" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start min-h-screen flex-1 border-t-foreground/5 border-t">
      {b.length > 0 && <SubmissionGroup />}
    </div>
  );
};

export default SubmissionWrapper;
