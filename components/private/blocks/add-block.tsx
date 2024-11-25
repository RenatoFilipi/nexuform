"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { minWidth640 } from "@/helpers/constants";
import { uuid } from "@/helpers/functions";
import { addBlockProps } from "@/helpers/interfaces";
import { block, setState } from "@/helpers/types";
import { BlockModel } from "@/models/form";
import useEditorStore from "@/stores/editor";
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
import { Drawer, DrawerContent, DrawerTrigger } from "../../ui/drawer";

const blockList: addBlockProps[] = [
  {
    type: "short_answer",
    name: "Short answer",
    icon: <EqualIcon className="w-4 h-4" />,
    enabled: true,
    description: "A single-line input field for short text responses.",
  },
  {
    type: "long_answer",
    name: "Long answer",
    icon: <TextIcon className="w-4 h-4" />,
    enabled: true,
    description: "A multi-line input field for longer text responses.",
  },
  {
    type: "multiple_choice",
    name: "Multiple choice",
    icon: <CheckSquareIcon className="w-4 h-4" />,
    enabled: true,
    description: "Allows selection of one option from a list of choices.",
  },
  {
    type: "checkboxes",
    name: "Checkboxes",
    icon: <CheckCircleIcon className="w-4 h-4" />,
    enabled: true,
    description: "Enables selection of multiple options from a list.",
  },
  {
    type: "dropdown",
    name: "Dropdown",
    icon: <ChevronDownIcon className="w-4 h-4" />,
    enabled: true,
    description: "A dropdown menu for selecting one option from many.",
  },
  {
    type: "number",
    name: "Number",
    icon: <HashIcon className="w-4 h-4" />,
    enabled: true,
    description: "An input field specifically for numerical entries.",
  },
  {
    type: "email",
    name: "Email",
    icon: <MailIcon className="w-4 h-4" />,
    enabled: true,
    description: "Input field designed for capturing email addresses.",
  },
  {
    type: "rating",
    name: "Rating",
    icon: <StarIcon className="w-4 h-4" />,
    enabled: true,
    description: "A rating scale, typically using stars or numbers.",
  },
  {
    type: "scale",
    name: "Scale",
    icon: <ScaleIcon className="w-4 h-4" />,
    enabled: true,
    description: "A custom scale allowing responses across a set range.",
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
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <Body setState={setOpen} formId={formId} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3">
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

    const block: BlockModel = {
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
      max_character_limit: 100,
      min_character_limit: 1,
      show_character_limit: null,
      position: blocks.length + 1,
      max_rating: null,
      max_scale: null,
    };
    addBlock(block);
    setState(false);
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <h1 className="text-xl font-semibold">Blocks</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6 h-full">
          <FormField
            control={form.control}
            name="block"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    className="grid gap-2 "
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
                              {block.icon}
                              <span>{block.name}</span>
                            </Label>
                          </div>
                        );
                    })}
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
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
              Add Block
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddBlock;
