"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import useEditorStore from "@/stores/editor";
import useUserStore from "@/stores/user";
import { blockViewSettings } from "@/utils/constants";
import { getBlockName } from "@/utils/functions";
import { TBlock, TFormStatus, TToolView } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { Reorder } from "framer-motion";
import { AlertTriangleIcon, CircleHelpIcon, PlusIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import ColorPicker from "../../shared/utils/color-picker";
import FormStatus from "../form/form-status";
import FormDelete from "../shared/form/form-delete";

const EditorTools = () => {
  const t = useTranslations("app");
  const editor = useEditorStore();
  const views = [
    { label: t("label_properties"), view: "properties", enabled: true },
    { label: t("label_styles"), view: "styles", enabled: true },
    { label: t("label_settings"), view: "settings", enabled: true },
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
                    v.view === editor.toolView ? "font-medium text-foreground" : "text-muted-foreground"
                  } text-xs flex justify-center items-center px-4 hover:bg-foreground/5 relative rounded gap-2 h-full`}>
                  <div className="truncate">{v.label}</div>
                  {v.view === editor.toolView && <div className="bg-primary bottom-0 w-full h-0.5 absolute"></div>}
                </button>
              );
            })}
          </div>
          <div className="flex flex-1 overflow-y-auto">
            {editor.toolView === "properties" && <ToolProperties />}
            {editor.toolView === "styles" && <ToolStyles />}
            {editor.toolView === "settings" && <ToolSettings />}
          </div>
        </div>
      )}
    </div>
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
    setForm({ ...form, submit_label: value });
  };
  const onSetSuccessTitle = (value: string) => {
    setForm({ ...form, success_title: value });
  };
  const onSetSuccessDescription = (value: string) => {
    setForm({ ...form, success_description: value });
  };

  return (
    <div className="flex flex-col w-full">
      {view === "blocks" && (
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
            <Input type="text" value={form.submit_label} onChange={(e) => onSetSubmitText(e.target.value)} />
          </div>
        </div>
      )}
      {view === "success" && (
        <div className="flex flex-col justify-start items-center w-full p-5 gap-6 overflow-y-auto">
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
      )}
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
  const onSetCustomPrimaryColor = (value: string) => {
    setTheme({ ...theme, custom_primary_color: value });
  };
  const onSetAppBranding = (value: boolean) => {
    if (user.subscription.plan !== "pro") return;
    setTheme({ ...theme, app_branding: value });
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
      <div className="flex justify-between items-center w-full">
        <div className="flex justify-center items-center gap-2">
          <div className="grid gap-1">
            <div className="flex justify-start items-center gap-2">
              <Label>{t("label_app_branding")}</Label>
              {user.subscription.plan !== "pro" && <Badge variant={"pink"}>Pro</Badge>}
            </div>
            <span className="text-xs text-foreground/60 hidden">{t("desc_app_branding")}</span>
          </div>
        </div>
        <Switch checked={theme.app_branding} onCheckedChange={onSetAppBranding} />
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
  const t = useTranslations("app");
  const editor = useEditorStore();
  const user = useUserStore();
  const block = editor.blocks.find((x) => x.id === editor.blockView.id)!;
  const [input, setInput] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const isIdentifierAvailable = editor.blocks.some((e) => e.is_identifier === true && e.id !== block.id);

  const query = useQuery({
    queryKey: ["blockSettingsData", block.id],
    queryFn: async () => {
      setOptions([]);
      const blockType = editor.blockView.type as TBlock;
      const blockName = await getBlockName(blockType, user.locale);
      const blockSettings = blockViewSettings.find((x) => x.block === blockType)!;
      setOptions(editor.blockView.options ?? []);
      return { blockName, blockSettings };
    },
  });
  const onClose = () => {
    editor.setToolView("properties");
  };
  const onAddOption = () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) {
      return;
    }

    const isDuplicate = options.some((option) => option.toLowerCase() === trimmedInput.toLowerCase());

    if (isDuplicate) {
      return;
    }

    const newOptions = [...options, trimmedInput];
    setOptions(newOptions);
    editor.updateBlock(block.id, { ...block, options: newOptions });
    setInput("");
  };
  const onDeleteOption = (value: string) => {
    const newOptions = options.filter((opt) => opt !== value);
    setOptions(newOptions);
    editor.updateBlock(block.id, { ...block, options: newOptions });
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onAddOption();
    }
  };
  const onReorder = (newOptions: string[]) => {
    setOptions(newOptions);
    editor.updateBlock(block.id, { ...block, options: newOptions });
  };

  if (query.isPending || !query.data) return null;

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center w-full border-b h-12 px-3">
        <span className="font-semibold text-sm">{query.data.blockName}</span>
        <Button onClick={onClose} variant={"ghost"} size={"icon"} className="w-8 h-8">
          <XIcon className="w-5 h-5" />
        </Button>
      </div>
      <div className="flex flex-col justify-start items-center w-full p-5 gap-6 overflow-y-auto">
        {/* required */}
        {query.data.blockSettings.showRequired && (
          <div className="flex justify-between items-center w-full">
            <div className="grid gap-1">
              <Label>{t("label_block_required")}</Label>
            </div>
            <Switch
              id="required"
              checked={block.required}
              onCheckedChange={(checked: boolean) => {
                editor.updateBlock(block.id, { ...block, required: checked });
              }}
            />
          </div>
        )}
        {/* name */}
        {query.data.blockSettings.showName && (
          <div className="grid gap-3 w-full">
            <div className="grid gap-1">
              <Label className="">{t("label_block_name")}</Label>
            </div>
            <Input
              type="text"
              id="name"
              value={block.name}
              onChange={(e) => {
                editor.updateBlock(block.id, { ...block, name: e.target.value });
              }}
            />
          </div>
        )}
        {/* description */}
        {query.data.blockSettings.showDescription && (
          <div className="grid gap-3 w-full">
            <div className="grid gap-1">
              <Label className="">{t("label_block_desc")}</Label>
            </div>
            <Textarea
              id="description"
              value={block.description ?? ""}
              onChange={(e) => {
                editor.updateBlock(block.id, { ...block, description: e.target.value });
              }}
            />
          </div>
        )}
        {/* placeholder */}
        {query.data.blockSettings.showPlaceholder && (
          <div className="grid gap-3 w-full">
            <div className="grid gap-1">
              <Label className="">{t("label_block_placeholder")}</Label>
            </div>
            <Input
              type="text"
              id="placeholder"
              value={block.placeholder ?? ""}
              onChange={(e) => {
                editor.updateBlock(block.id, { ...block, placeholder: e.target.value });
              }}
            />
          </div>
        )}
        {/* min char */}
        {query.data.blockSettings.showMinChar && (
          <div className="grid gap-3 w-full">
            <Label htmlFor="min-character-limit">{t("label_block_min")}</Label>
            <Input
              type="number"
              id="min-character-limit"
              value={block.min_char ?? 1}
              onChange={(e) => {
                editor.updateBlock(block.id, {
                  ...block,
                  min_char: Number(e.target.value),
                });
              }}
            />
          </div>
        )}
        {/* max char */}
        {query.data.blockSettings.showMaxChar && (
          <div className="grid gap-3 w-full">
            <div className="grid gap-1">
              <Label className="">{t("label_block_max")}</Label>
            </div>
            <Input
              type="number"
              id="max-character-limit"
              value={block.max_char ?? 100}
              onChange={(e) => {
                editor.updateBlock(block.id, {
                  ...block,
                  max_char: Number(e.target.value),
                });
              }}
            />
          </div>
        )}
        {/* show char limit */}
        {query.data.blockSettings.showChar && (
          <div className="flex justify-between items-center w-full">
            <div className="grid gap-1">
              <Label>{t("label_block_show_char")}</Label>
            </div>
            <Switch
              id="show-character-limit"
              checked={block.show_char ?? false}
              onCheckedChange={(checked: boolean) => {
                editor.updateBlock(block.id, { ...block, show_char: checked });
              }}
            />
          </div>
        )}
        {/* options */}
        {query.data.blockSettings.showOptions && (
          <div className="grid gap-3 w-full">
            <div className="grid gap-1">
              <Label className="">{t("label_block_options")}</Label>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2 items-stretch">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                />
                <Button
                  size="icon"
                  variant="default"
                  onClick={onAddOption}
                  disabled={!input.trim()}
                  className="shrink-0">
                  <PlusIcon className="w-4 h-4" />
                </Button>
              </div>

              {options.length > 0 ? (
                <Reorder.Group axis="y" values={options} onReorder={onReorder} className="flex flex-col gap-2 pr-1">
                  {options.map((opt) => (
                    <Reorder.Item
                      key={opt}
                      value={opt}
                      className="group flex items-center justify-between bg-foreground/5 hover:bg-foreground/10 transition-colors p-2 rounded cursor-grab active:cursor-grabbing">
                      <span className="text-sm truncate max-w-[70%]">{opt}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onDeleteOption(opt)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-foreground/50 hover:text-foreground/80">
                          <XIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              ) : (
                <div className="text-center text-sm text-muted-foreground py-4 rounded border border-dashed">
                  {t("label_no_options_added")}
                </div>
              )}
            </div>
          </div>
        )}
        {/* identifier */}
        {query.data.blockSettings.showIsIdentifier && (
          <div className="flex justify-between items-center w-full">
            <div className="grid gap-1">
              <div className="flex justify-start items-center gap-2">
                <Label htmlFor="identifier">{t("label_mark_identifier")}</Label>
                <IdentifierToolTip>
                  <CircleHelpIcon className="w-4 h-4 text-foreground/80" />
                </IdentifierToolTip>
              </div>
            </div>
            <Switch
              id="identifier"
              disabled={isIdentifierAvailable}
              checked={block.is_identifier}
              onCheckedChange={(checked: boolean) => {
                editor.updateBlock(block.id, { ...block, is_identifier: checked });
              }}
            />
          </div>
        )}
        {/* min date */}
        {query.data.blockSettings.showMinDate && (
          <div className="grid gap-3 w-full">
            <Label htmlFor="min-date">{t("label_block_min")}</Label>
            <Input
              type="date"
              id="min-date"
              value={block.min_date ?? ""}
              onChange={(e) => {
                editor.updateBlock(block.id, {
                  ...block,
                  min_date: e.target.value,
                });
              }}
            />
          </div>
        )}
        {/* max date */}
        {query.data.blockSettings.showMaxDate && (
          <div className="grid gap-3 w-full">
            <Label htmlFor="max-date">{t("label_block_max")}</Label>
            <Input
              type="date"
              id="max-date"
              value={block.max_date ?? ""}
              onChange={(e) => {
                editor.updateBlock(block.id, {
                  ...block,
                  max_date: e.target.value,
                });
              }}
            />
          </div>
        )}
        {/* rating */}
        {query.data.blockSettings.showRating && (
          <div className="grid gap-3 w-full">
            <div className="grid gap-1">
              <Label htmlFor="max-rating">{t("label_max_rating")}</Label>
            </div>
            <Input
              type="number"
              id="max-rating"
              value={block.rating ?? 5}
              onChange={(e) => {
                editor.updateBlock(block.id, {
                  ...block,
                  rating: Number(e.target.value),
                });
              }}
            />
          </div>
        )}
        {/* max scale */}
        {query.data.blockSettings.showMaxScale && (
          <div className="grid gap-3 w-full">
            <div className="grid gap-1">
              <Label htmlFor="max-scaling">{t("label_max_scale")}</Label>
            </div>
            <Input
              type="number"
              id="max-scale"
              min={2}
              max={10}
              value={block.max_scale ?? 5}
              onChange={(e) => {
                const target = Number(e.target.value);
                if (target > 10) return;
                editor.updateBlock(block.id, {
                  ...block,
                  max_scale: target,
                });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
const ToolSettings = () => {
  const t = useTranslations("app");
  const { form, setForm } = useEditorStore();

  const onSetStatus = (value: string) => {
    setForm({ ...form, status: value });
  };

  return (
    <div className="flex justify-start items-center w-full h-full flex-col p-5 gap-6 overflow-y-auto pt-0">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>{t("label_status")}</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4">
            <p className="text-xs text-muted-foreground">{t("desc_status")}</p>
            <FormStatus status={form.status as TFormStatus} onStatusChange={onSetStatus} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>{t("label_danger_zone")}</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4">
            <p className="text-xs text-muted-foreground">{t("desc_danger_zone")}</p>
            <div className="flex justify-end items-center">
              <FormDelete formId={form.id} formName={form.name}>
                <Button variant={"destructive_outline"} size={"sm"} className="w-full sm:w-fit">
                  <AlertTriangleIcon className="h-4 w-4 mr-2" />
                  {t("label_continue")}
                </Button>
              </FormDelete>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
const IdentifierToolTip = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("app");
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{t("tt_mark_identifier")}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default EditorTools;
