"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { minute } from "@/utils/constants";
import { EBlock, ETemplate_block, ETheme } from "@/utils/entities";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeftIcon, LoaderIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
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

const theme: ETheme = {
  id: "",
  form_id: "",
  created_at: "",
  updated_at: "",
  nebulaform_branding: false,
  numeric_blocks: false,
  primary_color: "slate",
  uppercase_block_name: false,
  width: "centered",
  custom_primary_color: "713AED",
};

const NewTemplatePreview = ({ children, id, name }: { children: React.ReactNode; id: string; name: string }) => {
  const t = useTranslations("app");
  const supabase = createClient();
  const [open, setOpen] = useState(false);

  const { data, isPending, isError } = useQuery({
    queryKey: ["templateBlocks", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("templates_blocks").select("*").eq("template_id", id);
      if (error) throw new Error(error.message);
      return { blocks: data };
    },
    staleTime: 60 * minute,
    gcTime: 60 * minute,
    refetchOnWindowFocus: false,
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:h-[90%] min-w-[90%] overflow-y-auto p-0">
        <DialogHeader className="hidden">
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col w-full justify-start items-center h-full overflow-y-auto">
          <div className="flex justify-between items-center w-full p-4 border-b">
            <h1 className="font-medium">{name}</h1>
            <div className="flex justify-center items-center gap-4">
              <Button onClick={() => setOpen(false)} variant={"outline"} size={"sm"}>
                <ChevronLeftIcon className="w-4 h-4 mr-2" />
                {t("label_go_back")}
              </Button>
              <Button variant={"default"} size={"sm"}>
                {t("label_use_template")}
              </Button>
            </div>
          </div>
          {isPending && (
            <div className="flex justify-center items-center flex-1">
              <LoaderIcon className="w-7 h-7 animate-spin" />
            </div>
          )}
          {isError && (
            <div className="flex justify-center items-center flex-1">
              <span>{t("err_generic")}</span>
            </div>
          )}
          {!isPending && !isError && (
            <div className="overflow-y-auto flex justify-center items-start w-full py-8 px-4 sm:px-0">
              <BlocksPreview blocks={data.blocks} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const BlocksPreview = ({ blocks }: { blocks: ETemplate_block[] }) => {
  return (
    <div className="sm:w-[650px] w-full flex justify-center items-center flex-col gap-8 sm:px-8">
      <div className="flex flex-col justify-center items-center gap-14 w-full">
        {blocks.map((block) => {
          const {
            created_at,
            description,
            id,
            is_identifier,
            max_char,
            max_date,
            max_scale,
            min_char,
            min_date,
            min_scale,
            name,
            options,
            placeholder,
            position,
            rating,
            required,
            show_char,
            type,
          } = block;
          const b: EBlock = {
            created_at,
            updated_at: "",
            name,
            description,
            form_id: "",
            id,
            is_identifier,
            max_char,
            max_date,
            max_scale,
            min_char,
            min_date,
            min_scale,
            options,
            placeholder,
            position,
            rating,
            required,
            show_char,
            type,
          };
          switch (block.type) {
            case "short_text":
              return <ShortTextDesign key={block.id} block={b} theme={theme} onValueChange={() => {}} />;
            case "paragraph_text":
              return <ParagraphTextDesign key={block.id} block={b} theme={theme} onValueChange={() => {}} />;
            case "checkboxes":
              return <CheckBoxesDesign key={block.id} block={b} theme={theme} onValueChange={() => {}} />;
            case "multiple_choice":
              return <MultipleChoiceDesign key={block.id} block={b} theme={theme} onValueChange={() => {}} />;
            case "dropdown_menu":
              return <DropdownMenuDesign key={block.id} block={b} theme={theme} onValueChange={() => {}} />;
            case "number_input":
              return <NumberInputDesign key={block.id} block={b} theme={theme} onValueChange={() => {}} />;
            case "email_address":
              return <EmailAddressDesign key={block.id} block={b} theme={theme} onValueChange={() => {}} />;
            case "star_rating":
              return <StarRatingDesign key={block.id} block={b} theme={theme} onValueChange={() => {}} />;
            case "custom_scale":
              return <CustomScaleDesign key={block.id} block={b} theme={theme} onValueChange={() => {}} />;
            case "date_picker":
              return <DatePickerDesign key={block.id} block={b} theme={theme} onValueChange={() => {}} />;
          }
        })}
      </div>
      <div className="flex justify-center items-center w-full">
        <Button className="w-full">Submit</Button>
      </div>
    </div>
  );
};

export default NewTemplatePreview;
