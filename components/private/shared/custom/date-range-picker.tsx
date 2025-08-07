import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import useAppStore from "@/stores/app";
import useUserStore from "@/stores/user";
import { useQuery } from "@tanstack/react-query";
import { endOfMonth, endOfWeek, startOfMonth, startOfToday, startOfWeek, subDays } from "date-fns";
import { enUS, es, pt } from "date-fns/locale";
import { ArrowRight, CalendarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";
import { DateRange } from "react-day-picker";
import PlanBadge from "./plan-badge";
import { TDateRangePreset } from "@/utils/types";

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
  const isPresetActive = (presetId: TDateRangePreset, range: DateRange | undefined, today: Date): boolean => {
    if (!range?.from) return false;

    const fromDate = range.from;
    const toDate = range.to || range.from;

    switch (presetId) {
      case "today":
        return fromDate.toDateString() === today.toDateString() && toDate.toDateString() === today.toDateString();
      case "3days":
        return (
          fromDate.toDateString() === subDays(today, 2).toDateString() && toDate.toDateString() === today.toDateString()
        );
      case "7days":
        return (
          fromDate.toDateString() === subDays(today, 6).toDateString() && toDate.toDateString() === today.toDateString()
        );
      case "30days":
        return (
          fromDate.toDateString() === subDays(today, 29).toDateString() &&
          toDate.toDateString() === today.toDateString()
        );
      case "this_week":
        return (
          fromDate.toDateString() === startOfWeek(today).toDateString() &&
          toDate.toDateString() === endOfWeek(today).toDateString()
        );
      case "this_month":
        return (
          fromDate.toDateString() === startOfMonth(today).toDateString() &&
          toDate.toDateString() === endOfMonth(today).toDateString()
        );
      default:
        return false;
    }
  };
  const proPresets = [
    {
      label: t("label_today"),
      value: 1,
      handler: () => handleToday(),
      id: "today",
      days: 1,
    },
    {
      label: t("label_last_n_days", { n: 3, s: "s" }),
      value: 3,
      handler: () => handlePresetSelect(3),
      id: "3days",
      days: 3,
    },
    {
      label: t("label_last_n_days", { n: 7, s: "s" }),
      value: 7,
      handler: () => handlePresetSelect(7),
      id: "7days",
      days: 7,
    },
    {
      label: t("label_last_n_days", { n: 30, s: "s" }),
      value: 30,
      handler: () => handlePresetSelect(30),
      id: "30days",
      days: 30,
    },
    {
      label: t("label_this_week"),
      value: 0,
      handler: () => handleThisWeek(),
      id: "this_week",
      days: 0, // especial
    },
    {
      label: t("label_this_month"),
      value: 0,
      handler: () => handleThisMonth(),
      id: "this_month",
      days: 0, // especial
    },
  ];
  const notProPresets = [
    {
      label: t("label_today"),
      value: 1,
      handler: () => handleToday(),
      id: "today",
      days: 1,
    },
    {
      label: t("label_last_n_days", { n: 7, s: "s" }),
      value: 7,
      handler: () => handlePresetSelect(7),
      id: "7days",
      days: 7,
    },
  ];
  const presets = app.subscription.plan === "pro" ? proPresets : notProPresets;
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
        <PopoverContent className="w-auto mt-2 p-0" align={align}>
          <div className="flex justify-center items-center gap-4 p-4 flex-col">
            <div className="flex gap-4">
              {/* Presets column */}
              <div className="flex gap-3 w-ful flex-col">
                {presets.map((preset) => (
                  <Button
                    key={preset.id}
                    onClick={preset.handler}
                    variant="outline"
                    size="sm"
                    className={`w-full sm:w-44 flex justify-start items-center ${
                      isPresetActive(preset.id as TDateRangePreset, range, today) ? "bg-primary/10 border-primary" : ""
                    }`}>
                    {preset.label}
                  </Button>
                ))}
              </div>
              {/* Calendar column */}
              <div className="flex flex-col relative w-full">
                {!isAllowedCustom && (
                  <div className="absolute inset-0 bg-background/40 backdrop-blur z-10 flex flex-col items-center justify-center gap-4 p-4">
                    <div className="relative group">
                      <div className="">
                        <PlanBadge type="pro" size={36} />
                      </div>
                    </div>
                    <p className="text-sm text-center font-semibold">{t("label_upgrade_for_custom_dates")}</p>
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
            {/* Selected dates */}
            <div className="flex flex-col items-center gap-1 px-4 py-3 bg-muted/50 rounded-lg text-sm w-full">
              {range?.from ? (
                <div className="flex flex-col sm:flex-row items-center gap-1 w-full">
                  <div className="flex-1 text-center bg-background p-2 rounded-md border">
                    <p className="text-xs text-muted-foreground">{t("label_start_date")}</p>
                    <p className="font-medium">
                      {new Date(range.from).toLocaleDateString(user.locale, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="hidden sm:flex items-center justify-center text-muted-foreground mx-2">
                    <ArrowRight className="h-4 w-4" />
                  </div>

                  <div className="flex-1 text-center bg-background p-2 rounded-md border">
                    {range.to ? (
                      <>
                        <p className="text-xs text-muted-foreground">{t("label_end_date")}</p>
                        <p className="font-medium">
                          {new Date(range.to).toLocaleDateString(user.locale, {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </>
                    ) : (
                      <p className="text-muted-foreground italic">{t("label_single_day")}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center p-2 text-muted-foreground italic">{t("label_no_date_selected")}</div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3 border-t p-4">
            <Button
              variant="outline"
              className="w-fit"
              size="sm"
              onClick={() => {
                setOpen(false);
              }}>
              {t("label_close")}
            </Button>
            <Button variant="secondary" className="w-fit" size="sm" onClick={handleSave}>
              {t("label_apply")}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRangePicker;
