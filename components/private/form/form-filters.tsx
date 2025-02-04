"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ConstructionIcon } from "lucide-react";

const FormFilters = ({ children }: { children: React.ReactNode }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="mr-12">
        <Body />
      </PopoverContent>
    </Popover>
  );
};

const Body = () => {
  return (
    <div className="px-4 py-8 flex justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-3">
        <ConstructionIcon />
        <span className="text-sm text-foreground/80">Under Development</span>
      </div>
    </div>
  );
};

export default FormFilters;
