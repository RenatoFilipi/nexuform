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
import { EBlock, ETemplate, ETheme } from "@/utils/entities";
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

const defaultTheme: ETheme = {
  id: "",
  form_id: "",
  created_at: "",
  updated_at: "",
  nebulaform_branding: false,
  numeric_blocks: false,
  primary_color: "slate",
  uppercase_block_name: false,
  width: "centered",
  custom_primary_color: "#713AED",
};
const NewPreview = ({ children, template }: { children: React.ReactNode; template: ETemplate }) => {
  const t = useTranslations("app");
  const [open, setOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const user = useUserStore();
  const [appState, setAppState] = useState<TAppState>("idle");
  const [localBlocks, setLocalBlocks] = useState<EBlock[]>([]);

  const query = useQuery({
    queryKey: ["templateBlocks", template.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("templates_blocks").select("*").eq("template_id", template.id);
      if (error) throw error;
      const blocks: EBlock[] = data.map((x) => {
        return {
          created_at: x.created_at,
          description: x.description,
          form_id: "",
          id: x.id,
          is_identifier: x.is_identifier,
          max_char: x.max_char,
          max_date: x.max_date,
          max_scale: x.max_scale,
          min_char: x.min_char,
          min_date: x.min_date,
          min_scale: x.min_scale,
          name: x.name,
          options: x.options,
          placeholder: x.placeholder,
          position: x.position,
          rating: x.rating,
          required: x.required,
          show_char: x.show_char,
          type: x.type,
          updated_at: x.created_at,
        };
      });
      setLocalBlocks(blocks);
      return { blocks };
    },
    staleTime: 60 * minute,
    refetchOnWindowFocus: false,
    enabled: open,
  });
  const onCreate = async () => {
    try {
      setAppState("loading");
      const forms = await supabase
        .from("forms")
        .insert([
          { name: template.name, description: "", owner_id: user.profile.id, public_url: nanoid(20, true, true) },
        ])
        .select("*")
        .single();

      if (forms.error) {
        toast.error(t("err_generic"));
        return;
      }
      const themes = await supabase
        .from("themes")
        .insert([{ form_id: forms.data.id }])
        .select("*")
        .single();

      if (themes.error) {
        await supabase.from("forms").delete().eq("id", forms.data.id);
        toast.error(t("err_generic"));
        return;
      }

      const updatedBlocks: EBlock[] = localBlocks.map((b) => {
        return { ...b, form_id: forms.data.id };
      });

      const blocks = await supabase.from("blocks").insert(updatedBlocks);
      if (blocks.error) {
        await supabase.from("forms").delete().eq("id", forms.data.id);
        await supabase.from("themes").delete().eq("id", themes.data.id);
        toast.error(t("err_generic"));
      }

      toast.success(t("suc_form_create"));
      router.push(`/dashboard/editor/${forms.data.id}`);
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
            <h1 className="font-medium">{template.name}</h1>
            <div className="flex justify-center items-center gap-4">
              <Button onClick={() => setOpen(false)} variant={"outline"} size={"sm"} disabled={appState === "loading"}>
                <ChevronLeftIcon className="w-4 h-4 mr-2" />
                {t("label_go_back")}
              </Button>
              <Button variant={"default"} size={"sm"} disabled={appState === "loading"} onClick={onCreate}>
                {appState === "loading" && <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />}
                {t("label_use_template")}
              </Button>
            </div>
          </div>
          {query.isPending && (
            <div className="flex justify-center items-center flex-1">
              <LoaderIcon className="w-7 h-7 animate-spin" />
            </div>
          )}
          {query.isError && (
            <div className="flex justify-center items-center flex-1">
              <span>{t("err_generic")}</span>
            </div>
          )}
          {!query.isPending && !query.isError && query.data && (
            <div className="overflow-y-auto flex justify-center items-start w-full py-8 px-4 sm:px-0">
              <div className="sm:w-[650px] w-full flex justify-center items-center flex-col gap-8 sm:px-8">
                <BlocksGroup blocks={query.data.blocks} />
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

const BlocksGroup = ({ blocks }: { blocks: EBlock[] }) => {
  return (
    <div className="flex flex-col justify-center items-center gap-14 w-full">
      {blocks.map((block) => {
        switch (block.type) {
          case "short_text":
            return <ShortTextDesign key={block.id} block={block} theme={defaultTheme} onValueChange={() => {}} />;
          case "paragraph_text":
            return <ParagraphTextDesign key={block.id} block={block} theme={defaultTheme} onValueChange={() => {}} />;
          case "checkboxes":
            return <CheckBoxesDesign key={block.id} block={block} theme={defaultTheme} onValueChange={() => {}} />;
          case "multiple_choice":
            return <MultipleChoiceDesign key={block.id} block={block} theme={defaultTheme} onValueChange={() => {}} />;
          case "dropdown_menu":
            return <DropdownMenuDesign key={block.id} block={block} theme={defaultTheme} onValueChange={() => {}} />;
          case "number_input":
            return <NumberInputDesign key={block.id} block={block} theme={defaultTheme} onValueChange={() => {}} />;
          case "email_address":
            return <EmailAddressDesign key={block.id} block={block} theme={defaultTheme} onValueChange={() => {}} />;
          case "star_rating":
            return <StarRatingDesign key={block.id} block={block} theme={defaultTheme} onValueChange={() => {}} />;
          case "custom_scale":
            return <CustomScaleDesign key={block.id} block={block} theme={defaultTheme} onValueChange={() => {}} />;
          case "date_picker":
            return <DatePickerDesign key={block.id} block={block} theme={defaultTheme} onValueChange={() => {}} />;
        }
      })}
    </div>
  );
};

export default NewPreview;
