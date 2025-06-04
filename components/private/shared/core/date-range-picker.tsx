import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import useUserStore from "@/stores/user";
import { subDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";
import { DateRange } from "react-day-picker";

interface IProps {
  className?: string;
  initialRange?: { from: string; to: string };
  onChange?: (range: { from: string; to: string } | undefined) => void;
}

const DateRangePicker = ({ className, initialRange, onChange }: IProps) => {
  const t = useTranslations("app");
  const user = useUserStore();

  const presets = [
    { label: `7 ${t("label_days")}`, value: 7 },
    { label: `30 ${t("label_days")}`, value: 30 },
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
        <PopoverContent className="w-auto mt-2" align="start">
          <div className="flex justify-center items-center gap-4">
            {/* Presets column */}
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-1 gap-3">
                {presets.map((preset) => (
                  <Button
                    key={preset.value}
                    onClick={() => handlePresetSelect(preset.value)}
                    variant="outline"
                    size="sm">
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
            {/* Calendar column */}
            <div className="flex flex-col">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={range?.from}
                selected={range}
                onSelect={handleSelect}
                numberOfMonths={1}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" className="" onClick={() => handleSelect(undefined)}>
                {t("label_clear")}
              </Button>
              <Button variant={"secondary"} size="sm" className="" onClick={handleSave}>
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
