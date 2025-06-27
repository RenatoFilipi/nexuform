import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/client";
import { TAppState } from "@/utils/types";
import { CheckIcon, FrownIcon, LoaderIcon, SmileIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode, useState } from "react";
import { Button } from "../../../ui/button";
import { Textarea } from "../../../ui/textarea";

const FeedbackForm = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="flex w-full min-w-80 p-0" align="end">
        <Body />
      </PopoverContent>
    </Popover>
  );
};
const Body = () => {
  const t = useTranslations("app");
  const supabase = createClient();
  const [appState, setAppState] = useState<TAppState>("idle");
  const [localMood, setMood] = useState("");
  const [value, setValue] = useState("");

  const moods = [
    { icon: <SmileIcon className="w-4 h-4" />, value: "good" },
    { icon: <FrownIcon className="w-4 h-4" />, value: "bad" },
  ];

  const onSendFeedback = async () => {
    if (value.trim() === "") return;
    setAppState("loading");
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      setAppState("error");
      return;
    }
    const insertResult = await supabase.from("feedbacks").insert([
      {
        user_id: data.user.id,
        mood: localMood,
        user_agent: navigator.userAgent,
        path: window.location.pathname,
        value,
      },
    ]);
    if (insertResult.error) {
      setAppState("error");
      return;
    }
    setAppState("success");
  };

  if (appState === "error")
    return (
      <div className="min-h-40 flex flex-col justify-center items-center w-full h-full gap-4">
        <div className="flex justify-center items-center rounded p-2 bg-destructive/10">
          <XIcon className="text-destructive w-4 h-4" />
        </div>
        <div className="flex flex-col justify-center items-center text-sm text-foreground/80 gap-1">
          <span className="font-medium">{t("label_feedback_error")}</span>
          <span className="text-xs text-muted-foreground">{t("desc_feedback_error")}</span>
        </div>
      </div>
    );
  if (appState === "success")
    return (
      <div className="min-h-40 flex flex-col justify-center items-center w-full h-full gap-4">
        <div className="flex justify-center items-center rounded p-2 bg-success/10">
          <CheckIcon className="text-success w-4 h-4" />
        </div>
        <div className="flex flex-col justify-center items-center text-sm text-foreground/80 gap-1">
          <span className="font-medium">{t("label_feedback_success")}</span>
          <span className="text-xs text-muted-foreground">{t("desc_feedback_success")}</span>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col justify-between w-full">
      <div className="flex flex-col p-4">
        <Textarea value={value} onChange={(e) => setValue(e.target.value)} placeholder={t("fb_placeholder")} />
      </div>
      <Separator />
      <div className="flex flex-col gap-4 p-4">
        <div className="flex justify-between items-center w-full">
          <div className="flex justify-center items-center gap-2">
            {moods.map((mood, i) => {
              return (
                <Button
                  onClick={() => setMood(mood.value)}
                  key={i}
                  variant={"outline"}
                  size={"xs"}
                  className={`${localMood === mood.value && "bg-primary/10 text-primary"} `}>
                  {mood.icon}
                </Button>
              );
            })}
          </div>
          <Button size={"xs"} variant={"secondary"} onClick={onSendFeedback} disabled={appState === "loading"}>
            {appState === "loading" && <LoaderIcon className="animate-spin w-4 h-4 mr-2" />}
            {t("fb_submit")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
