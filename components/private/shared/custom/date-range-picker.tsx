import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import useAppStore from "@/stores/app";
import useUserStore from "@/stores/user";
import { useQuery } from "@tanstack/react-query";
import { endOfMonth, endOfWeek, startOfMonth, startOfToday, startOfWeek, subDays } from "date-fns";
import { enUS, es, pt } from "date-fns/locale";
import { ArrowUpRightIcon, CalendarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";
import { DateRange } from "react-day-picker";
import ManageSubscription2 from "../subscription/manage-subscription2";
import PlanBadge from "./plan-badge";

interface IProps {
  className?: string;
  initialRange?: { from: string; to: string };
  onChange?: (range: { from: string; to: string } | undefined) => void;
  align?: "center" | "start" | "end" | undefined;
}

const DateRangePicker = ({ className, initialRange, onChange, align }: IProps) => {
  const t = useTranslations("app");
  const user = useUserStore();
  const app = useAppStore();
  const isAllowedCustom = app.subscription.plan === "pro";
  const today = startOfToday();
  const isOwner = app.context.isOrgOwner;

  const query = useQuery({
    queryKey: ["date-range-picker"],
    queryFn: () => {
      const getLocale = () => {
        switch (user.locale) {
          case "pt":
            return pt;
          case "es":
            return es;
          default:
            return enUS;
        }
      };
      const locale = getLocale();
      return { locale };
    },
  });
  const presets = [
    { label: t("label_today"), value: 1, handler: () => handleToday(), id: "today" },
    {
      label: t("label_last_n_days", {
        n: 3,
        s: "s",
      }),
      value: 3,
      handler: () => handlePresetSelect(3),
      id: "last_3_days",
    },
    {
      label: t("label_last_n_days", {
        n: 7,
        s: "s",
      }),
      value: 7,
      handler: () => handlePresetSelect(7),
      id: "last_7_days",
    },
    {
      label: t("label_last_n_days", {
        n: 30,
        s: "s",
      }),
      value: 30,
      handler: () => handlePresetSelect(30),
      id: "last_30_days",
    },
    { label: t("label_this_week"), value: 0, handler: () => handleThisWeek(), id: "this_week" },
    { label: t("label_this_month"), value: 0, handler: () => handleThisMonth(), id: "this_month" },
  ];
  const [range, setRange] = React.useState<DateRange | undefined>(
    initialRange
      ? {
          from: new Date(initialRange.from),
          to: new Date(initialRange.to),
        }
      : undefined
  );
  const [open, setOpen] = React.useState(false);
  const handleSelect = (newRange: DateRange | undefined) => {
    if (!isAllowedCustom) return;
    setRange(newRange);
  };
  const handleSave = () => {
    if (range?.from) {
      const fromDate = new Date(range.from);
      fromDate.setHours(0, 0, 0, 0);

      const toDate = range.to ? new Date(range.to) : new Date(range.from);
      toDate.setHours(23, 59, 59, 999);

      onChange?.({
        from: fromDate.toISOString(),
        to: toDate.toISOString(),
      });
    } else {
      onChange?.(undefined);
    }
    setOpen(false);
  };
  const handlePresetSelect = (days: number) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const from = subDays(today, days - 1);
    from.setHours(0, 0, 0, 0);

    setRange({
      from,
      to: today,
    });
  };
  const handleToday = () => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    setRange({
      from: today,
      to: today,
    });
  };
  const handleThisWeek = () => {
    const today = new Date();
    setRange({
      from: startOfWeek(today),
      to: endOfWeek(today),
    });
  };
  const handleThisMonth = () => {
    const today = new Date();
    setRange({
      from: startOfMonth(today),
      to: endOfMonth(today),
    });
  };
  if (query.isPending) return null;

  return (
    <div className={cn("", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="justify-between text-left font-normal sm:w-[230px]">
            <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
            {range?.from ? (
              range.to ? (
                <span className="">
                  {new Date(range.from).toLocaleDateString(user.locale)} →{" "}
                  {new Date(range.to).toLocaleDateString(user.locale)}
                </span>
              ) : (
                <span className="">{new Date(range.from).toLocaleDateString(user.locale)}</span>
              )
            ) : (
              <span className="">-</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto mt-2" align={align}>
          <div className="flex justify-center items-center gap-4">
            {/* Presets column */}
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-1 gap-3">
                {presets.map((preset) => (
                  <Button key={preset.id} onClick={preset.handler} variant="outline" size="sm">
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
            {/* Calendar column */}
            <div className="flex flex-col relative">
              {!isAllowedCustom && (
                <div className="absolute inset-0 bg-background/40 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4 p-4">
                  <div className="relative group">
                    <div className="">
                      <PlanBadge type="pro" size={36} />
                    </div>
                  </div>
                  <p className="text-sm text-center">{t("label_upgrade_for_custom_dates")}</p>
                  {isOwner && (
                    <ManageSubscription2 selected="pro">
                      <Button variant="secondary" size="xs">
                        <ArrowUpRightIcon className="w-4 h-4 mr-2" />
                        {t("label_upgrade_to_pro")}
                      </Button>
                    </ManageSubscription2>
                  )}
                </div>
              )}
              <Calendar
                mode="range"
                defaultMonth={range?.to || today}
                selected={range}
                onSelect={handleSelect}
                numberOfMonths={1}
                locale={query.data?.locale}
                className={!isAllowedCustom ? "opacity-50 pointer-events-none" : ""}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={handleSave}>
                {t("label_apply")}
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRangePicker;
