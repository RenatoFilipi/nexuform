import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { createClient } from "@/utils/supabase/client";
import { TAppState, TSetState } from "@/utils/types";
import { CheckIcon, FrownIcon, Loader2Icon, SmileIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode, useState } from "react";
import { Button } from "../../../ui/button";
import { Textarea } from "../../../ui/textarea";

const FeedbackForm = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80 p-3 mr-16">
        <Body setState={setOpen} />
      </PopoverContent>
    </Popover>
  );
};

const moods = [
  { icon: <SmileIcon className="w-4 h-4" />, value: "good" },
  { icon: <FrownIcon className="w-4 h-4" />, value: "bad" },
];

const Body = ({ setState }: { setState: TSetState<boolean> }) => {
  const t = useTranslations("app");
  const supabase = createClient();
  const [appState, setAppState] = useState<TAppState>("idle");
  const [localMood, setMood] = useState("");
  const [value, setValue] = useState("");

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
      <div className="min-h-32 flex flex-col justify-center items-center w-full h-full gap-4">
        <div className="flex justify-center items-center rounded-full p-2 bg-destructive/10">
          <XIcon className="text-destructive w-5 h-5" />
        </div>
        <div className="flex flex-col justify-center items-center text-sm text-foreground/80">
          <span>{t('"fb_error_1"')}</span>
          <span>{t("fb_error_2")}</span>
        </div>
      </div>
    );
  if (appState === "success")
    return (
      <div className="min-h-32 flex flex-col justify-center items-center w-full h-full gap-4">
        <div className="flex justify-center items-center rounded-full p-2 bg-success/10">
          <CheckIcon className="text-success w-5 h-5" />
        </div>
        <div className="flex flex-col justify-center items-center text-sm text-foreground/80">
          <span>{t("fb_success_1")}</span>
          <span>{t("fb_success_2")}</span>
        </div>
      </div>
    );

  return (
    <div className=" flex flex-col justify-between gap-3">
      <div className="flex flex-col">
        <Textarea value={value} onChange={(e) => setValue(e.target.value)} placeholder={t("fb_placeholder")} />
      </div>
      <div className="flex flex-col gap-4">
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
            {appState === "loading" && <Loader2Icon className="animate-spin w-4 h-4 mr-2" />}
            {t("fb_submit")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
