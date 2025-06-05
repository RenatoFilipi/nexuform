"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useGlobalStore from "@/stores/global";
import useUserStore from "@/stores/user";
import { EForm, EProfile, ESubscription } from "@/utils/entities";
import { useQuery } from "@tanstack/react-query";
import { LayersIcon, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useMemo, useState } from "react";
import DashboardFormCard from "./dashboard-form-card";

interface IProps {
  forms: EForm[];
  profile: EProfile;
  subscription: ESubscription;
  email: string;
  locale: string;
}

const DashboardWrapper = ({ forms, profile, subscription, email, locale }: IProps) => {
  const t = useTranslations("app");
  const [searchValue, setSearchValue] = useState("");

  const user = useUserStore();
  const global = useGlobalStore();

  const query = useQuery({
    queryKey: ["dashboardData"],
    queryFn: () => {
      user.setFormsCount(forms.length);
      user.setProfile(profile);
      user.setSubscription(subscription);
      user.setEmail(email);
      user.setLocale(locale);
      global.setForms(forms);
      global.resetDateControls();
      return null;
    },
  });

  const filteredForms = useMemo(() => {
    let result = [...global.forms];
    if (searchValue) {
      const searchTerm = searchValue.toLowerCase();
      result = result.filter(
        (form) => form.name.toLowerCase().includes(searchTerm) || form.description?.toLowerCase().includes(searchTerm)
      );
    }
    return result;
  }, [global.forms, searchValue]);

  const isEmpty = global.forms.length === 0;
  const isFilteredEmpty = filteredForms.length === 0 && searchValue !== "";
  const hasForms = !isEmpty && !isFilteredEmpty;

  if (query.isPending) return null;

  return (
    <div className="flex-1 mt-14 mb-14 sm:mb-0 flex flex-col gap-6 sm:gap-10 px-3 sm:px-20 lg:px-64 py-4 sm:py-8">
      <div className="flex justify-between items-center flex-col sm:flex-row gap-3">
        <div className="flex justify-between items-center w-full sm:w-fit">
          <h1 className="text-xl font-medium">{t("label_forms")}</h1>
          <div className="flex sm:hidden">
            <NewFormButton />
          </div>
        </div>
        <div className="flex justify-center items-center gap-4 flex-col sm:flex-row w-full sm:w-fit">
          <div className="gap-4 w-full hidden">
            <Input
              type="search"
              placeholder={t("label_search_forms")}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="sm:w-[250px]"
            />
          </div>
          <div className="hidden sm:flex">
            <NewFormButton />
          </div>
        </div>
      </div>
      {isFilteredEmpty && <FilteredEmptyUI />}
      {isEmpty && <EmptyUI />}
      {hasForms && (
        <div className="overflow-y-auto grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
          {filteredForms.map((form) => (
            <DashboardFormCard key={form.id} form={form} />
          ))}
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
      <div className="flex flex-col justify-center items-center gap-6 pb-20">
        <div className="flex flex-col justify-center items-center gap-4">
          <div className="flex justify-center items-center p-3 bg-primary/10 rounded">
            <LayersIcon className="w-6 h-6 text-primary" />
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
    <Button size="sm" variant="secondary" asChild>
      <Link href="/dashboard/forms/new">
        <PlusIcon className="w-4 h-4 mr-2" />
        {t("label_create_form")}
      </Link>
    </Button>
  );
};

export default DashboardWrapper;
