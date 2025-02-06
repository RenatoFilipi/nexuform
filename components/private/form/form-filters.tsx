"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDateRange } from "@/utils/functions";
import { IFormFilters } from "@/utils/interfaces";
import { TFilterSort, TFormStatusExtended } from "@/utils/types";
import { useState } from "react";

const FormFilters = ({ children }: { children: React.ReactNode }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="sm:mr-12 w-96">
        <Body />
      </PopoverContent>
    </Popover>
  );
};

const Body = () => {
  const [date, setDate] = useState("1");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("descending");

  const onApplyFilters = () => {
    const updatedStatus = status as TFormStatusExtended;
    const updatedSort = sort as TFilterSort;
    const { from, to } = getDateRange(Number(date));

    const updatedFilters: IFormFilters = {
      status: updatedStatus,
      sort: updatedSort,
      from,
      to,
    };

    console.log(updatedFilters);
  };
  const onClearFilters = () => {
    setDate("1");
    setStatus("all");
    setSort("descending");
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <span>Filters</span>
      </div>
      <div className="flex flex-col gap-6 w-full justify-between">
        <div className="grid gap-1 w-full">
          <span className="text-sm">Date</span>
          <Select value={date} onValueChange={setDate}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">24 hours</SelectItem>
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1 w-full">
          <span className="text-sm">Status</span>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="not_reviewed">Not Reviewed</SelectItem>
              <SelectItem value="ignored">Ignored</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1 w-full">
          <span className="text-sm">Sort</span>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="descending">Descending</SelectItem>
              <SelectItem value="ascending">Ascending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <Button variant={"outline"} size={"sm"} onClick={onClearFilters}>
          Clear
        </Button>
        <Button variant={"secondary"} size={"sm"} onClick={onApplyFilters}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default FormFilters;
