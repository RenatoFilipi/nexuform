import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, subDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";
import { DateRange } from "react-day-picker";

interface IProps {
  className?: string;
  initialRange?: { from: string; to: string };
  onChange?: (range: { from: string; to: string } | undefined) => void;
}

const format1 = "dd MMM yyyy";
const format2 = "dd-MM-yyyy";

const presets = [
  { value: 7, name: "7d" },
  { value: 30, name: "30d" },
];

const DateRangePicker = ({ className, initialRange, onChange }: IProps) => {
  const t = useTranslations("app");
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
    if (range?.from && range?.to) {
      onChange?.({
        from: range.from.toISOString(),
        to: range.to.toISOString(),
      });
    } else {
      onChange?.(undefined);
    }
    setOpen(false);
  };

  const handlePresetSelect = (days: number) => {
    const today = new Date();
    const from = subDays(today, days - 1);
    const to = today;

    setRange({
      from,
      to,
    });
  };

  return (
    <div className={cn("", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="justify-start text-left font-normal w-full">
            <CalendarIcon className="mr-2 h-3 w-3 text-primary" />
            {range?.from ? (
              range.to ? (
                <span className="text-xs">
                  {format(range.from, format1)} → {format(range.to, format1)}
                </span>
              ) : (
                <span className="text-xs">{format(range.from, format1)}</span>
              )
            ) : (
              <span className="text-xs">Select dates</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <div className="flex gap-4">
            {/* Presets column */}
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-1 gap-1">
                {presets.map((preset) => (
                  <Button
                    key={preset.value}
                    onClick={() => handlePresetSelect(preset.value)}
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-7 text-xs w-full",
                      range?.from &&
                        range.to &&
                        range.from.getTime() === subDays(new Date(), preset.value - 1).getTime() &&
                        range.to.getTime() === new Date().getTime()
                        ? "bg-primary/10 border-primary"
                        : ""
                    )}>
                    {preset.name}
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
            <div className="grid grid-cols-2 gap-1">
              <div className="flex flex-col gap-0.5">
                <Label className="text-xs">From</Label>
                <Input value={range?.from ? format(range.from, format2) : ""} readOnly className="h-7 text-xs" />
              </div>
              <div className="flex flex-col gap-0.5">
                <Label className="text-xs">To</Label>
                <Input value={range?.to ? format(range.to, format2) : ""} readOnly className="h-7 text-xs" />
              </div>
            </div>
            <div className="flex justify-end gap-1">
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => handleSelect(undefined)}>
                Clear
              </Button>
              <Button size="sm" className="h-7 text-xs" onClick={handleSave}>
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRangePicker;
