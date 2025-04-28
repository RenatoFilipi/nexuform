"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useDashboardStore from "@/stores/dashboard";
import useUserStore from "@/stores/user";
import { EForm, EProfile, ESubscription } from "@/utils/entities";
import { useQuery } from "@tanstack/react-query";
import { LayersIcon, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useQueryState } from "nuqs";
import { useMemo, useState } from "react";
import DashboardFormCard from "./dashboard-form-card";

interface IProps {
  forms: EForm[];
  profile: EProfile;
  subscription: ESubscription;
  email: string;
  locale: string;
}

const DashboardWrapper = (props: IProps) => {
  const t = useTranslations("app");
  const [sortBy, setSortBy] = useQueryState("sort-by");
  const [value, setValue] = useState("");
  const user = useUserStore();
  const dashboard = useDashboardStore();
  const filteredForms = useMemo(() => {
    let result = [...dashboard.forms];
    if (value) {
      const searchTerm = value.toLowerCase();
      result = result.filter(
        (form) => form.name.toLowerCase().includes(searchTerm) || form.description?.toLowerCase().includes(searchTerm)
      );
    }
    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "date") {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [dashboard.forms, value, sortBy]);
  const empty = dashboard.forms.length <= 0 && value === "";
  const filteredEmpty = filteredForms.length <= 0 && value !== "";

  const query = useQuery({
    queryKey: ["dashboardData"],
    queryFn: () => {
      user.setFormsCount(props.forms.length);
      user.setProfile(props.profile);
      user.setSubscription(props.subscription);
      user.setEmail(props.email);
      user.setLocale(props.locale);
      dashboard.setForms(props.forms);
      return null;
    },
  });

  const onSort = (value: string) => {
    setSortBy(value);
  };

  if (query.isPending) return null;

  return (
    <div className="flex-1 mt-12 mb-12 sm:mb-0 flex flex-col gap-6 sm:gap-10 px-3 sm:px-20 lg:px-52 py-4 sm:py-8">
      <div className="flex justify-between items-center flex-col sm:flex-row gap-3">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-xl font-medium">{t("label_forms")}</h1>
          <div className="flex sm:hidden">
            <NewFormButton />
          </div>
        </div>
        <div className="flex justify-center items-center gap-4 flex-col sm:flex-row w-full">
          <div className="flex gap-4 w-full">
            <Input
              type="search"
              placeholder={t("label_search_forms")}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <Select defaultValue={sortBy ?? ""} onValueChange={onSort}>
              <SelectTrigger>
                <SelectValue placeholder={t("label_sortby")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">{t("label_sortby_name")}</SelectItem>
                <SelectItem value="date">{t("label_sortby_date")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="hidden sm:flex">
            <NewFormButton />
          </div>
        </div>
      </div>
      {filteredEmpty && <FilteredEmptyUI />}
      {empty && <EmptyUI />}
      {!empty && (
        <div className="overflow-y-auto grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredForms.map((form) => {
            return <DashboardFormCard key={form.id} form={form} />;
          })}
        </div>
      )}
    </div>
  );
};
const FilteredEmptyUI = () => {
  const t = useTranslations("app");
  return (
    <div className="flex h-full flex-1 justify-center items-center">
      <span className="text-sm text-muted-foreground">{t("label_no_form_search")}</span>
    </div>
  );
};
const EmptyUI = () => {
  const t = useTranslations("app");
  return (
    <div className="flex justify-center items-center h-full flex-1 flex-col gap-4">
      <div className="border pb-20 flex flex-col justify-center items-center gap-6 border-none">
        <div className="flex flex-col justify-center items-center gap-4">
          <div className="flex justify-center items-center p-3 bg-foreground/5 rounded">
            <LayersIcon className="w-7 h-7 text-primary" />
          </div>
          <div className="flex justify-center items-center flex-col">
            <span className="text-lg font-medium">{t("label_no_forms")}</span>
            <span className="text-sm text-center text-muted-foreground">{t("desc_no_forms")}</span>
          </div>
          <div className="flex w-full justify-center items-center mt-2">
            <NewFormButton />
          </div>
        </div>
      </div>
    </div>
  );
};
const NewFormButton = () => {
  const t = useTranslations("app");
  return (
    <Button size={"sm"} variant={"secondary"} asChild>
      <Link href={"/dashboard/forms/new"}>
        <PlusIcon className="w-4 h-4 mr-2" />
        {t("label_create_form")}
      </Link>
    </Button>
  );
};

export default DashboardWrapper;
