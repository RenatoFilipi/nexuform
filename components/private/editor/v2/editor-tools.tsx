"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import useEditorStore from "@/stores/editor";
import useUserStore from "@/stores/user";
import { useTranslations } from "next-intl";
import { useState } from "react";
import WipUI from "../../shared/wip-ui";

type TView = "properties" | "styles" | "reorder" | "block";

const EditorTools = () => {
  const views = [
    { label: "Properties", view: "properties", enabled: true },
    { label: "Styles", view: "styles", enabled: true },
    { label: "Reorder", view: "reorder", enabled: false },
  ];
  const enabledViews = views.filter((x) => x.enabled);
  const [view, setView] = useState<TView>("properties");

  return (
    <div className="hidden sm:flex border-l sm:w-[400px] absolute h-full flex-1 right-0 flex-col">
      <div className="h-12 absolute w-full border-b flex">
        {enabledViews.map((v) => {
          return (
            <button
              onClick={() => setView(v.view as TView)}
              key={v.view}
              className={`${
                v.view === view ? "font-medium text-foreground" : "text-foreground/60"
              } text-sm flex justify-center items-center px-4 hover:bg-foreground/5 relative rounded gap-2 h-full`}>
              <div className="truncate">{v.label}</div>
              {v.view === view && <div className="bg-primary bottom-0 w-full h-0.5 absolute"></div>}
            </button>
          );
        })}
      </div>
      <div className="mt-12 flex flex-1 overflow-y-auto">
        {view === "properties" && <ToolProperties />}
        {view === "styles" && <ToolStyles />}
        {view === "reorder" && <ToolReorder />}
      </div>
    </div>
  );
};
const ToolProperties = () => {
  const t = useTranslations("app");
  const { form, setForm } = useEditorStore();
  const user = useUserStore();

  const onSetName = (value: string) => {
    setForm({ ...form, name: value });
  };
  const onSetDescription = (value: string) => {
    setForm({ ...form, description: value });
  };
  const onSetSubmitText = (value: string) => {
    setForm({ ...form, submit_text: value });
  };
  const onSetSuccessTitle = (value: string) => {
    setForm({ ...form, success_title: value });
  };
  const onSetSuccessDescription = (value: string) => {
    setForm({ ...form, success_description: value });
  };
  const onSetNebulaformBranding = (value: boolean) => {
    if (user.subscription.plan !== "pro") return;
    setForm({ ...form, nebulaform_branding: value });
  };

  return (
    <div className="flex justify-start items-center w-full h-full flex-col px-5 py-8 gap-8 overflow-y-auto">
      <div className="grid gap-3 w-full">
        <div className="grid gap-1">
          <Label className="">{t("label_form_name")}</Label>
          <p className="text-xs text-foreground/60 hidden">{t("desc_form_name")}</p>
        </div>
        <Input
          type="text"
          placeholder={t("placeholder_form_name")}
          value={form.name}
          onChange={(e) => onSetName(e.target.value)}
        />
      </div>
      <div className="grid gap-3 w-full">
        <div className="grid gap-1">
          <Label>
            {t("label_form_desc")} ({t("label_optional")})
          </Label>
          <p className="text-xs text-foreground/60 hidden">{t("desc_form_desc")}</p>
        </div>
        <Textarea
          placeholder={t("placeholder_form_desc")}
          value={form.description ?? ""}
          onChange={(e) => onSetDescription(e.target.value)}
        />
      </div>
      <div className="grid gap-3 w-full">
        <div className="grid gap-1">
          <Label>{t("label_submit_text")}</Label>
          <p className="text-xs text-foreground/60 hidden">{t("desc_submit_text")}</p>
        </div>
        <Input type="text" value={form.submit_text} onChange={(e) => onSetSubmitText(e.target.value)} />
      </div>
      <div className="grid gap-3 w-full">
        <div className="grid gap-1">
          <Label>{t("label_success_title")}</Label>
          <p className="text-xs text-foreground/60 hidden">{t("desc_success_title")}</p>
        </div>
        <Input type="text" value={form.success_title} onChange={(e) => onSetSuccessTitle(e.target.value)} />
      </div>
      <div className="grid gap-3 w-full">
        <div className="grid gap-1">
          <Label>{t("label_success_desc")}</Label>
          <p className="text-xs text-foreground/60 hidden">{t("desc_success_desc")}</p>
        </div>
        <Textarea value={form.success_description} onChange={(e) => onSetSuccessDescription(e.target.value)} />
      </div>
      <div className="flex justify-between items-center w-full">
        <div className="flex justify-center items-center gap-2">
          <div className="grid gap-1">
            <div className="flex justify-start items-center gap-2">
              <Label>{t("label_nebula_branding")}</Label>
              {user.subscription.plan !== "pro" && <Badge variant={"pink"}>Pro</Badge>}
            </div>
            <span className="text-xs text-foreground/60 hidden">{t("desc_nebula_branding")}</span>
          </div>
        </div>
        <Switch checked={form.nebulaform_branding} onCheckedChange={onSetNebulaformBranding} />
      </div>
    </div>
  );
};
const ToolStyles = () => {
  const t = useTranslations("app");
  const { theme, setTheme } = useEditorStore();
  const user = useUserStore();

  const onSetNumericBlocks = (value: boolean) => {
    setTheme({ ...theme, numeric_blocks: value });
  };
  const onSetUppercaseBlockName = (value: boolean) => {
    setTheme({ ...theme, uppercase_block_name: value });
  };
  const onSetWidth = (value: string) => {
    setTheme({ ...theme, width: value });
  };

  return (
    <div className="flex justify-start items-center w-full h-full flex-col px-5 py-8 gap-8 overflow-y-auto">
      <div className="flex justify-between items-center w-full">
        <div className="grid gap-1">
          <Label>{t("label_numeric_blocks")}</Label>
          <p className="text-xs text-foreground/60 hidden">{t("desc_numeric_blocks")}</p>
        </div>
        <Switch checked={theme.numeric_blocks} onCheckedChange={onSetNumericBlocks} />
      </div>
      <div className="flex justify-between items-center w-full">
        <div className="grid gap-1">
          <Label>{t("label_uppercase_block")}</Label>
          <p className="text-xs text-foreground/60 hidden">{t("desc_uppercase_block")}.</p>
        </div>
        <Switch checked={theme.uppercase_block_name} onCheckedChange={onSetUppercaseBlockName} />
      </div>
      <div className="flex justify-between items-start w-full sm:gap-4 flex-col">
        <div className="grid gap-1">
          <Label>{t("label_form_width")}</Label>
          <p className="text-xs text-foreground/60 hidden">{t("desc_form_width")}</p>
        </div>
        <Select onValueChange={onSetWidth} defaultValue={theme.width}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="centered">{t("label_centered")}</SelectItem>
            <SelectItem value="full">{t("label_full_width")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
const ToolReorder = () => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <WipUI context="reorder" />
    </div>
  );
};

export default EditorTools;
