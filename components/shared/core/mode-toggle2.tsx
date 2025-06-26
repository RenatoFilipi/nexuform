"use client";

import { useQuery } from "@tanstack/react-query";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Label } from "../../ui/label";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";

const ModeToggle2 = () => {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useQuery({
    queryKey: [],
    queryFn: () => {
      setMounted(true);
      return null;
    },
  });

  if (!mounted) return null;

  return (
    <RadioGroup value={theme} onValueChange={setTheme} className="flex gap-1">
      <div>
        <RadioGroupItem value="system" id="system" className="peer sr-only" />
        <Label
          htmlFor="system"
          className="text-xs cursor-pointer flex items-center justify-start gap-2 rounded-md border-1 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:bg-foreground/10">
          <MonitorIcon className="w-3.5 h-3.5" />
        </Label>
      </div>
      <div>
        <RadioGroupItem value="light" id="light" className="peer sr-only" />
        <Label
          htmlFor="light"
          className="text-xs cursor-pointer flex items-center justify-start gap-2 rounded-md border-1 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:bg-foreground/10">
          <SunIcon className="w-3.5 h-3.5" />
        </Label>
      </div>
      <div>
        <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
        <Label
          htmlFor="dark"
          className="text-xs cursor-pointer flex items-center justify-start gap-2 rounded-md border-1 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:bg-foreground/10">
          <MoonIcon className="w-3.5 h-3.5" />
        </Label>
      </div>
    </RadioGroup>
  );
};

export default ModeToggle2;
