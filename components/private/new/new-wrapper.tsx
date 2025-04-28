"use client";

import { createFormAction } from "@/app/actions/form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useDashboardStore from "@/stores/dashboard";
import useUserStore from "@/stores/user";
import { minute } from "@/utils/constants";
import { EForm, EProfile, ESubscription, ETemplate } from "@/utils/entities";
import { getFormCategoryName } from "@/utils/functions";
import { createClient } from "@/utils/supabase/client";
import { TSetState, TTemplateCategory } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRightIcon,
  BookDashedIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HexagonIcon,
  LoaderIcon,
  PlusIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import ManageSubscription from "../shared/subscription/manage-subscription";
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
  const [isPending, startTransition] = useTransition();

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
  });
  useQuery({
    queryKey: [error],
    queryFn: () => {
      if (error !== null) {
        toast.error(error);
      }
      return null;
    },
  });
  const onNewScratchForm = async () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", t("label_untitled_form"));
      formData.append("description", "");
      formData.append("userId", user.profile.id);
      await createFormAction(formData);
    });
  };
  if (query.isPending) return null;

  return (
    <div className="flex-1 mt-12 mb-12 sm:mb-0 flex flex-col gap-6 sm:gap-10 px-3 sm:px-20 lg:px-52 py-4 sm:py-8">
      {view === "none" && (
        <div className="flex flex-col gap-6 sm:gap-10">
          <div className="grid gap-1">
            <span className="font-semibold text-lg">{t("label_create_form")}</span>
            <p className="text-xs text-muted-foreground">{t("desc_create_form")}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-8">
            <CardNew
              icon={
                <div className="p-3 rounded bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                  <PlusIcon className="w-7 h-7 text-blue-500" />
                </div>
              }
              description={t("desc_custom")}
              action={
                <Button
                  disabled={isPending}
                  variant={"outline"}
                  size={"sm"}
                  onClick={onNewScratchForm}
                  className="mt-2 group-hover:border-primary group-hover:text-primary">
                  {isPending && <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />}
                  {t("label_create_form_scratch")}
                </Button>
              }
            />
            <CardNew
              icon={
                <div className="p-3 rounded bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
                  <HexagonIcon className="w-7 h-7 text-orange-500" />
                </div>
              }
              description={t("desc_templates")}
              action={
                <Button
                  variant={"outline"}
                  size={"sm"}
                  onClick={() => setView("templates")}
                  className="mt-2 group-hover:border-primary group-hover:text-primary">
                  {t("label_create_form_template")}
                  <ChevronRightIcon className="w-4 h-4 ml-2" />
                </Button>
              }
            />
          </div>
        </div>
      )}
      {view === "templates" && <TemplateList setView={setView} />}
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
        <Button variant={"ghost"} size={"icon"} className="" onClick={() => setView("none")}>
          <ChevronLeftIcon />
        </Button>
        <div className="grid gap-1">
          <span className="font-semibold text-lg">{t("label_templates")}</span>
          <p className="text-xs text-muted-foreground">{t("desc_templates")}</p>
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
              return <Preview key={template.id} template={template} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
};
const Preview = (props: { template: ETemplate }) => {
  const user = useUserStore();
  const t = useTranslations("app");
  const { category, name } = props.template;

  const query = useQuery({
    queryKey: ["previewCardData", category],
    queryFn: async () => {
      const value = await getFormCategoryName(category as TTemplateCategory, user.locale);
      return { category: value };
    },
    staleTime: 60 * minute,
  });

  if (query.isPending) return null;

  return (
    <div className="group relative flex flex-col justify-between p-5 h-44 rounded-lg bg-card border border-muted/50 hover:border-primary transition-all duration-200 overflow-hidden">
      <div className="flex flex-col gap-3 w-full">
        <h3 className="text-sm font-medium line-clamp-2 text-foreground group-hover:text-primary transition-colors duration-200">
          {name}
        </h3>
        <div className="flex justify-between items-center">
          <Badge variant="default">
            <span className="first-letter:uppercase">{query.data?.category}</span>
          </Badge>
        </div>
      </div>
      <div className="flex justify-between items-end w-full">
        <NewPreview template={props.template}>
          <Button variant="outline" size="sm" className="">
            <BookDashedIcon className="w-4 h-4 mr-2" />
            {t("label_preview")}
          </Button>
        </NewPreview>
      </div>
    </div>
  );
};
const CardNew = ({
  action,
  description,
  icon,
}: {
  icon: React.ReactNode;
  description: string;
  action: React.ReactNode;
}) => {
  const t = useTranslations("app");
  const user = useUserStore();
  const dashboard = useDashboardStore();
  const limitReached = dashboard.forms.length >= user.subscription.forms;

  return (
    <div className="flex justify-center items-center w-full border h-60 gap-4 flex-col p-6 rounded-lg bg-background hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md group">
      {icon}
      <p className="text-sm text-center group-hover:text-foreground text-muted-foreground">{description}</p>
      {limitReached && (
        <ManageSubscription>
          <Button variant={"outline"} size={"sm"} className="mt-2 group-hover:border-primary group-hover:text-primary">
            {t("label_manage_sub")}
            <ArrowUpRightIcon className="w-4 h-4 ml-2" />
          </Button>
        </ManageSubscription>
      )}
      {!limitReached && action}
    </div>
  );
};

export default NewWrapper;
