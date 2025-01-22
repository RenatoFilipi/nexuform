import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createClient } from "@/utils/supabase/client";
import { TAppState, TSetState } from "@/utils/types";
import {
  CheckIcon,
  FrownIcon,
  LoaderIcon,
  SmileIcon,
  XIcon,
} from "lucide-react";
import { ReactNode, useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

const Feedback = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="mr-20 w-80">
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
          <span>Something went wrong!</span>
          <span>Please try again.</span>
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
          <span>Your feedback has been received!</span>
          <span>Thank you for your help.</span>
        </div>
      </div>
    );

  return (
    <div className="min-h-32 flex flex-col justify-between">
      <div className="flex flex-col gap-2">
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Trouble with something technical? Let us know."
        />
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
                  size={"sm"}
                  className={`${
                    localMood === mood.value && "bg-primary/10 text-primary"
                  } `}>
                  {mood.icon}
                </Button>
              );
            })}
          </div>
          <Button
            size={"sm"}
            variant={"secondary"}
            onClick={onSendFeedback}
            disabled={appState === "loading"}>
            {appState === "loading" ? (
              <LoaderIcon className="w-4 h-4 animate-spin" />
            ) : (
              "Send Feedback"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
