import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import useGlobalStore from "@/stores/global";
import { minWidth640 } from "@/utils/constants";
import { formatDecimal, formatTime, getAverageCompletionRate, getAverageCompletionTime } from "@/utils/functions";
import { AlertTriangleIcon, DatabaseIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useMedia } from "react-use";

type TView = "total_views" | "total_submissions" | "completion_rate" | "completion_time";

const AnalyticsDetails = ({ children, view }: { children: React.ReactNode; view: TView }) => {
  const isDesktop = useMedia(minWidth640);
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="flex flex-col min-w-[500px] overflow-y-auto">
          <SheetHeader className="hidden">
            <SheetTitle></SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          {view === "total_views" && <TotalViews />}
          {view === "total_submissions" && <TotalSubmissions />}
          {view === "completion_rate" && <CompletionRate />}
          {view === "completion_time" && <CompletionTime />}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3 max-h-[70%] h-full">
        <DrawerHeader className="hidden">
          <DrawerTitle></DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        {view === "total_views" && <TotalViews />}
        {view === "total_submissions" && <TotalSubmissions />}
        {view === "completion_rate" && <CompletionRate />}
        {view === "completion_time" && <CompletionTime />}
      </DrawerContent>
    </Drawer>
  );
};
const TotalViews = () => {
  const t = useTranslations("app");
  const { viewLogs, forms } = useGlobalStore();

  const views = useMemo(() => {
    const viewsByFormId: Record<string, number> = {};

    for (const { form_id } of viewLogs) {
      viewsByFormId[form_id] = (viewsByFormId[form_id] || 0) + 1;
    }

    const result = forms.map((form) => {
      const count = viewsByFormId[form.id] ?? 0;
      return {
        id: form.id,
        name: form.name,
        count,
        available: true,
      };
    });

    return result;
  }, [viewLogs, forms]);
  const empty = views.length <= 0;

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="px-1">
        <h1 className="font-semibold text-base text-foreground/90">{t("label_views_by_form")}</h1>
      </div>
      {empty && <NoDataUI />}
      {!empty && (
        <div className="flex flex-col gap-3 overflow-y-auto pr-2">
          {views.map(({ id, name, count, available }) => (
            <div
              key={id}
              className="px-4 py-3 flex justify-between items-center rounded-lg hover:bg-foreground/5 transition-colors border hover:border-foreground/10">
              <div className="flex-1 min-w-0">
                <div className="flex justify-start items-center gap-2">
                  <h3 className="text-sm font-semibold truncate">{name}</h3>
                  {!available && (
                    <span className="flex items-center gap-1 text-xs text-destructive bg-destructive/10 px-1.5 py-0.5 rounded">
                      <AlertTriangleIcon className="w-3 h-3" />
                      {t("label_unavailable")}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">{t("label_total_views")}</p>
              </div>
              <span className={`${available ? "font-bold text-foreground/90" : "text-muted-foreground"} ml-4`}>
                {count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
const TotalSubmissions = () => {
  const t = useTranslations("app");
  const { submissionLogs, forms } = useGlobalStore();

  const submissions = useMemo(() => {
    const submissionsByFormId: Record<string, number> = {};

    for (const { form_id } of submissionLogs) {
      submissionsByFormId[form_id] = (submissionsByFormId[form_id] || 0) + 1;
    }

    const result = forms.map((form) => {
      const count = submissionsByFormId[form.id] ?? 0;
      return {
        id: form.id,
        name: form.name,
        count,
        available: true,
      };
    });

    return result;
  }, [submissionLogs, forms]);
  const empty = submissions.length <= 0;

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="px-1">
        <h1 className="font-semibold text-base text-foreground/90">{t("label_submissions_by_form")}</h1>
      </div>
      {empty && <NoDataUI />}
      {!empty && (
        <div className="flex flex-col gap-3 overflow-y-auto pr-2">
          {submissions.map(({ id, name, count, available }) => (
            <div
              key={id}
              className="px-4 py-3 flex justify-between items-center rounded-lg hover:bg-foreground/5 transition-colors border hover:border-foreground/10">
              <div className="flex-1 min-w-0">
                <div className="flex justify-start items-center gap-2">
                  <h3 className="text-sm font-semibold truncate">{name}</h3>
                  {!available && (
                    <span className="flex items-center gap-1 text-xs text-destructive bg-destructive/10 px-1.5 py-0.5 rounded">
                      <AlertTriangleIcon className="w-3 h-3" />
                      {t("label_unavailable")}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">{t("label_total_submissions")}</p>
              </div>
              <span className={`${available ? "font-bold text-foreground/90" : "text-muted-foreground"} ml-4`}>
                {count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
const CompletionRate = () => {
  const t = useTranslations("app");
  const { submissionLogs, viewLogs, forms } = useGlobalStore();

  const completionRates = useMemo(() => {
    const submissionsByFormId: Record<string, number> = {};
    for (const { form_id } of submissionLogs) {
      submissionsByFormId[form_id] = (submissionsByFormId[form_id] || 0) + 1;
    }

    const viewsByFormId: Record<string, number> = {};
    for (const { form_id } of viewLogs) {
      viewsByFormId[form_id] = (viewsByFormId[form_id] || 0) + 1;
    }

    return forms.map((form) => {
      const submissions = submissionsByFormId[form.id] || 0;
      const views = viewsByFormId[form.id] || 0;
      const rate = getAverageCompletionRate(views, submissions);
      const rateStr = formatDecimal(getAverageCompletionRate(views, submissions));

      return {
        id: form.id,
        name: form.name,
        rate,
        rateStr,
        submissions,
        views,
        available: true,
      };
    });
  }, [submissionLogs, viewLogs, forms]);

  const empty = completionRates.length <= 0;

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="px-1">
        <h1 className="font-semibold text-base text-foreground/90">{t("label_completion_rate_by_form")}</h1>
      </div>
      {empty && <NoDataUI />}
      {!empty && (
        <div className="flex flex-col gap-3 overflow-y-auto pr-2">
          {completionRates.map(({ id, name, rate, available, submissions, views, rateStr }) => (
            <div
              key={id}
              className="px-4 py-3 flex justify-between items-center rounded-lg hover:bg-foreground/5 transition-colors border hover:border-foreground/10">
              <div className="flex-1 min-w-0">
                <div className="flex justify-start items-center gap-2">
                  <h3 className="text-sm font-semibold truncate">{name}</h3>
                  {!available && (
                    <span className="flex items-center gap-1 text-xs text-destructive bg-destructive/10 px-1.5 py-0.5 rounded">
                      <AlertTriangleIcon className="w-3 h-3" />
                      {t("label_unavailable")}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  {t("label_completion_rate", { submissions, views })}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className={`${available ? "font-bold text-foreground/90" : "text-muted-foreground"}`}>
                  {rateStr}%
                </span>
                <div className="w-20 bg-gray-200 rounded-full h-1.5 mt-1">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: `${Math.min(100, rate)}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
const CompletionTime = () => {
  const t = useTranslations("app");
  const { submissionLogs, forms } = useGlobalStore();

  const completionTimes = useMemo(() => {
    const timesByForm: Record<string, number[]> = {};

    forms.forEach((form) => {
      timesByForm[form.id] = [];
    });

    submissionLogs.forEach((log) => {
      if (timesByForm[log.form_id]) {
        timesByForm[log.form_id].push(log.completion_time);
      }
    });

    const result = forms.map((form) => {
      const times = timesByForm[form.id] || [];
      const average = formatTime(getAverageCompletionTime(times), 1);

      return {
        id: form.id,
        name: form.name,
        averageTime: average,
        submissionCount: times.length,
      };
    });

    return result;
  }, [submissionLogs, forms]);

  console.log(completionTimes);
  const empty = completionTimes.length <= 0;

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="px-1">
        <h1 className="font-semibold text-base text-foreground/90">{t("label_completion_time_by_form")}</h1>
      </div>
      {empty && <NoDataUI />}
      {!empty && (
        <div className="flex flex-col gap-3 overflow-y-auto pr-2">
          {completionTimes.map(({ id, name, averageTime, submissionCount }) => (
            <div
              key={id}
              className="px-4 py-3 flex justify-between items-center rounded-lg hover:bg-foreground/5 transition-colors border hover:border-foreground/10">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold truncate">{name}</h3>
                <p className="text-xs text-muted-foreground mt-1.5">
                  {t("label_avg_completion_time", { count: submissionCount })}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-bold text-foreground/90">{averageTime}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
const NoDataUI = () => {
  const t = useTranslations("app");
  return (
    <div className="flex justify-center items-center h-full">
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="flex justify-center items-center p-3 rounded bg-primary/10">
          <DatabaseIcon className="text-primary w-5 h-5" />
        </div>
        <span className="text-sm text-muted-foreground">{t("label_no_data")}</span>
      </div>
    </div>
  );
};

export default AnalyticsDetails;
