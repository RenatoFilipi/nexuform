"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const ModeToggle2 = () => {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const themes = [
    { value: "system", icon: MonitorIcon },
    { value: "light", icon: SunIcon },
    { value: "dark", icon: MoonIcon },
  ];

  return (
    <RadioGroup value={theme} onValueChange={setTheme} className="flex gap-1">
      {themes.map((t) => {
        return (
          <div key={t.value}>
            <RadioGroupItem value={t.value} id={t.value} className="peer sr-only" />
            <Label
              htmlFor={t.value}
              className={`${
                theme === t.value ? "bg-card" : "bg-transparent"
              } p-2 flex justify-center items-center rounded-md cursor-pointer hover:bg-card`}>
              <t.icon className="w-3.5 h-3.5" />
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  );
};

export default ModeToggle2;
