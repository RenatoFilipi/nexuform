"use client";

import WipUI from "@/components/shared/utils/wip-ui";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import usePlatformStore from "@/stores/platform";
import useUserStore from "@/stores/user";
import { EForm, EOrganization, EProfile, ESubscription, ETeamMemberProfile } from "@/utils/entities";
import { formatDateRelativeToNow } from "@/utils/functions";
import { useQuery } from "@tanstack/react-query";
import { LayersIcon, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface IProps {
  locale: string;
  email: string;
  profile: EProfile;
  organization: EOrganization;
  subscription: ESubscription;
  teamMemberProfile: ETeamMemberProfile;
  forms: EForm[];
}

const FormsWrapper = (props: IProps) => {
  const t = useTranslations("app");
  const pf = usePlatformStore();
  const user = useUserStore();
  const pathname = usePathname();
  const orgId = pathname.split("/")[3];
  const newFormPath = `/dashboard/organizations/${orgId}/forms/new`;

  const query = useQuery({
    queryKey: ["forms-page"],
    queryFn: () => {
      user.setLocale(props.locale);
      user.setEmail(props.email);
      user.setProfile(props.profile);
      pf.setOrganizations([props.organization]);
      pf.setSubscriptions([props.subscription]);
      pf.setForms(props.forms);
      return null;
    },
  });

  const hasForms = pf.forms.length > 0;
  if (query.isPending) return null;

  return (
    <div className="flex flex-col gap-6 sm:gap-10">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">{t("label_forms")}</h1>
        <Button size="sm" variant="secondary" asChild>
          <Link href={newFormPath}>
            <PlusIcon className="w-4 h-4 mr-2" />
            {t("label_create_form")}
          </Link>
        </Button>
      </div>
      {hasForms && (
        <div className="overflow-y-auto grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {pf.forms.map((f) => {
            return <FormCard key={f.id} form={f} />;
          })}
        </div>
      )}
      {!hasForms && (
        <Card className="flex justify-center items-center flex-col gap-6 py-20">
          <div className="flex justify-center items-center p-3 bg-primary/10 rounded">
            <LayersIcon className="w-6 h-6 text-primary" />
          </div>
          <div className="flex justify-center items-center flex-col">
            <span className="text-lg font-semibold">{t("label_no_forms")}</span>
            <span className="text-sm text-center text-muted-foreground">{t("desc_no_forms")}</span>
          </div>
        </Card>
      )}
    </div>
  );
};

const FormCard = ({ form }: { form: EForm }) => {
  const t = useTranslations("app");
  const user = useUserStore();
  const pathname = usePathname();
  const orgId = pathname.split("/")[3];
  const editorPath = `/dashboard/organizations/${orgId}/form/${form.public_id}/editor`;

  return (
    <Card className="flex flex-col h-44 p-5 justify-between border hover:border-primary/50 transition-colors duration-200 group hover:shadow-sm">
      <div>
        <Link href={editorPath}>{form.name}</Link>
      </div>
      <div>
        <span className="text-xs text-muted-foreground">
          {t("label_last_updated")} {formatDateRelativeToNow(form.updated_at, user.locale)}
        </span>
      </div>
    </Card>
  );
};
export default FormsWrapper;
