"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import useEditorStore from "@/stores/editor";
import { minWidth640 } from "@/utils/constants";
import { TFormStatus, TSetState } from "@/utils/types";
import { AlertTriangleIcon, GlobeIcon, ShieldAlertIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useMedia } from "react-use";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "../../ui/drawer";
import FormStatus from "../form/form-status";
import FormDelete from "../shared/form/form-delete";

const EditorFormSettings = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("app");
  const isDesktop = useMedia(minWidth640);
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="flex flex-col min-w-[650px] h-[90%] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium">{t("label_settings")}</DialogTitle>
            <DialogDescription>{t("desc_settings")}</DialogDescription>
          </DialogHeader>
          <Body setState={setOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3 flex flex-col max-h-[90%] h-full">
        <DrawerHeader>
          <DrawerTitle className="text-xl font-medium">{t("label_settings")}</DrawerTitle>
          <DrawerDescription>{t("desc_settings")}.</DrawerDescription>
        </DrawerHeader>
        <Body setState={setOpen} />
      </DrawerContent>
    </Drawer>
  );
};

type TView = "general" | "status" | "delete";

const Body = ({ setState }: { setState: TSetState<boolean> }) => {
  const t = useTranslations("app");
  const views = [
    { label: t("nav_status"), icon: GlobeIcon, view: "status", enabled: true },
    { label: t("nav_delete"), icon: ShieldAlertIcon, view: "delete", enabled: true },
  ];

  const [view, setView] = useState<TView>("status");
  const enabledViews = views.filter((x) => x.enabled);

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto pt-4 sm:pt-0">
      <div className="flex flex-col gap-4 overflow-y-auto h-full">
        <div className="flex sm:w-fit sm:gap-2 gap-1">
          {enabledViews.map((v) => {
            return (
              <button
                key={v.view}
                onClick={() => setView(v.view as TView)}
                className={`${
                  v.view === view
                    ? "border-foreground/30 text-foreground/100 font-medium"
                    : "border-transparent text-foreground/70"
                } border p-2 flex items-center justify-center gap-2 text-sm hover:bg-foreground/5 rounded flex-1`}>
                <v.icon className={`${v.view === view ? "text-primary" : "text-foreground/70"} w-4 h-4`} />
                {v.label}
              </button>
            );
          })}
        </div>
        <div className="flex w-full overflow-y-auto flex-1 h-full">
          {view === "status" && <StatusSettings />}
          {view === "delete" && <DeleteSettings />}
        </div>
      </div>
      <div className="flex justify-end items-center gap-2 flex-col sm:flex-row">
        <Button onClick={() => setState(false)} variant={"outline"} size={"sm"} className="w-full sm:w-fit">
          {t("label_close")}
        </Button>
      </div>
    </div>
  );
};
const StatusSettings = () => {
  const t = useTranslations("app");
  const { form, setForm } = useEditorStore();

  const onSetStatus = (value: string) => {
    setForm({ ...form, status: value });
  };

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="space-y-1 hidden">
        <Label className="text-sm font-medium">{t("label_status")}</Label>
        <p className="text-xs text-muted-foreground">{t("desc_status")}</p>
      </div>
      <FormStatus status={form.status as TFormStatus} onStatusChange={onSetStatus} />
    </div>
  );
};
const DeleteSettings = () => {
  const t = useTranslations("app");
  const { form } = useEditorStore();

  return (
    <div className="flex justify-center items-center w-full border rounded p-8">
      <div className="flex flex-col justify-center items-center gap-4">
        <Badge variant="destructive" className="px-3 py-1 font-medium uppercase tracking-wider flex items-center gap-2">
          <AlertTriangleIcon className="h-3.5 w-3.5" />
          {t("label_danger_zone")}
        </Badge>
        <div className="flex flex-col justify-center items-center gap-6">
          <span className="text-sm text-center font-medium">{t("desc_danger_zone")}</span>
          <FormDelete formId={form.id} formName={form.name}>
            <Button variant={"destructive"} size={"sm"} className="w-full sm:w-fit">
              {t("label_continue")}
            </Button>
          </FormDelete>
        </div>
      </div>
    </div>
  );
};
export default EditorFormSettings;
