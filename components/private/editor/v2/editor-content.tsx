import { Button } from "@/components/ui/button";
import useEditorStore from "@/stores/editor";
import { EBlock, ETheme } from "@/utils/entities";
import { TBlock } from "@/utils/types";
import { PlusIcon, SettingsIcon } from "lucide-react";
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
    <div className="flex p-8 w-full justify-center items-center">
      <EditorGroup />
    </div>
  );
};
const EditorGroup = () => {
  const { blocks, theme } = useEditorStore();

  return (
    <div className="flex flex-col sm:w-[600px] gap-6 w-full">
      {blocks.map((block) => {
        const Component = COMPONENT_MAP[block.type as TBlock];
        if (!Component) return null;
        return (
          <BlockWrapper key={block.id} block={block}>
            <Component block={block} theme={theme} onValueChange={() => {}} />
          </BlockWrapper>
        );
      })}
    </div>
  );
};
const BlockWrapper = ({ children, block }: { children: React.ReactNode; block: EBlock }) => {
  return (
    <div key={block.id} className="flex w-full">
      {children}
    </div>
  );
};

export default EditorContent;
