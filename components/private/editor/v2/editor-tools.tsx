"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import useEditorStore from "@/stores/editor";
import useUserStore from "@/stores/user";
import { IDesign } from "@/utils/interfaces";
import { TToolView } from "@/utils/types";
import { CheckIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { HexColorPicker } from "react-colorful";
import WipUI from "../../shared/wip-ui";

const colors: IDesign[] = [
  {
    tw_class: "bg-slate-500 hover:bg-slate-600 text-white dark:bg-slate-800 dark:hover:bg-slate-900",
    label: "slate",
  },
  {
    tw_class: "bg-gray-500 hover:bg-gray-600 text-white dark:bg-gray-800 dark:hover:bg-gray-900",
    label: "gray",
  },
  {
    tw_class: "bg-zinc-500 hover:bg-zinc-600 text-white dark:bg-zinc-800 dark:hover:bg-zinc-900",
    label: "zinc",
  },
  {
    tw_class: "bg-neutral-500 hover:bg-neutral-600 text-white dark:bg-neutral-800 dark:hover:bg-neutral-900",
    label: "neutral",
  },
  {
    tw_class: "bg-stone-500 hover:bg-stone-600 text-white dark:bg-stone-800 dark:hover:bg-stone-900",
    label: "stone",
  },
  {
    tw_class: "bg-red-500 hover:bg-red-600 text-white dark:bg-red-800 dark:hover:bg-red-900",
    label: "red",
  },
  {
    tw_class: "bg-orange-500 hover:bg-orange-600 text-white dark:bg-orange-800 dark:hover:bg-orange-900",
    label: "orange",
  },
  {
    tw_class: "bg-amber-500 hover:bg-amber-600 text-black dark:bg-amber-800 dark:hover:bg-amber-900",
    label: "amber",
  },
  {
    tw_class: "bg-yellow-500 hover:bg-yellow-600 text-black dark:bg-yellow-800 dark:hover:bg-yellow-900",
    label: "yellow",
  },
  {
    tw_class: "bg-lime-500 hover:bg-lime-600 text-black dark:bg-lime-800 dark:hover:bg-lime-900",
    label: "lime",
  },
  {
    tw_class: "bg-green-500 hover:bg-green-600 text-white dark:bg-green-800 dark:hover:bg-green-900",
    label: "green",
  },
  {
    tw_class: "bg-emerald-500 hover:bg-emerald-600 text-white dark:bg-emerald-800 dark:hover:bg-emerald-900",
    label: "emerald",
  },
  {
    tw_class: "bg-teal-500 hover:bg-teal-600 text-white dark:bg-teal-800 dark:hover:bg-teal-900",
    label: "teal",
  },
  {
    tw_class: "bg-cyan-500 hover:bg-cyan-600 text-white dark:bg-cyan-800 dark:hover:bg-cyan-900",
    label: "cyan",
  },
  {
    tw_class: "bg-sky-500 hover:bg-sky-600 text-white dark:bg-sky-800 dark:hover:bg-sky-900",
    label: "sky",
  },
  {
    tw_class: "bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-800 dark:hover:bg-blue-900",
    label: "blue",
  },
  {
    tw_class: "bg-indigo-500 hover:bg-indigo-600 text-white dark:bg-indigo-800 dark:hover:bg-indigo-900",
    label: "indigo",
  },
  {
    tw_class: "bg-violet-500 hover:bg-violet-600 text-white dark:bg-violet-800 dark:hover:bg-violet-900",
    label: "violet",
  },
  {
    tw_class: "bg-purple-500 hover:bg-purple-600 text-white dark:bg-purple-800 dark:hover:bg-purple-900",
    label: "purple",
  },
  {
    tw_class: "bg-fuchsia-500 hover:bg-fuchsia-600 text-white dark:bg-fuchsia-800 dark:hover:bg-fuchsia-900",
    label: "fuchsia",
  },
  {
    tw_class: "bg-pink-500 hover:bg-pink-600 text-white dark:bg-pink-800 dark:hover:bg-pink-900",
    label: "pink",
  },
  {
    tw_class: "bg-rose-500 hover:bg-rose-600 text-white dark:bg-rose-800 dark:hover:bg-rose-900",
    label: "rose",
  },
];
const EditorTools = () => {
  const t = useTranslations("app");
  const editor = useEditorStore();
  const views = [
    { label: t("label_properties"), view: "properties", enabled: true },
    { label: t("label_styles"), view: "styles", enabled: true },
    { label: t("label_reorder"), view: "reorder", enabled: false },
  ];
  const enabledViews = views.filter((x) => x.enabled);
  const isEditingBlock = editor.toolView === "block";

  return (
    <div className="hidden sm:flex border-l h-full overflow-y-auto sm:w-[500px]">
      {isEditingBlock && <ToolBlock />}
      {!isEditingBlock && (
        <div className="flex w-full overflow-y-auto flex-col">
          <div className="h-12 w-full border-b flex">
            {enabledViews.map((v) => {
              return (
                <button
                  onClick={() => editor.setToolView(v.view as TToolView)}
                  key={v.view}
                  className={`${
                    v.view === editor.toolView ? "font-medium text-foreground" : "text-foreground/60"
                  } text-sm flex justify-center items-center px-4 hover:bg-foreground/5 relative rounded gap-2 h-full`}>
                  <div className="truncate">{v.label}</div>
                  {v.view === editor.toolView && <div className="bg-primary bottom-0 w-full h-0.5 absolute"></div>}
                </button>
              );
            })}
          </div>
          <div className="flex flex-1 overflow-y-auto">
            {editor.toolView === "properties" && <ToolProperties />}
            {editor.toolView === "styles" && <ToolStyles />}
          </div>
        </div>
      )}
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
    <div className="flex flex-col justify-start items-center w-full p-5 gap-6 overflow-y-auto">
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
  const primaryColor = `bg-[${theme.custom_primary_color.toLowerCase()}]`;

  const onSetNumericBlocks = (value: boolean) => {
    setTheme({ ...theme, numeric_blocks: value });
  };
  const onSetUppercaseBlockName = (value: boolean) => {
    setTheme({ ...theme, uppercase_block_name: value });
  };
  const onSetWidth = (value: string) => {
    setTheme({ ...theme, width: value });
  };
  const onSetPrimaryColor = (value: string) => {
    setTheme({ ...theme, primary_color: value });
  };
  const onSetCustomPrimaryColor = (value: string) => {
    setTheme({ ...theme, custom_primary_color: value });
  };

  return (
    <div className="flex justify-start items-center w-full h-full flex-col p-5 gap-6 overflow-y-auto">
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
      <div className="justify-between items-start w-full sm:gap-4 flex-col hidden">
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
      <div className="gap-3 w-full hidden">
        <div className="flex justify-start items-center gap-2">
          <div className="grid gap-1">
            <Label>{t("label_primary_color")}</Label>
            <span className="text-xs text-foreground/60 hidden">{t("desc_primary_color")}</span>
          </div>
        </div>
        <div className="grid grid-cols-8 gap-3">
          {colors.map((color, index) => {
            return (
              <button
                onClick={() => onSetPrimaryColor(color.label)}
                key={index}
                className={`${color.tw_class} w-8 h-8 flex justify-center items-center rounded`}>
                {theme.primary_color === color.label && <CheckIcon className="w-5 h-5 text-white" />}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex justify-between items-center w-full">
        <Label>{t("label_primary_color")}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <button style={{ backgroundColor: theme.custom_primary_color }} className="w-8 h-8 rounded"></button>
          </PopoverTrigger>
          <PopoverContent className="w-fit p-2 sm:mr-5 sm:mt-1">
            <HexColorPicker color={theme.custom_primary_color} onChange={onSetCustomPrimaryColor} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
const ToolBlock = () => {
  const editor = useEditorStore();

  const onClose = () => {
    editor.setToolView("properties");
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center w-full border-b h-12 px-3">
        <span className="font-semibold text-sm">{editor.blockView.type}</span>
        <Button onClick={onClose} variant={"ghost"} size={"icon"} className="w-8 h-8">
          <XIcon className="w-5 h-5" />
        </Button>
      </div>
      <div className="flex justify-center items-center h-full">
        <WipUI context="Block settings" />
      </div>
    </div>
  );
};

export default EditorTools;
