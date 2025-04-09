"use client";

import { createFormAction } from "@/app/actions/form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useDashboardStore from "@/stores/dashboard";
import useUserStore from "@/stores/user";
import { minute } from "@/utils/constants";
import { EForm, EProfile, ESubscription, ETemplate } from "@/utils/entities";
import { createClient } from "@/utils/supabase/client";
import { TSetState } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeftIcon, HexagonIcon, LoaderIcon, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import NewPreview from "./new-preview";

interface IProps {
  forms: EForm[];
  profile: EProfile;
  subscription: ESubscription;
  email: string;
  locale: string;
}
type TView = "scratch" | "templates" | "none";

const NewWrapper = (props: IProps) => {
  const [view, setView] = useState<TView>("none");
  const t = useTranslations("app");
  const user = useUserStore();
  const dashboard = useDashboardStore();
  const [error] = useQueryState("error");

  const query = useQuery({
    queryKey: ["newData"],
    queryFn: () => {
      user.setLocale(props.locale);
      user.setEmail(props.email);
      user.setProfile(props.profile);
      user.setSubscription(props.subscription);
      dashboard.setForms(props.forms);
      return null;
    },
    refetchOnWindowFocus: false,
  });
  useQuery({
    queryKey: [error],
    queryFn: () => {
      if (error !== null) {
        toast.error(error);
      }
      return null;
    },
    refetchOnWindowFocus: false,
  });

  if (query.isPending) return null;

  return (
    <div className="flex-1 mt-12 mb-12 sm:mb-0 flex flex-col gap-6 sm:gap-10 px-3 sm:px-20 lg:px-52 py-4 sm:py-8">
      {view === "none" && (
        <div className="flex flex-col gap-6 sm:gap-10">
          <div className="grid gap-1">
            <span className="font-semibold">{t("label_create_form")}</span>
            <p className="text-xs text-foreground/70">{t("desc_create_form")}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-8">
            <CustomForm />
            <TemplateForm setView={setView} />
          </div>
        </div>
      )}
      {view === "templates" && <TemplateList setView={setView} />}
    </div>
  );
};
const CustomForm = () => {
  const t = useTranslations("app");
  const [isPending, startTransition] = useTransition();
  const user = useUserStore();

  const onNewForm = async () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", t("label_untitled_form"));
      formData.append("description", "");
      formData.append("userId", user.profile.id);
      await createFormAction(formData);
    });
  };

  return (
    <div className="flex justify-center items-center w-full border h-48 gap-6 flex-col p-4">
      <div className="flex flex-col justify-center items-center gap-3">
        <PlusIcon className="w-7 h-7 text-primary" />
        <p className="text-sm text-center text-foreground/70">{t("desc_custom")}</p>
      </div>
      <Button disabled={isPending} variant={"outline"} size={"sm"} onClick={onNewForm}>
        {isPending && <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />}
        {t("label_create_form_scratch")}
      </Button>
    </div>
  );
};
const TemplateForm = ({ setView }: { setView: TSetState<TView> }) => {
  const t = useTranslations("app");
  return (
    <div className="flex justify-center items-center w-full border h-48 gap-6 flex-col p-4">
      <div className="flex flex-col justify-center items-center gap-3">
        <HexagonIcon className="w-7 h-7 text-primary" />
        <p className="text-sm text-center text-foreground/70">{t("desc_templates")}</p>
      </div>
      <Button variant={"outline"} size={"sm"} onClick={() => setView("templates")}>
        {t("label_create_form_template")}
      </Button>
    </div>
  );
};
const TemplateList = ({ setView }: { setView: TSetState<TView> }) => {
  const t = useTranslations("app");
  const supabase = createClient();

  const query = useQuery({
    queryKey: ["templatesListData"],
    queryFn: async () => {
      const { data, error } = await supabase.from("templates").select("*").eq("is_public", true);
      if (error) throw error;
      return { templates: data };
    },
    staleTime: 60 * minute,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="flex flex-col gap-6 sm:gap-10 flex-1 min-h-full">
      <div className="flex justify-start items-center gap-2">
        <Button variant={"ghost"} size={"icon"} onClick={() => setView("none")}>
          <ChevronLeftIcon />
        </Button>
        <div className="grid gap-1">
          <span className="font-semibold">{t("label_templates")}</span>
          <p className="text-xs text-foreground/70">{t("desc_templates")}</p>
        </div>
      </div>
      {query.isPending && (
        <div className="flex justify-center items-center flex-1">
          <LoaderIcon className="w-7 h-7 animate-spin" />
        </div>
      )}
      {query.isError && (
        <div className="flex justify-center items-center flex-1">
          <span>{t("err_generic")}</span>
        </div>
      )}
      {!query.isPending && !query.isError && query.data && (
        <div className="flex flex-col gap-6">
          <div className="grid sm:grid-cols-3 gap-6">
            {query.data.templates.map((template) => {
              return <PreviewCard key={template.id} template={template} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
};
const PreviewCard = (props: { template: ETemplate }) => {
  const t = useTranslations("app");
  const { category, is_premium, name } = props.template;

  return (
    <div className="flex border p-3 flex-col justify-between items-start h-32">
      <div className="flex justify-between items-center w-full">
        <span className="text-sm font-medium">{name}</span>
        <div className="flex justify-center items-center gap-2">
          <Badge variant={"primary"}>
            <span className="first-letter:uppercase">{category}</span>
          </Badge>
          {is_premium && <Badge variant={"pink"}>Premium</Badge>}
        </div>
      </div>
      <div className="flex justify-start items-center w-full">
        <NewPreview template={props.template}>
          <Button variant={"outline"} size={"xs"}>
            {t("label_preview")}
          </Button>
        </NewPreview>
      </div>
    </div>
  );
};

export default NewWrapper;
