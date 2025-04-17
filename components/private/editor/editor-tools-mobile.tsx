"use client";

import ColorPicker from "@/components/shared/utils/color-picker";
import WipUI from "@/components/shared/utils/wip-ui";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import useEditorStore from "@/stores/editor";
import useUserStore from "@/stores/user";
import { TToolView } from "@/utils/types";
import { useTranslations } from "next-intl";
import { useState } from "react";

const EditorToolsMobile = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("app");
  const editor = useEditorStore();
  const [open, setOpen] = useState(false);
  const views = [
    { label: t("label_properties"), view: "properties", enabled: true },
    { label: t("label_styles"), view: "styles", enabled: true },
  ];
  const enabledViews = views.filter((x) => x.enabled);
  const isEditingBlock = editor.toolView === "block";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-[85%] h-dvh">
        <SheetHeader className="hidden">
          <SheetTitle></SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="flex h-full">
          {isEditingBlock && <ToolBlock />}
          {!isEditingBlock && (
            <div className="flex flex-col w-full gap-6 h-full flex-1">
              <div className="h-12 w-full border-b flex justify-center">
                {enabledViews.map((v) => {
                  return (
                    <button
                      onClick={() => editor.setToolView(v.view as TToolView)}
                      key={v.view}
                      className={`${
                        v.view === editor.toolView ? "font-medium text-foreground" : "text-foreground/60"
                      } text-sm flex justify-center items-center px-4 hover:bg-foreground/5 relative rounded gap-2 h-full w-full`}>
                      <div className="truncate">{v.label}</div>
                      {v.view === editor.toolView && <div className="bg-primary bottom-0 w-full h-0.5 absolute"></div>}
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-1 overflow-y-auto h-full">
                {editor.toolView === "properties" && <ToolProperties />}
                {editor.toolView === "styles" && <ToolStyles />}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

const ToolProperties = () => {
  const t = useTranslations("app");
  const { form, setForm, view } = useEditorStore();

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

  return (
    <div className="flex justify-start items-center w-full flex-1 flex-col gap-6">
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
    </div>
  );
};
const ToolStyles = () => {
  const t = useTranslations("app");
  const { theme, setTheme, form, setForm } = useEditorStore();
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
  const onSetCustomPrimaryColor = (value: string) => {
    setTheme({ ...theme, custom_primary_color: value });
  };
  const onSetNebulaformBranding = (value: boolean) => {
    if (user.subscription.plan !== "pro") return;
    setForm({ ...form, nebulaform_branding: value });
  };

  return (
    <div className="flex justify-start items-center w-full flex-1 flex-col gap-6">
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
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 pt-0">
            <div className="flex justify-center items-center gap-3">
              {t("label_primary_color")}
              <div className="w-8 h-4 rounded-md" style={{ backgroundColor: theme.custom_primary_color }}></div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ColorPicker
              color={theme.custom_primary_color}
              onColorChange={onSetCustomPrimaryColor}
              allowCustom={false}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
const ToolBlock = () => {
  return (
    <div className="flex justify-center items-center w-full flex-1 border">
      <WipUI context="Mobile Tool block" />
    </div>
  );
};

export default EditorToolsMobile;
