import Brand from "@/components/shared/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "next-intl";
import Link from "next/link";

const WaitlistForm = () => {
  const t = useTranslations("auth");

  return (
    <div className="flex flex-col justify-center items-center w-full min-h-screen bg-gradient-to-b from-primary/15 to-background px-4">
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
        <form className="flex flex-col gap-4 w-full mt-2">
          <Input
            type="email"
            placeholder={t("label_wl_email_ph")}
            className="rounded-md px-4 py-3 text-base"
            required
          />
          <Select required>
            <SelectTrigger className="w-full rounded-md px-4 py-3 text-left text-base">
              <SelectValue placeholder="Qual será o seu uso principal?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="leads">{t("label_wl_leads")}</SelectItem>
              <SelectItem value="feedback">{t("label_wl_feedback")}</SelectItem>
              <SelectItem value="bug-reporting">{t("label_wl_bugs")}</SelectItem>
              <SelectItem value="onboarding">{t("label_wl_onboarding")}</SelectItem>
              <SelectItem value="intern">{t("label_wl_intern")}</SelectItem>
              <SelectItem value="events">{t("label_wl_events")}</SelectItem>
              <SelectItem value="other">{t("label_wl_other")}</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" variant={"secondary"} className="w-full text-base h-12">
            {t("label_wl_submit")}
          </Button>
        </form>
        <Link href="/" className="text-sm text-muted-foreground hover:underline mt-2">
          ← {t("label_wl_back")}
        </Link>
      </div>
    </div>
  );
};

export default WaitlistForm;
