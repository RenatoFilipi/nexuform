"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useEditorStore from "@/stores/editor";
import { minWidth640 } from "@/utils/constants";
import { EBlock } from "@/utils/entities";
import { uuid } from "@/utils/functions";
import { addBlockProps } from "@/utils/interfaces";
import { block, setState } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMediaQuery } from "react-responsive";
import { z } from "zod";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../ui/drawer";

const blockList: addBlockProps[] = [
  {
    type: "short_text",
    name: "Short Text",
    icon: <EqualIcon className="w-4 h-4" />,
    enabled: true,
    description: "A single-line input field for brief text responses.",
  },
  {
    type: "paragraph_text",
    name: "Paragraph Text",
    icon: <TextIcon className="w-4 h-4" />,
    enabled: true,
    description: "A multi-line input field for detailed text responses.",
  },
  {
    type: "checkboxes",
    name: "Checkboxes",
    icon: <CheckSquareIcon className="w-4 h-4" />,
    enabled: true,
    description: "Allows the selection of multiple options from a list.",
  },
  {
    type: "multiple_choice",
    name: "Multiple Choice",
    icon: <CheckCircleIcon className="w-4 h-4" />,
    enabled: true,
    description: "Allows the selection of a single option from a list.",
  },
  {
    type: "dropdown_menu",
    name: "Dropdown Menu",
    icon: <ChevronDownIcon className="w-4 h-4" />,
    enabled: true,
    description: "A collapsible menu for selecting a single option.",
  },
  {
    type: "number_input",
    name: "Number Input",
    icon: <HashIcon className="w-4 h-4" />,
    enabled: true,
    description: "An input field specifically for numeric values.",
  },
  {
    type: "email_address",
    name: "Email Address",
    icon: <MailIcon className="w-4 h-4" />,
    enabled: true,
    description: "An input field for capturing valid email addresses.",
  },
  {
    type: "star_rating",
    name: "Star Rating",
    icon: <StarIcon className="w-4 h-4" />,
    enabled: true,
    description: "A scale for rating, typically displayed as stars.",
  },
  {
    type: "custom_scale",
    name: "Custom Scale",
    icon: <ScaleIcon className="w-4 h-4" />,
    enabled: true,
    description: "A range-based scale for responses, such as 1–10.",
  },
];

const AddBlock = ({
  children,
  formId,
}: {
  children: React.ReactNode;
  formId: string;
}) => {
  const isDesktop = useMediaQuery({ query: minWidth640 });
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="flex flex-col min-w-[450px]">
          <SheetHeader>
            <SheetTitle>Blocks</SheetTitle>
            <SheetDescription>
              Select and add new block to your form. Customize each block to
              suit your needs and enhance the user experience.
            </SheetDescription>
          </SheetHeader>
          <Body setState={setOpen} formId={formId} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3">
        <DrawerHeader>
          <DrawerTitle>Blocks</DrawerTitle>
          <DrawerDescription>
            Select and add new block to your form. Customize each block to suit
            your needs and enhance the user experience.
          </DrawerDescription>
        </DrawerHeader>
        <Body setState={setOpen} formId={formId} />
      </DrawerContent>
    </Drawer>
  );
};

const Body = ({
  setState,
  formId,
}: {
  setState: setState<boolean>;
  formId: string;
}) => {
  const { addBlock, blocks } = useEditorStore();

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
    const blockType = values.block as block;

    const targetBlock = blockList.find((x) => x.type === blockType);
    if (targetBlock === undefined) return;

    const block: EBlock = {
      id: uuid(),
      form_id: formId,
      created_at: "",
      updated_at: "",
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
    };
    addBlock(block);
    setState(false);
  };

  return (
    <div className="flex flex-col h-screen flex-1 overflow-y-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6 h-full overflow-y-auto">
          <div className="flex flex-col gap-4 overflow-y-auto h-full">
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
                              <RadioGroupItem
                                value={block.type}
                                id={block.type}
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor={block.type}
                                className="text-sm cursor-pointer flex items-center justify-start gap-2 rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 [&:has([data-state=checked])]:border-primary">
                                <div className="p-2 flex justify-center items-center bg-primary/10 rounded">
                                  {block.icon}
                                </div>
                                <div className="flex flex-col gap-1">
                                  <span className="font-medium">
                                    {block.name}
                                  </span>
                                  <p className="text-xs text-foreground/60 hidden">
                                    {block.description}
                                  </p>
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
          <div className="flex justify-end items-center gap-4 sm:flex-row flex-col-reverse">
            <Button
              onClick={() => setState(false)}
              type="button"
              variant={"outline"}
              size={"sm"}
              className="w-full sm:w-fit">
              Cancel
            </Button>
            <Button
              type="submit"
              variant={"default"}
              size={"sm"}
              className="w-full sm:w-fit">
              Add New Block
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddBlock;
