"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useEditorStore from "@/stores/editor";
import { minWidth640 } from "@/utils/constants";
import { EBlock } from "@/utils/entities";
import { uuid } from "@/utils/functions";
import { IBlockData } from "@/utils/interfaces";
import { TBlock, TSetState } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarIcon,
  CheckCircleIcon,
  CheckSquareIcon,
  ChevronDownIcon,
  EqualIcon,
  HashIcon,
  MailIcon,
  ScaleIcon,
  StarIcon,
  TextIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMedia } from "react-use";
import { z } from "zod";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "../../../ui/drawer";

const EditorAddBlock = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("app");
  const isDesktop = useMedia(minWidth640);
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogOverlay className="backdrop-blur-sm">
          <DialogContent className="flex flex-col min-w-[650px] h-[90%]">
            <DialogHeader>
              <DialogTitle>{t("label_blocks")}</DialogTitle>
              <DialogDescription>{t("desc_blocks")}</DialogDescription>
            </DialogHeader>
            <Body setState={setOpen} />
          </DialogContent>
        </DialogOverlay>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3 max-h-[90%]">
        <DrawerHeader>
          <DrawerTitle>{t("label_blocks")}</DrawerTitle>
          <DrawerDescription>{t("desc_blocks")}</DrawerDescription>
        </DrawerHeader>
        <Body setState={setOpen} />
      </DrawerContent>
    </Drawer>
  );
};
const Body = ({ setState }: { setState: TSetState<boolean> }) => {
  const t = useTranslations("app");
  const editor = useEditorStore();

  const categoryColors = {
    text: {
      bg: "bg-sky-50 dark:bg-sky-900/20",
      text: "text-sky-600 dark:text-sky-400",
      border: "border-sky-200 dark:border-sky-800",
      ring: "ring-sky-500/20 dark:ring-sky-400/30",
    },
    selection: {
      bg: "bg-violet-50 dark:bg-violet-900/20",
      text: "text-violet-600 dark:text-violet-400",
      border: "border-violet-200 dark:border-violet-800",
      ring: "ring-violet-500/20 dark:ring-violet-400/30",
    },
    numeric: {
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-200 dark:border-emerald-800",
      ring: "ring-emerald-500/20 dark:ring-emerald-400/30",
    },
    data: {
      bg: "bg-amber-50 dark:bg-amber-900/20",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-800",
      ring: "ring-amber-500/20 dark:ring-amber-400/30",
    },
    rating: {
      bg: "bg-rose-50 dark:bg-rose-900/20",
      text: "text-rose-600 dark:text-rose-400",
      border: "border-rose-200 dark:border-rose-800",
      ring: "ring-rose-500/20 dark:ring-rose-400/30",
    },
  };
  const blockList: IBlockData[] = [
    {
      type: "short_text",
      name: t("label_short_text"),
      icon: <EqualIcon className="w-4 h-4" />,
      enabled: true,
      description: t("desc_short_text"),
      category: "text",
    },
    {
      type: "paragraph_text",
      name: t("label_paragraph_text"),
      icon: <TextIcon className="w-4 h-4" />,
      enabled: true,
      description: t("desc_paragraph_text"),
      category: "text",
    },
    {
      type: "checkboxes",
      name: t("label_checkboxes"),
      icon: <CheckSquareIcon className="w-4 h-4" />,
      enabled: true,
      description: t("desc_checkboxes"),
      category: "selection",
    },
    {
      type: "multiple_choice",
      name: t("label_multiple_choice"),
      icon: <CheckCircleIcon className="w-4 h-4" />,
      enabled: true,
      description: t("desc_multiple_choice"),
      category: "selection",
    },
    {
      type: "dropdown_menu",
      name: t("label_dropdown_menu"),
      icon: <ChevronDownIcon className="w-4 h-4" />,
      enabled: true,
      description: t("desc_dropdown_menu"),
      category: "selection",
    },
    {
      type: "number_input",
      name: t("label_number_input"),
      icon: <HashIcon className="w-4 h-4" />,
      enabled: true,
      description: t("desc_number_input"),
      category: "numeric",
    },
    {
      type: "email_address",
      name: t("label_email_address"),
      icon: <MailIcon className="w-4 h-4" />,
      enabled: true,
      description: t("desc_email_address"),
      category: "data",
    },
    {
      type: "star_rating",
      name: t("label_star_rating"),
      icon: <StarIcon className="w-4 h-4" />,
      enabled: true,
      description: t("desc_star_rating"),
      category: "rating",
    },
    {
      type: "custom_scale",
      name: t("label_custom_scale"),
      icon: <ScaleIcon className="w-4 h-4" />,
      enabled: true,
      description: t("desc_custom_scale"),
      category: "rating",
    },
    {
      type: "date_picker",
      name: t("label_date_picker"),
      icon: <CalendarIcon className="w-4 h-4" />,
      enabled: true,
      description: t("desc_date_picker"),
      category: "data",
    },
  ];
  const groupedBlocks = blockList.reduce((acc, block) => {
    if (!block.enabled) return acc;

    if (!acc[block.category]) {
      acc[block.category] = [];
    }
    acc[block.category].push(block);
    return acc;
  }, {} as Record<string, IBlockData[]>);

  const categoryLabels = {
    text: t("label_category_text"),
    selection: t("label_category_selection"),
    numeric: t("label_category_numeric"),
    data: t("label_category_data"),
    rating: t("label_category_rating"),
  };
  const formSchema = z.object({
    block: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      block: "",
    },
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const blockType = values.block as TBlock;

    const targetBlock = blockList.find((x) => x.type === blockType);
    if (targetBlock === undefined) return;

    const block: EBlock = {
      id: uuid(),
      form_id: editor.form.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      name: targetBlock.name,
      description: "",
      options: null,
      required: true,
      type: blockType,
      placeholder: null,
      max_char: 100,
      min_char: 1,
      show_char: null,
      position: editor.blocks.length + 1,
      rating: null,
      max_scale: null,
      min_scale: null,
      is_identifier: false,
      min_date: null,
      max_date: null,
    };
    editor.addBlock(block);
    editor.setBlockView(block);
    editor.setToolView("block");
    setState(false);
  };

  return (
    <div className="flex flex-col h-dvh flex-1 overflow-y-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 h-full overflow-y-auto">
          <div className="flex flex-col gap-4 overflow-y-auto h-full">
            <FormField
              control={form.control}
              name="block"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <RadioGroup
                      className="flex flex-col overflow-y-auto gap-2 sm:mr-2"
                      value={field.value}
                      onValueChange={field.onChange}>
                      {Object.entries(groupedBlocks).map(([category, blocks]) => (
                        <div key={category} className="flex flex-col gap-2">
                          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            {categoryLabels[category as keyof typeof categoryLabels]}
                          </h3>
                          <div className="flex flex-col gap-1">
                            {blocks.map((block, index) => (
                              <div key={index} className="">
                                <RadioGroupItem value={block.type} id={block.type} className="peer sr-only" />
                                <Label
                                  htmlFor={block.type}
                                  className="text-sm cursor-pointer flex items-center justify-start gap-2.5 rounded border border-transparent p-2 hover:bg-foreground/5 hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary">
                                  <div
                                    className={`p-2 flex justify-center items-center rounded ${
                                      categoryColors[block.category as keyof typeof categoryColors].bg
                                    } ${categoryColors[block.category as keyof typeof categoryColors].text}`}>
                                    {block.icon}
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <span className="text-sm">{block.name}</span>
                                    <p className="text-xs text-muted-foreground font-normal">{block.description}</p>
                                  </div>
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-between items-center gap-4 sm:flex-row flex-col-reverse">
            <Button
              onClick={() => setState(false)}
              type="button"
              variant={"outline"}
              size={"sm"}
              className="w-full sm:w-fit">
              {t("label_cancel")}
            </Button>
            <Button type="submit" variant={"secondary"} size={"sm"} className="w-full sm:w-fit">
              {t("label_add_block")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default EditorAddBlock;
