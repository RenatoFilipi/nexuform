import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useEditorStore from "@/stores/editor";
import { EBlock } from "@/utils/entities";
import { blockName } from "@/utils/functions";
import { TBlock } from "@/utils/types";
import { SettingsIcon } from "lucide-react";
import BlockSettings from "../../blocks/block-settings";
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

const EditorBlockGroup = () => {
  const editor = useEditorStore();

  return (
    <div className="flex justify-center items-start w-full h-full">
      <div className="flex flex-col gap-4">
        {editor.blocks.map((block) => {
          switch (block.type) {
            case "short_text":
              return (
                <SW block={block} key={block.id}>
                  <ShortTextDesign block={block} theme={editor.theme} onValueChange={() => {}} />
                </SW>
              );
            case "paragraph_text":
              return (
                <SW block={block} key={block.id}>
                  <ParagraphTextDesign key={block.id} block={block} theme={editor.theme} onValueChange={() => {}} />
                </SW>
              );
            case "multiple_choice":
              return (
                <SW block={block} key={block.id}>
                  <MultipleChoiceDesign key={block.id} block={block} theme={editor.theme} onValueChange={() => {}} />
                </SW>
              );
            case "checkboxes":
              return (
                <SW block={block} key={block.id}>
                  <CheckBoxesDesign key={block.id} block={block} theme={editor.theme} onValueChange={() => {}} />
                </SW>
              );
            case "dropdown_menu":
              return (
                <SW block={block} key={block.id}>
                  <DropdownMenuDesign key={block.id} block={block} theme={editor.theme} onValueChange={() => {}} />
                </SW>
              );
            case "number_input":
              return (
                <SW block={block} key={block.id}>
                  <NumberInputDesign key={block.id} block={block} theme={editor.theme} onValueChange={() => {}} />
                </SW>
              );
            case "email_address":
              return (
                <SW block={block} key={block.id}>
                  <EmailAddressDesign key={block.id} block={block} theme={editor.theme} onValueChange={() => {}} />
                </SW>
              );
            case "star_rating":
              return (
                <SW block={block} key={block.id}>
                  <StarRatingDesign key={block.id} block={block} theme={editor.theme} onValueChange={() => {}} />
                </SW>
              );
            case "custom_scale":
              return (
                <SW block={block} key={block.id}>
                  <CustomScaleDesign key={block.id} block={block} theme={editor.theme} onValueChange={() => {}} />
                </SW>
              );
            case "date_picker":
              return (
                <SW block={block} key={block.id}>
                  <DatePickerDesign key={block.id} block={block} theme={editor.theme} onValueChange={() => {}} />
                </SW>
              );
          }
        })}
      </div>
    </div>
  );
};

const SW = ({ children, block }: { children: React.ReactNode; block: EBlock }) => {
  return (
    <Card className="p-2">
      <div className="flex justify-between items-center w-full">
        <div className="px-2">
          <Badge variant={"primary"} uppercase>
            {blockName(block.type as TBlock)}
          </Badge>
        </div>
        <div className="flex justify-center items-center">
          <BlockSettings block={block}>
            <Button variant={"ghost"} size={"icon"}>
              <SettingsIcon className="w-4 h-4" />
            </Button>
          </BlockSettings>
        </div>
      </div>
      <div className="flex p-3">{children}</div>
    </Card>
  );
};

export default EditorBlockGroup;
