import PoweredByBadge from "@/components/shared/badges/powered-by-badge";
import { Button } from "@/components/ui/button";
import useEditorStore from "@/stores/editor";
import { EBlock, ETheme } from "@/utils/entities";
import { TBlock } from "@/utils/types";
import { Reorder, useDragControls } from "framer-motion";
import {
  CalendarIcon,
  CheckCircleIcon,
  CheckSquareIcon,
  ChevronDownIcon,
  EqualIcon,
  GripVertical,
  HashIcon,
  MailIcon,
  PenIcon,
  Pencil,
  PlusIcon,
  ScaleIcon,
  SettingsIcon,
  StarIcon,
  TextIcon,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import AddBlock from "../blocks/add-block";
import CheckBoxesDesign from "../blocks/design/checkboxes-design";
import CustomScaleDesign from "../blocks/design/custom-scale-design";
import DatePickerDesign from "../blocks/design/date-picker-design";
import DropdownMenuDesign from "../blocks/design/dropdown-menu-design";
import EmailAddressDesign from "../blocks/design/email-address-design";
import MultipleChoiceDesign from "../blocks/design/multiple-choice-design";
import NumberInputDesign from "../blocks/design/number-input-design";
import ParagraphTextDesign from "../blocks/design/paragraph-text-design";
import ShortTextDesign from "../blocks/design/short-text-design";
import StarRatingDesign from "../blocks/design/star-rating-design";
import EditorFormSettings from "./editor-form-settings";
import EditorToolsMobile from "./editor-tools-mobile";

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
const EditorContentMobile = () => {
  const editor = useEditorStore();
  const t = useTranslations("app");
  const empty = editor.blocks.length <= 0;

  if (empty) {
    return (
      <div className="flex justify-center items-center flex-col gap-4 w-full p-4">
        <div className="rounded-full bg-primary/5 p-3">
          <PlusIcon className="h-7 w-7 text-primary" />
        </div>
        <div className="flex flex-col justify-center items-center text-center">
          <h3 className="text-xl font-semibold">{t("label_start_form")}</h3>
          <p className="text-sm text-muted-foreground">{t("desc_start_form")}</p>
        </div>
        <AddBlock>
          <Button size={"sm"} variant={"secondary"}>
            <PlusIcon className="w-4 h-4 mr-2" />
            {t("label_first_block")}
          </Button>
        </AddBlock>
      </div>
    );
  }

  return (
    <div className="flex w-full px-4 pb-4 pt-4 gap-4 flex-col h-full justify-start">
      <EditorControls />
      {editor.preview && <EditorPreview />}
      {!editor.preview && (
        <>
          <EditorCanvas />
          <EditorTools />
        </>
      )}
    </div>
  );
};
const EditorCanvas = () => {
  return (
    <div className="flex w-full overflow-y-auto h-dvh flex-col gap-4">
      <EditorGroup />
    </div>
  );
};
const EditorGroup = () => {
  const editor = useEditorStore();

  const handleReorder = (newOrder: EBlock[]) => {
    const updatedBlocks = newOrder.map((block, index) => ({
      ...block,
      position: index + 1,
    }));
    editor.setBlocks(updatedBlocks);
  };

  return (
    <Reorder.Group axis="y" values={editor.blocks} onReorder={handleReorder} className="flex flex-col w-full gap-2">
      {editor.blocks.map((block) => {
        return <EditorBlock key={block.id} block={block} />;
      })}
    </Reorder.Group>
  );
};
const EditorBlock = ({ block }: { block: EBlock }) => {
  const t = useTranslations("app");
  const editor = useEditorStore();
  const dragControls = useDragControls();
  const getBlock: Record<TBlock, { name: string; icon: any }> = {
    short_text: {
      name: t("label_short_text"),
      icon: EqualIcon,
    },
    paragraph_text: {
      name: t("label_paragraph_text"),
      icon: TextIcon,
    },
    multiple_choice: {
      name: t("label_multiple_choice"),
      icon: CheckCircleIcon,
    },
    checkboxes: {
      name: t("label_checkboxes"),
      icon: CheckSquareIcon,
    },
    dropdown_menu: {
      name: t("label_dropdown_menu"),
      icon: ChevronDownIcon,
    },
    number_input: {
      name: t("label_number_input"),
      icon: HashIcon,
    },
    email_address: {
      name: t("label_email_address"),
      icon: MailIcon,
    },
    star_rating: {
      name: t("label_star_rating"),
      icon: StarIcon,
    },
    custom_scale: {
      name: t("label_custom_scale"),
      icon: ScaleIcon,
    },
    date_picker: {
      name: t("label_date_picker"),
      icon: CalendarIcon,
    },
  };
  const b = getBlock[block.type as TBlock];
  const onRemoveBlock = () => {
    editor.removeBlock(block.id);
  };
  const onSelectBlock = () => {
    editor.setBlockView(block);
    editor.setToolView("block");
  };

  return (
    <Reorder.Item
      value={block}
      dragListener={false}
      dragControls={dragControls}
      className="relative rounded-lg shadow-sm border p-3 mb-2 bg-background">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {<b.icon className="w-4 h-4 text-primary" />}
          <span className="text-xs font-medium uppercase text-foreground/70">{b.name}</span>
          {block.required && <span className="text-sm text-red-500">*</span>}
        </div>
        <div className="flex space-x-1">
          <button
            onPointerDown={(e) => {
              e.preventDefault();
              dragControls.start(e);
            }}
            className="p-1 text-gray-400 hover:text-gray-600">
            <GripVertical className="w-5 h-5" />
          </button>
          <EditorToolsMobile>
            <button onClick={onSelectBlock} className="p-1 text-gray-400 hover:text-blue-500">
              <Pencil className="w-5 h-5" />
            </button>
          </EditorToolsMobile>
          <button onClick={onRemoveBlock} className="p-1 text-gray-400 hover:text-red-500">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="mb-1">
        <h3 className="text-sm font-semibold text-foreground/80">{block.name}</h3>
        {block.description && <p className="text-xs mt-1 text-foreground/50">{block.description}</p>}
      </div>
    </Reorder.Item>
  );
};
const EditorPreview = () => {
  const editor = useEditorStore();

  return (
    <div className="flex w-full overflow-y-auto h-dvh flex-col gap-4">
      <div className="flex flex-col gap-2 justify-center items-center">
        <h1 className="text-2xl font-bold">{editor.form.name}</h1>
        <p className="text-sm text-foreground/80">{editor.form.description}</p>
      </div>
      <div className="flex flex-col w-full gap-4">
        {editor.blocks.map((block) => {
          const Component = COMPONENT_MAP[block.type as TBlock];
          if (!Component) return null;
          return <Component key={block.id} block={block} theme={editor.theme} onValueChange={() => {}} />;
        })}
      </div>
      <div className="flex flex-col gap-2 w-full justify-center items-center">
        <button
          style={{ backgroundColor: editor.theme.custom_primary_color }}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 text-white w-full">
          {editor.form.submit_text}
        </button>
        <div className="flex justify-center sm:justify-end items-center w-full gap-2 h-14">
          {editor.form.nebulaform_branding && <PoweredByBadge version="default" />}
        </div>
      </div>
    </div>
  );
};
const EditorControls = () => {
  const editor = useEditorStore();
  const t = useTranslations("app");
  const controls = [
    { label: t("label_editor"), preview: false },
    { label: t("label_preview"), preview: true },
  ];
  return (
    <div className="flex justify-center items-center w-full min-h-10 gap-4">
      {controls.map((control) => {
        return (
          <button
            onClick={() => {
              editor.setPreview(control.preview);
              editor.setView("blocks");
            }}
            key={control.label}
            className={`relative w-full flex justify-center items-center h-full hover:bg-foreground/5 border`}>
            <span className="text-sm">{control.label}</span>
            {control.preview === editor.preview && <div className="bg-primary bottom-0 w-full h-0.5 absolute"></div>}
          </button>
        );
      })}
    </div>
  );
};
const EditorTools = () => {
  const editor = useEditorStore();

  const onSelectTools = () => {
    editor.setToolView("properties");
  };

  return (
    <div className="flex justify-evenly items-center w-full h-10 gap-4">
      <EditorFormSettings>
        <Button variant={"ghost"} className="w-full">
          <SettingsIcon className="w-4 h-4" />
        </Button>
      </EditorFormSettings>
      <AddBlock>
        <Button variant={"ghost"} className="w-full">
          <PlusIcon className="w-4 h-4" />
        </Button>
      </AddBlock>
      <EditorToolsMobile>
        <Button onClick={onSelectTools} variant={"ghost"} className="w-full">
          <PenIcon className="w-4 h-4" />
        </Button>
      </EditorToolsMobile>
    </div>
  );
};

export default EditorContentMobile;
