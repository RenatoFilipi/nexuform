"use client";

import { createFormAction } from "@/app/actions/form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useAppStore from "@/stores/app";
import useUserStore from "@/stores/user";
import { minute } from "@/utils/constants";
import { EForm, EOrganization, EProfile, ESubscription, ETeamMemberProfile, ETemplate } from "@/utils/entities";
import { getFormCategoryName } from "@/utils/functions";
import { createClient } from "@/utils/supabase/client";
import { TSetState, TTemplateCategory } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRightIcon, ChevronLeftIcon, ChevronRightIcon, HexagonIcon, LoaderIcon, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import ManageSubscription from "../../shared/subscription/manage-subscription";
import NewPreview from "./new-preview";

type TView = "method:list" | "method:scratch" | "method:templates";

interface IProps {
  locale: string;
  email: string;
  profile: EProfile;
  organization: EOrganization;
  subscription: ESubscription;
  teamMemberProfile: ETeamMemberProfile;
  forms: EForm[];
}
const NewWrapper = (props: IProps) => {
  const t = useTranslations("app");
  const pathname = usePathname();
  const orgId = pathname.split("/")[3];
  const app = useAppStore();
  const user = useUserStore();
  const [view, setView] = useState<TView>("method:list");
  const [isPending, startTransition] = useTransition();
  const returnPath = `/dashboard/organizations/${orgId}/forms`;

  const query = useQuery({
    queryKey: ["new-form-page"],
    queryFn: () => {
      user.setLocale(props.locale);
      user.setEmail(props.email);
      user.setProfile(props.profile);
      app.setOrganization(props.organization);
      app.setSubscription(props.subscription);
      app.setTeamMemberProfile(props.teamMemberProfile);
      app.setForms(props.forms);
      return null;
    },
  });

  const onNewScratchForm = async () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", t("label_untitled_form"));
      formData.append("description", "");
      formData.append("userId", app.teamMemberProfile.id);
      formData.append("orgId", app.organization.id);
      formData.append("orgPublicId", app.organization.public_id);
      await createFormAction(formData);
    });
  };

  if (query.isPending) return null;

  if (view === "method:list")
    return (
      <div className="flex flex-col gap-6 sm:gap-10">
        <div className="flex justify-start items-center gap-2">
          <Button variant={"ghost"} size={"icon"} asChild>
            <Link href={returnPath} className="flex justify-center items-center">
              <ChevronLeftIcon />
            </Link>
          </Button>
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-xl">{t("label_create_form")}</span>
            <p className="text-sm text-muted-foreground">{t("desc_create_form")}</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-8">
          <MethodCard
            icon={
              <div className="p-3 rounded bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                <PlusIcon className="w-6 h-6 text-blue-500" />
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
          <MethodCard
            icon={
              <div className="p-3 rounded bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
                <HexagonIcon className="w-6 h-6 text-orange-500" />
              </div>
            }
            description={t("desc_templates")}
            action={
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={() => setView("method:templates")}
                className="mt-2 group-hover:border-primary group-hover:text-primary">
                {t("label_create_form_template")}
                <ChevronRightIcon className="w-4 h-4 ml-2" />
                {/* {t("label_soon")} */}
                {/* <RocketIcon className="w-4 h-4 ml-2" /> */}
              </Button>
            }
          />
        </div>
      </div>
    );
  return <TemplateList setView={setView} />;
};
interface IMethodProps {
  icon: React.ReactNode;
  description: string;
  action: React.ReactNode;
}
const MethodCard = (props: IMethodProps) => {
  const t = useTranslations("app");
  const app = useAppStore();
  const limitReached = app.forms.length >= app.subscription.forms;

  return (
    <Card className="flex justify-center items-center w-full border h-60 gap-4 flex-col p-6 rounded-lg hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md group">
      {props.icon}
      <p className="text-sm text-center group-hover:text-foreground text-muted-foreground">{props.description}</p>
      {limitReached && (
        <ManageSubscription>
          <Button variant={"outline"} size={"sm"} className="mt-2 group-hover:border-primary group-hover:text-primary">
            {t("label_manage_sub")}
            <ArrowUpRightIcon className="w-4 h-4 ml-2" />
          </Button>
        </ManageSubscription>
      )}
      {!limitReached && props.action}
    </Card>
  );
};
const TemplateList = ({ setView }: { setView: TSetState<TView> }) => {
  const t = useTranslations("app");
  const user = useUserStore();
  const supabase = createClient();

  const query = useQuery({
    queryKey: ["templatesListData"],
    queryFn: async () => {
      const { data, error } = await supabase.from("templates").select("*").eq("is_public", true);
      console.log(data);
      if (error) throw error;
      const { locale } = user;
      const templatesWithLocalizedNames = data.map((template) => {
        const localizedName =
          locale === "pt" && template.name_pt
            ? template.name_pt
            : locale === "es" && template.name_es
            ? template.name_es
            : template.name;

        const localizedDescription =
          locale === "pt" && template.description_pt
            ? template.description_pt
            : locale === "es" && template.description_es
            ? template.description_es
            : template.description;

        return {
          ...template,
          name: localizedName,
          description: localizedDescription,
        };
      });
      return { templates: templatesWithLocalizedNames };
    },
    staleTime: 60 * minute,
  });

  return (
    <div className="flex flex-col gap-6 sm:gap-10 flex-1 min-h-full">
      <div className="flex flex-col gap-4">
        <div className="flex justify-start items-center gap-2">
          <Button variant={"ghost"} size={"icon"} className="" onClick={() => setView("method:list")}>
            <ChevronLeftIcon />
          </Button>
          <div className="grid gap-1">
            <span className="font-semibold text-xl">{t("label_templates")}</span>
            <p className="text-sm text-muted-foreground">{t("desc_templates")}</p>
          </div>
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
          <div className="grid sm:grid-cols-2 gap-6">
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
  const { category, name, description } = props.template;

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
    <div className="group relative flex flex-col justify-between p-5 min-h-44 rounded-lg bg-card border hover:border-primary transition-all duration-200 overflow-hidden">
      <div className="flex flex-col gap-3 w-full">
        <h3 className="text-base font-medium line-clamp-2 text-foreground group-hover:text-primary transition-colors duration-200">
          {name}
        </h3>
        <p className="text-muted-foreground text-sm group-hover:text-foreground">{description}</p>
      </div>
      <div className="flex justify-between items-center">
        <Badge variant="primary">
          <span className="first-letter:uppercase">{query.data?.category}</span>
        </Badge>
        <NewPreview template={props.template}>
          <Button variant="outline" size="sm">
            <ArrowUpRightIcon className="w-4 h-4 mr-2 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
            {t("label_preview")}
          </Button>
        </NewPreview>
      </div>
    </div>
  );
};

export default NewWrapper;
