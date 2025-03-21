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
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "../../ui/drawer";

const AddBlock = ({ children, formId }: { children: React.ReactNode; formId: string }) => {
  const t = useTranslations("app");
  const isDesktop = useMedia(minWidth640);
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="flex flex-col min-w-[650px] h-[600px]">
          <DialogHeader>
            <DialogTitle>{t("label_blocks")}</DialogTitle>
            <DialogDescription>{t("desc_blocks")}</DialogDescription>
          </DialogHeader>
          <Body setState={setOpen} formId={formId} />
        </DialogContent>
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
        <Body setState={setOpen} formId={formId} />
      </DrawerContent>
    </Drawer>
  );
};

const Body = ({ setState, formId }: { setState: TSetState<boolean>; formId: string }) => {
  const t = useTranslations("app");
  const { addBlock, blocks } = useEditorStore();

  const blockList: IBlockData[] = [
    {
      type: "short_text",
      name: t("label_short_text"),
      icon: <EqualIcon className="w-4 h-4" />,
      enabled: true,
      description: t("desc_short_text"),
    },
    {
      type: "paragraph_text",
      name: t("label_paragraph_text"),
      icon: <TextIcon className="w-4 h-4" />,
      enabled: true,
      description: t("desc_paragraph_text"),
    },
    {
      type: "checkboxes",
      name: t("label_checkboxes"),
      icon: <CheckSquareIcon className="w-4 h-4" />,
      enabled: true,
      description: t("desc_checkboxes"),
    },
    {
      type: "multiple_choice",
      name: t("label_multiple_choice"),
      icon: <CheckCircleIcon className="w-4 h-4" />,
      enabled: true,
      description: t("desc_multiple_choice"),
    },
    {
      type: "dropdown_menu",
      name: t("label_dropdown_menu"),
      icon: <ChevronDownIcon className="w-4 h-4" />,
      enabled: true,
      description: t("desc_dropdown_menu"),
    },
    {
      type: "number_input",
      name: t("label_number_input"),
      icon: <HashIcon className="w-4 h-4" />,
      enabled: true,
      description: t("desc_number_input"),
    },
    {
      type: "email_address",
      name: t("label_email_address"),
      icon: <MailIcon className="w-4 h-4" />,
      enabled: true,
      description: t("desc_email_address"),
    },
    {
      type: "star_rating",
      name: t("label_star_rating"),
      icon: <StarIcon className="w-4 h-4" />,
      enabled: true,
      description: t("desc_star_rating"),
    },
    {
      type: "custom_scale",
      name: t("label_custom_scale"),
      icon: <ScaleIcon className="w-4 h-4" />,
      enabled: true,
      description: t("desc_custom_scale"),
    },
    {
      type: "date_picker",
      name: t("label_date_picker"),
      icon: <CalendarIcon className="w-4 h-4" />,
      enabled: true,
      description: t("desc_date_picker"),
    },
  ];

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
      form_id: formId,
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
      position: blocks.length + 1,
      rating: null,
      max_scale: null,
      min_scale: null,
      is_identifier: false,
      min_date: null,
      max_date: null,
    };
    addBlock(block);
    setState(false);
  };

  return (
    <div className="flex flex-col h-dvh flex-1 overflow-y-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 h-full overflow-y-auto">
          <div className="flex flex-col gap-4 overflow-y-auto h-full pr-4">
            <FormField
              control={form.control}
              name="block"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <RadioGroup
                      className="flex flex-col overflow-y-auto"
                      value={field.value}
                      onValueChange={field.onChange}>
                      {blockList.map((block, index) => {
                        if (block.enabled)
                          return (
                            <div key={index}>
                              <RadioGroupItem value={block.type} id={block.type} className="peer sr-only" />
                              <Label
                                htmlFor={block.type}
                                className="text-sm cursor-pointer flex items-center justify-start gap-4 rounded border border-muted bg-popover p-3 hover:bg-primary/5 hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary">
                                <div className="p-2 flex justify-center items-center bg-primary/10 rounded text-primary">
                                  {block.icon}
                                </div>
                                <div className="flex flex-col gap-1">
                                  <span className="">{block.name}</span>
                                  <p className="text-xs text-foreground/70 font-normal">{block.description}</p>
                                </div>
                              </Label>
                            </div>
                          );
                      })}
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

export default AddBlock;
