import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useEditorStore from "@/stores/editor";
import useUserStore from "@/stores/user";
import { EBlock } from "@/utils/entities";
import { getBlockName } from "@/utils/functions";
import { TBlock } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { SettingsIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import BlockSettings from "../blocks/block-settings";
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

const EditorBlockGroup = () => {
  const editor = useEditorStore();

  return (
    <div className="flex flex-col gap-8 sm:w-[650px] w-full">
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
  );
};
const SW = ({ children, block }: { children: React.ReactNode; block: EBlock }) => {
  const user = useUserStore();
  const editor = useEditorStore();
  const [blockType, setBlockType] = useState("");

  const query = useQuery({
    queryKey: ["blockSettingsData", block.id],
    queryFn: async () => {
      setBlockType(await getBlockName(block.type as TBlock, user.locale));
      return null;
    },
    refetchOnWindowFocus: false,
  });

  if (query.isPending) return null;

  return (
    <Card className="p-2">
      <div className="flex justify-between items-center w-full">
        <div className="px-2">
          <Badge variant={"primary"} uppercase>
            {blockType}
          </Badge>
        </div>
        <div className="flex justify-center items-center">
          <BlockSettings block={block}>
            <Button variant={"ghost"} size={"icon"}>
              <SettingsIcon className="w-4 h-4" />
            </Button>
          </BlockSettings>
          <Button
            variant={"ghost"}
            size={"icon"}
            className="hover:text-destructive hover:bg-destructive/5 hidden"
            onClick={() => editor.removeBlock(block.id)}>
            <Trash2Icon className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex p-3">{children}</div>
    </Card>
  );
};

export default EditorBlockGroup;
