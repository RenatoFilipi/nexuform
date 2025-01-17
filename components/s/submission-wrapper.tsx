"use client";

import useSubmissionStore from "@/stores/submission";
import { EBlock, EForm, ETheme } from "@/utils/entities";
import { useQuery } from "@tanstack/react-query";
import { useTransition } from "react";

const SubmissionWrapper = ({
  form,
  theme,
  blocks,
}: {
  form: EForm;
  theme: ETheme;
  blocks: EBlock[];
}) => {
  const { setForm, setTheme, setBlocks } = useSubmissionStore();
  const [isPending, startTransition] = useTransition();

  useQuery({
    queryKey: ["SubmissionData"],
    queryFn: () => {
      startTransition(() => {
        setForm(form);
        setTheme(theme);
        setBlocks(blocks);
      });
      return null;
    },
    refetchOnWindowFocus: false,
  });

  return <></>;
};

export default SubmissionWrapper;
