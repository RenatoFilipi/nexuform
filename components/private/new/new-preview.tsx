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
import { nanoid, uuid } from "@/utils/functions";
import { createClient } from "@/utils/supabase/client";
import { TAppState, TBlock } from "@/utils/types";
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
const NewPreview = ({ children, template }: { children: React.ReactNode; template: ETemplate }) => {
  const t = useTranslations("app");
  const [open, setOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const user = useUserStore();
  const [appState, setAppState] = useState<TAppState>("idle");

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
      return { blocks, template };
    },
    staleTime: 60 * minute,
    enabled: open,
  });
  const onCreate = async () => {
    try {
      if (query.isPending || query.isError || !query.data) return;
      setAppState("loading");

      const forms = await supabase
        .from("forms")
        .insert([
          {
            id: uuid(),
            name: template.name,
            description: "",
            owner_id: user.profile.id,
            public_url: nanoid(20, true, true),
          },
        ])
        .select("*")
        .single();

      if (forms.error) {
        console.log("FORMS");
        console.log(forms.error);
        toast.error(t("err_generic"));
        return;
      }
      const themes = await supabase
        .from("themes")
        .insert([{ form_id: forms.data.id }])
        .select("*")
        .single();

      if (themes.error) {
        console.log("THEMES");
        console.log(themes.error);
        await supabase.from("forms").delete().eq("id", forms.data.id);
        toast.error(t("err_generic"));
        return;
      }

      const updatedBlocks: EBlock[] = query.data.blocks.map((block) => {
        return { ...block, form_id: forms.data.id, id: uuid() };
      });

      const blocks = await supabase.from("blocks").insert(updatedBlocks);
      if (blocks.error) {
        console.log(forms.data);
        await supabase.from("forms").delete().eq("id", forms.data.id);
        await supabase.from("themes").delete().eq("id", themes.data.id);
        console.log("BLOCKS");
        console.log(blocks.error);
        toast.error(t("err_generic"));
        return;
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
      <AlertDialogContent className="h-dvh min-w-[100%] overflow-y-auto p-0 border-transparent">
        <AlertDialogHeader className="hidden">
          <AlertDialogTitle></AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col w-full justify-start items-center h-full overflow-y-auto">
          <div className="flex justify-between items-center w-full p-4">
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
            <BlocksGroup template={query.data.template} blocks={query.data.blocks} />
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
const BlocksGroup = ({ blocks, template }: { blocks: EBlock[]; template: ETemplate }) => {
  return (
    <div className="flex w-full border h-full overflow-y-auto justify-center items-start px-4 sm:px-0">
      <div className="flex flex-col gap-6 w-full py-10 overflow-y-auto sm:w-[650px] px-1">
        <div className="flex flex-col gap-2 justify-center items-start">
          <h1 className="text-2xl font-bold">{template.name}</h1>
        </div>
        <div className="flex flex-col gap-2 w-full">
          {blocks.map((block) => {
            const Component = COMPONENT_MAP[block.type as TBlock];
            if (!Component) return null;
            return (
              <div className="py-3" key={block.id}>
                <Component block={block} theme={defaultTheme} onValueChange={() => {}} />
              </div>
            );
          })}
        </div>
        <div className="flex justify-center items-center w-full flex-col gap-6">
          <button
            style={{ backgroundColor: defaultTheme.custom_primary_color }}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 text-white w-full">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewPreview;
