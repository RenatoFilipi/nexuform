"use client";

import Brand from "@/components/shared/brand";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/utils/supabase/client";
import { TAppState } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { CheckCircle2Icon, LoaderIcon } from "lucide-react";

const WaitlistForm = () => {
  const t = useTranslations("auth");
  const supabase = createClient();
  const [appState, setAppState] = useState<TAppState>("idle");

  const formSchema = z.object({
    email: z.string().email({ message: t("required_email") }),
    purpose: z.string({ required_error: t("required_purpose") }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      purpose: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setAppState("loading");
      const { email, purpose } = values;
      const { data, error } = await supabase.from("waitlist").select("*").eq("email", email);

      if (error) throw new Error(error.message);
      if (data.length >= 1) {
        toast.success(t("label_wl_already"));
        setAppState("idle");
        return;
      }

      const newPurpose = purpose.trim() !== "" ? purpose : "no purpose selected";
      const insert = await supabase.from("waitlist").insert({ email, purpose: newPurpose });
      if (insert.error) throw new Error(insert.error.message);
      setAppState("success");
    } catch (error) {
      toast.error(t("err_generic"));
      setAppState("idle");
    }
  };

  if (appState === "success") {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh px-4 text-center bg-gradient-to-b from-primary/15 to-background w-full gap-2">
        <CheckCircle2Icon className="h-14 w-14 text-green-500 mb-4" />
        <h2 className="text-3xl font-semibold text-foreground mb-2">🎉 {t("label_wl_success_title")}</h2>
        <p className="text-muted-foreground max-w-md">{t("label_wl_success_sub")}</p>
        <Link href="/" className="mt-6 text-sm text-muted-foreground hover:underline">
          ← {t("label_wl_back")}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center w-full min-h-dvh bg-gradient-to-b from-primary/15 to-background px-4">
      <div className="sm:max-w-xl w-full text-center flex flex-col gap-8">
        <div className="flex justify-center items-center mb-4">
          <Brand type="primary_logo_text" className="fill-foreground h-8" />
        </div>

        <h1 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tight">
          {t.rich("label_wl_headline", {
            main: (chunks) => (
              <span className="relative inline-block">
                <span className="relative z-10 text-primary decoration-primary/30 decoration-4 underline-offset-8">
                  {chunks}
                </span>
              </span>
            ),
          })}
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">{t("label_wl_subheadline")}</p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full mt-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <Input
                  type="email"
                  placeholder={t("label_wl_email_ph")}
                  className="rounded-md px-4 py-3 text-base"
                  required
                  {...field}
                />
              )}
            />

            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full rounded-md px-4 py-3 text-left text-base">
                    <SelectValue placeholder="Qual será o seu uso principal?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="leads">{t("label_wl_leads")}</SelectItem>
                    <SelectItem value="feedback">{t("label_wl_feedback")}</SelectItem>
                    <SelectItem value="bug reporting">{t("label_wl_bugs")}</SelectItem>
                    <SelectItem value="onboarding">{t("label_wl_onboarding")}</SelectItem>
                    <SelectItem value="intern">{t("label_wl_intern")}</SelectItem>
                    <SelectItem value="events">{t("label_wl_events")}</SelectItem>
                    <SelectItem value="other">{t("label_wl_other")}</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            <Button
              type="submit"
              variant={"secondary"}
              className="w-full text-base h-12"
              disabled={appState === "loading"}>
              {appState === "loading" && <LoaderIcon className="w-5 h-5 animate-spin mr-2" />}
              {t("label_wl_submit")}
            </Button>
          </form>
        </Form>

        <Link
          href="/"
          className={`${
            appState === "loading" ? "pointer-events-none opacity-50" : ""
          } text-sm text-muted-foreground hover:underline mt-2`}>
          ← {t("label_wl_back")}
        </Link>
      </div>
    </div>
  );
};

export default WaitlistForm;
