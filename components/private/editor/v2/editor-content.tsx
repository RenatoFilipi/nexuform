import { Button } from "@/components/ui/button";
import useEditorStore from "@/stores/editor";
import { EBlock, ETheme } from "@/utils/entities";
import { IDesign } from "@/utils/interfaces";
import { TBlock } from "@/utils/types";
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
import EditorFormSettings from "../editor-form-settings";

const buttonDesign: IDesign[] = [
  {
    label: "slate",
    tw_class: "bg-slate-500 hover:bg-slate-600 text-white",
  },
  {
    label: "gray",
    tw_class: "bg-gray-500 hover:bg-gray-600 text-white",
  },
  {
    label: "zinc",
    tw_class: "bg-zinc-500 hover:bg-zinc-600 text-white",
  },
  {
    label: "neutral",
    tw_class: "bg-neutral-500 hover:bg-neutral-600 text-white",
  },
  {
    label: "stone",
    tw_class: "bg-stone-500 hover:bg-stone-600 text-white",
  },
  {
    label: "red",
    tw_class: "bg-red-500 hover:bg-red-600 text-white",
  },
  {
    label: "orange",
    tw_class: "bg-orange-500 hover:bg-orange-600 text-white",
  },
  {
    label: "amber",
    tw_class: "bg-amber-500 hover:bg-amber-600 text-black",
  },
  {
    label: "yellow",
    tw_class: "bg-yellow-500 hover:bg-yellow-600 text-black",
  },
  {
    label: "lime",
    tw_class: "bg-lime-500 hover:bg-lime-600 text-black",
  },
  {
    label: "green",
    tw_class: "bg-green-500 hover:bg-green-600 text-white",
  },
  {
    label: "emerald",
    tw_class: "bg-emerald-500 hover:bg-emerald-600 text-white",
  },
  {
    label: "teal",
    tw_class: "bg-teal-500 hover:bg-teal-600 text-white",
  },
  {
    label: "cyan",
    tw_class: "bg-cyan-500 hover:bg-cyan-600 text-white",
  },
  {
    label: "sky",
    tw_class: "bg-sky-500 hover:bg-sky-600 text-white",
  },
  {
    label: "blue",
    tw_class: "bg-blue-500 hover:bg-blue-600 text-white",
  },
  {
    label: "indigo",
    tw_class: "bg-indigo-500 hover:bg-indigo-600 text-white",
  },
  {
    label: "violet",
    tw_class: "bg-violet-500 hover:bg-violet-600 text-white",
  },
  {
    label: "purple",
    tw_class: "bg-purple-500 hover:bg-purple-600 text-white",
  },
  {
    label: "fuchsia",
    tw_class: "bg-fuchsia-500 hover:bg-fuchsia-600 text-white",
  },
  {
    label: "pink",
    tw_class: "bg-pink-500 hover:bg-pink-600 text-white",
  },
  {
    label: "rose",
    tw_class: "bg-rose-500 hover:bg-rose-600 text-white",
  },
];
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
  const editor = useEditorStore();
  const empty = editor.blocks.length <= 0;

  if (empty) {
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
  }

  return (
    <div className="flex p-8 w-full justify-center items-center flex-col">
      <EditorGroup />
    </div>
  );
};
const EditorGroup = () => {
  const { blocks, theme, setBlocks, form } = useEditorStore();
  const currentPrimaryColor = buttonDesign.find((x) => x.label === theme.primary_color) ?? buttonDesign[0];

  const handleReorder = (newOrder: EBlock[]) => {
    const updatedBlocks = newOrder.map((block, index) => ({
      ...block,
      position: index + 1,
    }));
    setBlocks(updatedBlocks);
  };

  return (
    <div className="flex flex-col gap-8">
      <Reorder.Group
        axis="y"
        values={blocks}
        onReorder={handleReorder}
        className="flex flex-col sm:w-[600px] gap-6 w-full">
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
      <div className="flex justify-center items-center w-full">
        <Button className={`${currentPrimaryColor.tw_class} w-full`}>{form.submit_text}</Button>
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
