"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useFormStore from "@/stores/form";
import { ESubmission } from "@/utils/entities";
import { createClient } from "@/utils/supabase/client";
import { TAppState, TSetState, TSubmissionStatus } from "@/utils/types";
import { ChevronDown, LoaderIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const options = [
  {
    button: "Mark as Reviewed",
    label: "Reviewed",
    value: "reviewed",
    description: "This indicates that the submission has already been reviewed and processed.",
  },
  {
    button: "Mark as Not Reviewed",
    label: "Not Reviewed",
    value: "not_reviewed",
    description: "This indicates that the submission is pending review and requires attention.",
  },
  {
    button: "Mark as Ignored",
    label: "Ignored",
    value: "ignored",
    description: "This indicates that the submission has been intentionally disregarded and marked as ignored.",
  },
];

const FormSubmissionStatus = ({ submission, setState }: { submission: ESubmission; setState: TSetState<boolean> }) => {
  const supabase = createClient();
  const [appState, setAppState] = useState<TAppState>("idle");
  const { submissions, setSubmissions } = useFormStore();

  const getDefaultIndex = (status: TSubmissionStatus) => {
    switch (status) {
      case "reviewed":
        return options.findIndex((x) => x.value === "not_reviewed").toString();
      case "not_reviewed":
        return options.findIndex((x) => x.value === "reviewed").toString();
      case "ignored":
        return options.findIndex((x) => x.value === "ignored").toString();
    }
  };

  const [selectedIndex, setSelectedIndex] = useState(getDefaultIndex(submission.status as TSubmissionStatus));

  const onSubmissionStatusSubmit = async () => {
    const status = options[Number(selectedIndex)].value;
    if (status === submission.status) return;
    setAppState("loading");
    const { data, error } = await supabase.from("submissions").update({ status }).eq("id", submission.id).select();

    if (error || !data) {
      toast.error("Failed to update submission status.");
      setAppState("idle");
      return;
    }

    const updatedSubmission = { ...submission, status };
    const updatedSubmissions = submissions.map((oldSubmission) =>
      oldSubmission.id === updatedSubmission.id ? updatedSubmission : oldSubmission
    );
    setSubmissions(updatedSubmissions);
    toast.success("Submission status updated.");
    setAppState("idle");
    setState(false);
  };

  return (
    <div className="inline-flex -space-x-px divide-x divide-primary-foreground/30 shadow-sm shadow-black/5 rtl:space-x-reverse">
      <Button
        variant={"default"}
        disabled={appState === "loading"}
        size={"sm"}
        onClick={onSubmissionStatusSubmit}
        className="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10">
        {appState === "loading" && <LoaderIcon className="w-4 h-4 animate-spin mr-2" />}
        {options[Number(selectedIndex)].button}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={appState === "loading"}>
          <Button
            variant={"default"}
            className="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10"
            size="sm"
            aria-label="Options">
            <ChevronDown size={16} strokeWidth={2} aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-w-64 md:max-w-xs" side="bottom" sideOffset={4} align="end">
          <DropdownMenuRadioGroup value={selectedIndex} onValueChange={setSelectedIndex}>
            {options.map((option, index) => (
              <DropdownMenuRadioItem key={option.label} value={String(index)} className="items-start [&>span]:pt-1.5">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">{option.label}</span>
                  <span className="text-xs text-muted-foreground">{option.description}</span>
                </div>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FormSubmissionStatus;
