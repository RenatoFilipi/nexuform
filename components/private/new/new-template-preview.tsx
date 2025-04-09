"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import useUserStore from "@/stores/user";
import { minute } from "@/utils/constants";
import { EBlock, ETheme } from "@/utils/entities";
import { nanoid } from "@/utils/functions";
import { createClient } from "@/utils/supabase/client";
import { TAppState } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeftIcon, LoaderIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
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
  const router = useRouter();
  const [appState, setAppState] = useState<TAppState>("idle");
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const user = useUserStore();
  const [localBlocks, setLocalBlocks] = useState<EBlock[]>([]);

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

  const onCreate = async () => {
    try {
      const forms = await supabase
        .from("forms")
        .insert({
          name,
          owner_id: user.profile.id,
          public_url: nanoid(20, true, true),
          status: "draft",
          success_title: "Form Submitted Successfully!",
          success_description:
            "Thank you for submitting your form. We have received your information and will process it shortly.",
        })
        .select()
        .single();
      if (forms.error) throw new Error(forms.error.message);

      const theme = await supabase.from("themes").insert({ form_id: forms.data.id });
      if (theme.error) throw new Error(theme.error.message);
    } catch (error) {
      toast.error((error as Error).message || t("err_generic"));
    } finally {
      setAppState("idle");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="sm:h-[90%] min-w-[90%] overflow-y-auto p-0">
        <AlertDialogHeader className="hidden">
          <AlertDialogTitle></AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col w-full justify-start items-center h-full overflow-y-auto">
          <div className="flex justify-between items-center w-full p-4 border-b">
            <h1 className="font-medium">{name}</h1>
            <div className="flex justify-center items-center gap-4">
              <Button onClick={() => setOpen(false)} variant={"outline"} size={"sm"} disabled={appState === "loading"}>
                <ChevronLeftIcon className="w-4 h-4 mr-2" />
                {t("label_go_back")}
              </Button>
              <Button variant={"default"} size={"sm"} disabled={appState === "loading"} onClick={onCreate}>
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
              <div className="sm:w-[650px] w-full flex justify-center items-center flex-col gap-8 sm:px-8">
                <div className="flex flex-col justify-center items-center gap-14 w-full">
                  {data.blocks.map((block) => {
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
            </div>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default NewTemplatePreview;
