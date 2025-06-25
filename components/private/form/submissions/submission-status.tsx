import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import usePlatformStore from "@/stores/platform";
import { ESubmission } from "@/utils/entities";
import { createClient } from "@/utils/supabase/client";
import { TAppState, TSetState, TSubmissionStatus } from "@/utils/types";
import { ChevronDown, LoaderIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

const SubmissionStatus = ({ submission, setState }: { submission: ESubmission; setState: TSetState<boolean> }) => {
  const t = useTranslations("app");
  const supabase = createClient();
  const [appState, setAppState] = useState<TAppState>("idle");
  const pf = usePlatformStore();

  const options = [
    {
      button: t("label_mark_reviewed"),
      label: t("label_reviewed"),
      value: "reviewed",
      description: t("desc_reviewed"),
    },
    {
      button: t("label_mark_not_reviewed"),
      label: t("label_not_reviewed"),
      value: "not_reviewed",
      description: t("desc_not_reviewed"),
    },
    {
      button: t("label_mark_ignored"),
      label: t("label_ignored"),
      value: "ignored",
      description: t("desc_ignored"),
    },
  ];
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
  const [isOpen, setIsOpen] = useState(false);

  const onSubmissionStatusSubmit = async () => {
    const status = options[Number(selectedIndex)].value;
    if (status === submission.status) return;
    setAppState("loading");
    const { data, error } = await supabase.from("submissions").update({ status }).eq("id", submission.id).select();

    if (error || !data) {
      toast.error(t("err_generic"));
      setAppState("idle");
      return;
    }

    const updatedSubmission = { ...submission, status };
    const updatedSubmissions = pf.submissions.map((oldSubmission) =>
      oldSubmission.id === updatedSubmission.id ? updatedSubmission : oldSubmission
    );
    pf.setSubmissions(updatedSubmissions);
    toast.success(t("suc_update_submission"));
    setAppState("idle");
    setState(false);
  };

  return (
    <div className="inline-flex -space-x-px divide-x divide-primary-foreground/30 shadow-sm shadow-black/5 rtl:space-x-reverse w-full sm:w-fit">
      <Button
        variant={"secondary"}
        disabled={appState === "loading"}
        size={"sm"}
        onClick={onSubmissionStatusSubmit}
        className="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10 w-full sm:w-fit">
        {appState === "loading" && <LoaderIcon className="w-4 h-4 animate-spin mr-2" />}
        {options[Number(selectedIndex)].button}
      </Button>
      <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
        <DropdownMenuTrigger asChild disabled={appState === "loading"}>
          <Button
            variant={"secondary"}
            className="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10"
            size="sm"
            aria-label="Options">
            <ChevronDown
              size={16}
              strokeWidth={2}
              aria-hidden="true"
              className={`${isOpen ? "rotate-180" : ""} transition-all`}
            />
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
export default SubmissionStatus;
