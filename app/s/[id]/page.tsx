"use client";

import Brand from "@/components/core/brand";
import GenericLoader from "@/components/core/generic-loader";
import FormGroupRelease from "@/components/private/forms/form-group-release";
import { Button } from "@/components/ui/button";
import { nanoid, uuid } from "@/helpers/functions";
import { mockBlocks, mockForms } from "@/helpers/mocks";
import { AnswerModel } from "@/helpers/models";
import { appState, colorLabel } from "@/helpers/types";
import useSubmissionStore from "@/stores/submission";
import { useQuery } from "@tanstack/react-query";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const S = () => {
  const {
    setId,
    setName,
    setDescription,
    setStatus,
    setTheme,
    setSubmitLabel,
    setBlocks,
    setSubmissionId,
    setAnswers,
    setNumericBlock,
  } = useSubmissionStore();
  const pathname = usePathname();
  const formId = pathname.split("/")[2];
  const [appState, setAppState] = useState<appState>("loading");

  useQuery({
    queryKey: ["submissionPageData"],
    queryFn: () => {
      const nnid = nanoid();
      const form = mockForms.find((x) => x.id === formId);
      const blocks = mockBlocks.filter((x) => x.form_id === formId);
      const answers: AnswerModel[] = blocks.map((block) => {
        return {
          id: uuid(),
          submission_id: nnid,
          block_id: block.id,
          answer: "",
        };
      });
      if (!form) {
        setAppState("idle");
        return null;
      }
      setId(form.id);
      setName(form.name);
      setDescription(form.description);
      setTheme(form.theme as colorLabel);
      setSubmitLabel(form.submit_label);
      setStatus(form.status);
      setNumericBlock(form.numeric_blocks);
      setBlocks(blocks);
      setSubmissionId(nnid);
      setAnswers(answers);
      if (form.status !== "published") {
        setAppState("error");
        return null;
      }
      setAppState("idle");
      return null;
    },
    refetchOnWindowFocus: false,
  });

  if (appState === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex justify-center items-center flex-col gap-2">
          <GenericLoader />
          <span className="text-sm text-foreground/80">
            Loading Environment
          </span>
        </div>
      </div>
    );
  }
  if (appState === "idle") {
    return (
      <div className="flex justify-center pt-6 sm:pt-10 pb-20 sm:pb-14">
        <div className="flex flex-col justify-center items-center sm:w-[600px] px-5 sm:px-0 gap-4">
          <FormGroupRelease />
          <span className="border rounded p-2 w-fit flex justify-center items-center gap-2 hover:bg-foreground/5 cursor-pointer">
            <Brand type="logo" className="fill-foreground w-4 h-4" />
            <span className="text-foreground/80 text-sm font-medium">
              Powered by Nebulaform
            </span>
          </span>
        </div>
      </div>
    );
  }
  if (appState === "error") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col justify-center items-center gap-6">
            <div className="flex justify-center items-center p-4 rounded bg-foreground/5 border">
              <Brand type="logo" className="fill-foreground w-10 h-10" />
            </div>
            <span className="text-foreground/80">
              This form is not accessible or does not exist.
            </span>
          </div>
          <div className="flex justify-center items-center gap-4 sm:flex-row flex-col">
            <Button variant={"outline"} asChild>
              <Link href={"/signup"}>Sign Up for an Account</Link>
            </Button>
            <Button asChild>
              <Link href={"/login"}>
                Create a New Form <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
};

export default S;
