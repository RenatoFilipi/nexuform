"use client";

import ColorPicker from "@/components/private/shared/custom/color-picker";
import PoweredByBadge from "@/components/shared/powered-by-badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import useAppStore from "@/stores/app";
import useEditorStore from "@/stores/editor";
import useUserStore from "@/stores/user";
import { blockViewSettings, fallbackColor } from "@/utils/constants";
import { EBlock, EForm, EOrganization, EProfile, ESubscription, ETeamMemberProfile, ETheme } from "@/utils/entities";
import { getBlockName } from "@/utils/functions";
import { IContext } from "@/utils/interfaces";
import { TBlock, TEditorView, TToolView } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { Reorder, useDragControls } from "framer-motion";
import { CheckCircleIcon, ComponentIcon, Edit2Icon, GripVerticalIcon, PlusIcon, Trash2Icon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import CheckBoxesDesign from "../../shared/blocks-design/checkboxes-design";
import CustomScaleDesign from "../../shared/blocks-design/custom-scale-design";
import DatePickerDesign from "../../shared/blocks-design/date-picker-design";
import DropdownMenuDesign from "../../shared/blocks-design/dropdown-menu-design";
import EmailAddressDesign from "../../shared/blocks-design/email-address-design";
import MultipleChoiceDesign from "../../shared/blocks-design/multiple-choice-design";
import NumberInputDesign from "../../shared/blocks-design/number-input-design";
import ParagraphTextDesign from "../../shared/blocks-design/paragraph-text-design";
import ShortTextDesign from "../../shared/blocks-design/short-text-design";
import StarRatingDesign from "../../shared/blocks-design/star-rating-design";
import SuccessDesign from "../../shared/blocks-design/success-design";
import RestrictedAccessUI from "../../shared/pages/restricted-access-ui";
import SubscriptionUI from "../../shared/pages/subscription-ui";
import EditorAddBlock from "./editor-add-block";

interface IProps {
  locale: string;
  email: string;
  profile: EProfile;
  organization: EOrganization;
  subscription: ESubscription;
  teamMemberProfile: ETeamMemberProfile;
  form: EForm;
  theme: ETheme;
  blocks: EBlock[];
  context: IContext;
}
const EditorWrapper = (props: IProps) => {
  const editor = useEditorStore();
  const app = useAppStore();
  const user = useUserStore();

  const query = useQuery({
    queryKey: ["editor-page"],
    queryFn: () => {
      editor.reset();
      user.setLocale(props.locale);
      user.setEmail(props.email);
      user.setProfile(props.profile);
      app.setOrganization(props.organization);
      app.setSubscription(props.subscription);
      app.setTeamMemberProfile(props.teamMemberProfile);
      editor.setForm(props.form);
      const primaryColor = props.theme.custom_primary_color.trim() || fallbackColor;
      editor.setTheme({ ...props.theme, custom_primary_color: primaryColor });
      editor.setBlocks(props.blocks);
      editor.setOriginalBlocks(props.blocks);
      app.setContext(props.context);
      return null;
    },
  });

  if (query.isPending) return null;

  if (!app.context.isSubscriptionActive) {
    return (
      <div className="flex justify-center items-center w-full">
        <div>
          <SubscriptionUI />
        </div>
      </div>
    );
  }

  if (!app.context.isOrgOwner && app.subscription.plan !== "pro") {
    return <RestrictedAccessUI />;
  }

  return (
    <div className="flex justify-center items-center flex-1 h-full">
      <EditorCanva />
      <EditorToolbar />
    </div>
  );
};
interface IBlockComponent {
  block: EBlock;
  theme: ETheme;
  onValueChange: () => void;
}
const COMPONENT_MAP: Record<TBlock, React.ComponentType<IBlockComponent>> = {
  short_text: ShortTextDesign,
  paragraph_text: ParagraphTextDesign,
  multiple_choice: MultipleChoiceDesign,
  checkboxes: CheckBoxesDesign,
  dropdown_menu: DropdownMenuDesign,
  number_input: NumberInputDesign,
  email_address: EmailAddressDesign,
  star_rating: StarRatingDesign,
  custom_scale: CustomScaleDesign,
  date_picker: DatePickerDesign,
};
const EditorCanva = () => {
  const t = useTranslations("app");
  const editor = useEditorStore();
  const hasBlocks = editor.blocks.length > 0;

  const pages = [
    { view: "blocks", icon: ComponentIcon, label: t("label_blocks") },
    { view: "success", icon: CheckCircleIcon, label: t("label_success") },
  ];

  const handleReorder = (newOrder: EBlock[]) => {
    const updatedBlocks = newOrder.map((block, index) => ({
      ...block,
      position: index + 1,
    }));
    editor.setBlocks(updatedBlocks);
  };

  return (
    <div className="flex justify-center items-center h-full w-full flex-col">
      <div className="h-16 w-full flex justify-between items-center px-3 gap-4">
        <EditorAddBlock>
          <Button variant={"outline"} size={"sm"}>
            <PlusIcon className="w-4 h-4 mr-2" />
            {t("label_add_block")}
          </Button>
        </EditorAddBlock>
        <div className="flex justify-center items-center gap-3">
          {pages.map((x) => {
            const isActive = x.view === editor.editorView;
            return (
              <Button
                size={"sm"}
                variant={"outline"}
                className={`${
                  isActive
                    ? "bg-foreground/5 text-foreground"
                    : "text-muted-foreground/90 hover:bg-muted hover:text-foreground"
                }`}
                key={x.label}
                onClick={() => {
                  editor.setEditorView(x.view as TEditorView);
                  editor.setToolView("properties");
                }}>
                {x.label}
              </Button>
            );
          })}
        </div>
      </div>
      {!hasBlocks && (
        <div className="flex justify-center items-center h-full w-full overflow-y-auto flex-col gap-4">
          <div className="flex flex-col items-center max-w-md text-center space-y-6">
            <div className="rounded bg-primary/10 p-3">
              <PlusIcon className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">{t("label_start_form")}</h3>
              <p className="text-sm text-muted-foreground">{t("desc_start_form")}</p>
            </div>
          </div>
        </div>
      )}
      {hasBlocks && editor.editorView === "blocks" && (
        <div className="flex justify-center items-start h-full w-full overflow-y-auto py-8">
          <div className="flex flex-col gap-6 w-full sm:w-[720px]">
            {/* Header */}
            <div className="flex flex-col gap-2 px-3 justify-center items-start">
              <h1 className="text-2xl font-bold">{editor.form.name}</h1>
              <p className="text-sm text-muted-foreground text-wrap">{editor.form.description}</p>
            </div>
            {/* Blocks */}
            <Reorder.Group
              axis="y"
              values={editor.blocks}
              onReorder={handleReorder}
              className="flex flex-col gap-2 w-full">
              {editor.blocks.map((block) => {
                const Component = COMPONENT_MAP[block.type as TBlock];
                if (!Component) return null;
                return (
                  <BlockWrapper key={block.id} block={block}>
                    <Component block={block} theme={editor.theme} onValueChange={() => {}} />
                  </BlockWrapper>
                );
              })}
            </Reorder.Group>
            {/* Footer */}
            <div className="flex justify-center items-center w-full flex-col gap-6 p-3">
              <button
                style={{ backgroundColor: editor.theme.custom_primary_color }}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 text-white w-full">
                {editor.form.submit_label}
              </button>
              <span className="text-xs text-muted-foreground text-wrap">{t("label_form_notice")}</span>
              <div className="flex justify-center sm:justify-end items-center w-full gap-2 h-14">
                {editor.theme.app_branding && <PoweredByBadge version="default" />}
              </div>
            </div>
          </div>
        </div>
      )}
      {hasBlocks && editor.editorView === "success" && (
        <div className="flex justify-center items-center h-full w-full overflow-y-auto">
          <SuccessDesign
            brand={editor.theme.app_branding}
            color={editor.theme.custom_primary_color}
            preview
            title={editor.form.success_title}
            description={editor.form.success_description}
          />
        </div>
      )}
    </div>
  );
};
const BlockWrapper = ({ children, block }: { children: React.ReactNode; block: EBlock }) => {
  const editor = useEditorStore();
  const dragControls = useDragControls();

  const onSelectBlock = () => {
    editor.setBlockView(block);
    editor.setToolView("block");
  };

  const onRemoveBlock = () => {
    editor.setToolView("properties");
    editor.removeBlock(block.id);
  };

  return (
    <Reorder.Item
      value={block}
      dragListener={false}
      dragControls={dragControls}
      className={`${
        block.id === editor.blockView.id && editor.toolView === "block"
          ? "border-2 border-primary dark:border-primary"
          : "border-2 border-transparent"
      } flex w-full p-3 relative group hover:bg-foreground/10 transition-colors rounded`}>
      {/* Content */}
      <div className="flex-1">{children}</div>
      {/* Action buttons */}
      <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 p-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded">
        <button
          onPointerDown={(e) => {
            e.preventDefault();
            dragControls.start(e);
          }}
          className="cursor-grab active:cursor-grabbing p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50/50 dark:text-gray-300 dark:hover:text-green-400 dark:hover:bg-green-900/30 rounded transition-colors">
          <GripVerticalIcon className="w-4 h-4" />
        </button>
        <button
          onClick={onSelectBlock}
          className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-blue-900/30 rounded transition-colors">
          <Edit2Icon className="w-4 h-4" />
        </button>
        <button
          onClick={onRemoveBlock}
          className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50/50 dark:text-gray-300 dark:hover:text-red-400 dark:hover:bg-red-900/30 rounded transition-colors">
          <Trash2Icon className="w-4 h-4" />
        </button>
      </div>
    </Reorder.Item>
  );
};
const EditorToolbar = () => {
  const t = useTranslations("app");
  const editor = useEditorStore();
  const isEditingBlock = editor.toolView === "block";
  const views = [
    { label: t("label_properties"), view: "properties", enabled: true },
    { label: t("label_styles"), view: "styles", enabled: true },
    { label: t("label_settings"), view: "settings", enabled: false },
  ];

  return (
    <div className="hidden sm:flex border-l h-full overflow-y-auto sm:w-[500px]">
      {isEditingBlock && <ToolBlock />}
      {!isEditingBlock && (
        <div className="flex w-full overflow-y-auto flex-col">
          <div className="h-12 w-full border-b flex">
            {views
              .filter((x) => x.enabled)
              .map((v) => {
                return (
                  <button
                    onClick={() => editor.setToolView(v.view as TToolView)}
                    key={v.view}
                    className={`${
                      v.view === editor.toolView ? "font-medium text-foreground" : "text-muted-foreground"
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
  const { form, setForm, editorView } = useEditorStore();

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
      {editorView === "blocks" && (
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
      {editorView === "success" && (
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
  const editor = useEditorStore();
  const app = useAppStore();

  const onSetNumericBlocks = (value: boolean) => {
    editor.setTheme({ ...editor.theme, numeric_blocks: value });
  };
  const onSetUppercaseBlockName = (value: boolean) => {
    editor.setTheme({ ...editor.theme, uppercase_block_name: value });
  };
  const onSetCustomPrimaryColor = (value: string) => {
    editor.setTheme({ ...editor.theme, custom_primary_color: value });
  };
  const onSetAppBranding = (value: boolean) => {
    if (app.subscription.plan !== "pro") return;
    editor.setTheme({ ...editor.theme, app_branding: value });
  };

  return (
    <div className="flex justify-start items-center w-full h-full flex-col p-5 gap-6 overflow-y-auto">
      <div className="flex justify-between items-center w-full">
        <div className="grid gap-1">
          <Label>{t("label_numeric_blocks")}</Label>
          <p className="text-xs text-foreground/60 hidden">{t("desc_numeric_blocks")}</p>
        </div>
        <Switch checked={editor.theme.numeric_blocks} onCheckedChange={onSetNumericBlocks} />
      </div>
      <div className="flex justify-between items-center w-full">
        <div className="grid gap-1">
          <Label>{t("label_uppercase_block")}</Label>
          <p className="text-xs text-foreground/60 hidden">{t("desc_uppercase_block")}.</p>
        </div>
        <Switch checked={editor.theme.uppercase_block_name} onCheckedChange={onSetUppercaseBlockName} />
      </div>
      <div className="flex justify-between items-center w-full">
        <div className="flex justify-center items-center gap-2">
          <div className="grid gap-1">
            <div className="flex justify-start items-center gap-2">
              <Label>{t("label_app_branding")}</Label>
              {app.subscription.plan !== "pro" && <Badge variant={"primary"}>Pro</Badge>}
            </div>
            <span className="text-xs text-foreground/60 hidden">{t("desc_app_branding")}</span>
          </div>
        </div>
        <Switch checked={editor.theme.app_branding} onCheckedChange={onSetAppBranding} />
      </div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 pt-0">
            <div className="flex justify-center items-center gap-3">
              {t("label_primary_color")}
              <div
                className="w-8 h-4 rounded-full"
                style={{ backgroundColor: editor.theme.custom_primary_color }}></div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ColorPicker
              color={editor.theme.custom_primary_color}
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
                {/* <IdentifierToolTip>
                  <CircleHelpIcon className="w-4 h-4 text-foreground/80" />
                </IdentifierToolTip> */}
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

export default EditorWrapper;
