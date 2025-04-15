import ModeToggle2 from "@/components/core/mode-toggle2";
import PoweredBy from "@/components/shared/powered-by";
import { Button } from "@/components/ui/button";
import useEditorStore from "@/stores/editor";
import { EBlock, ETheme } from "@/utils/entities";
import { TBlock, TColor } from "@/utils/types";
import { Reorder, useDragControls } from "framer-motion";
import { Edit2Icon, GripVerticalIcon, PlusIcon, SettingsIcon, Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import AddBlock from "../../blocks/add-block";
import CheckBoxesDesign from "../../blocks/design/checkboxes-design";
import CustomScaleDesign from "../../blocks/design/custom-scale-design";
import DatePickerDesign from "../../blocks/design/date-picker-design";
import DropdownMenuDesign from "../../blocks/design/dropdown-menu-design";
import EmailAddressDesign from "../../blocks/design/email-address-design";
import MultipleChoiceDesign from "../../blocks/design/multiple-choice-design";
import NumberInputDesign from "../../blocks/design/number-input-design";
import ParagraphTextDesign from "../../blocks/design/paragraph-text-design";
import ShortTextDesign from "../../blocks/design/short-text-design";
import StarRatingDesign from "../../blocks/design/star-rating-design";
import SuccessDesign from "../../blocks/success-design";
import EditorFormSettings from "../editor-form-settings";

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
const EditorContent = () => {
  const editor = useEditorStore();

  return (
    <div className="w-full flex justify-center items-start overflow-y-auto relative">
      {editor.blocks.length > 0 && (
        <div className="p-2 flex justify-center items-center fixed mt-12 left-2 top-2 rounded flex-col gap-3">
          <AddBlock>
            <Button variant={"outline"} size={"icon"} className="w-8 h-8">
              <PlusIcon className="w-4 h-4" />
            </Button>
          </AddBlock>
          <EditorFormSettings>
            <Button variant={"outline"} size={"icon"} className="w-8 h-8">
              <SettingsIcon className="w-4 h-4" />
            </Button>
          </EditorFormSettings>
        </div>
      )}
      <EditorCanvas />
    </div>
  );
};
const EditorCanvas = () => {
  const t = useTranslations("app");
  const { blocks, view, form, theme } = useEditorStore();
  const empty = blocks.length <= 0;

  if (!empty && view === "blocks") {
    return (
      <div className="flex p-4 sm:p-8 w-full justify-center items-center flex-col sm:w-[650px]">
        <EditorGroup />
      </div>
    );
  }
  if (!empty && view === "success") {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <SuccessDesign
          brand={form.nebulaform_branding}
          color={theme.custom_primary_color as TColor}
          preview
          title={form.success_title}
          description={form.success_description}
        />
      </div>
    );
  }
  return (
    <div className="flex justify-center items-center w-full h-full p-8">
      <div className="flex flex-col items-center justify-center h-full w-full p-8 rounded-lg border-2 border-dashed bg-muted/5">
        <div className="flex flex-col items-center max-w-md text-center space-y-6">
          <div className="rounded-full bg-primary/5 p-3">
            <PlusIcon className="h-7 w-7 text-primary" />
          </div>
          <div className="space-y-2">
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
      </div>
    </div>
  );
};
const EditorGroup = () => {
  const { blocks, theme, setBlocks, form } = useEditorStore();

  const handleReorder = (newOrder: EBlock[]) => {
    const updatedBlocks = newOrder.map((block, index) => ({
      ...block,
      position: index + 1,
    }));
    setBlocks(updatedBlocks);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 px-3 justify-center items-start">
        <h1 className="text-2xl font-bold">{form.name}</h1>
        <p className="text-sm text-foreground/80">{form.description}</p>
      </div>
      <Reorder.Group axis="y" values={blocks} onReorder={handleReorder} className="flex flex-col gap-2 w-full">
        {blocks.map((block) => {
          const Component = COMPONENT_MAP[block.type as TBlock];
          if (!Component) return null;
          return (
            <BlockWrapper key={block.id} block={block}>
              <Component block={block} theme={theme} onValueChange={() => {}} />
            </BlockWrapper>
          );
        })}
      </Reorder.Group>
      <div className="flex justify-center items-center w-full px-3 flex-col gap-6">
        <button
          style={{ backgroundColor: theme.custom_primary_color }}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 text-white w-full">
          {form.submit_text}
        </button>
        <div className="flex justify-between items-center w-full gap-2 h-14">
          <ModeToggle2 />
          {form.nebulaform_branding && <PoweredBy version="default" />}
        </div>
      </div>
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
          : "border border-transparent"
      } flex w-full p-3 relative group hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors rounded`}>
      {/* Content */}
      <div className="flex-1">{children}</div>
      {/* Action buttons */}
      <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 p-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded">
        <button
          onPointerDown={(e) => {
            e.preventDefault();
            dragControls.start(e);
          }}
          className="cursor-grab active:cursor-grabbing p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50/50 dark:text-gray-300 dark:hover:text-green-400 dark:hover:bg-green-900/30 rounded transition-colors"
          title="Reordenar bloco"
          aria-label="Reordenar bloco">
          <GripVerticalIcon className="w-4 h-4" />
        </button>
        <button
          onClick={onSelectBlock}
          className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-blue-900/30 rounded transition-colors"
          title="Editar bloco"
          aria-label="Editar bloco">
          <Edit2Icon className="w-4 h-4" />
        </button>
        <button
          onClick={onRemoveBlock}
          className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50/50 dark:text-gray-300 dark:hover:text-red-400 dark:hover:bg-red-900/30 rounded transition-colors"
          title="Deletar bloco"
          aria-label="Deletar bloco">
          <Trash2Icon className="w-4 h-4" />
        </button>
      </div>
    </Reorder.Item>
  );
};

export default EditorContent;
