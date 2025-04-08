"use client";

import { createFormAction } from "@/app/actions/form";
import { Button } from "@/components/ui/button";
import useDashboardStore from "@/stores/dashboard";
import useUserStore from "@/stores/user";
import { LoaderIcon, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";

const NewCustom = () => {
  const t = useTranslations("app");
  const [isPending, startTransition] = useTransition();
  const dashboard = useDashboardStore();
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
    <div className="flex flex-col gap-8">
      <div className="grid gap-1">
        <span className="font-semibold">{t("label_custom")}</span>
        <p className="text-xs text-foreground/70">{t("desc_custom")}</p>
      </div>
      <div className="flex justify-center items-center w-full border h-36 gap-4 flex-col">
        <PlusIcon className="w-7 h-7 text-primary" />
        <Button disabled={isPending} variant={"outline"} size={"sm"} onClick={onNewForm}>
          {isPending && <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />}
          {t("label_create_form_scratch")}
        </Button>
      </div>
    </div>
  );
};

export default NewCustom;
