"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { minWidth640 } from "@/helpers/constants";
import { uuid } from "@/helpers/functions";
import { block, setState } from "@/helpers/types";
import { BlockProps } from "@/models/form";
import useEditorStore from "@/stores/editor";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircleIcon,
  CheckSquareIcon,
  ChevronDownIcon,
  HashIcon,
  MailIcon,
  MinusIcon,
  ScaleIcon,
  StarIcon,
  TextIcon,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMediaQuery } from "react-responsive";
import { z } from "zod";
import { Drawer, DrawerContent, DrawerTrigger } from "../../ui/drawer";

interface addBlockProps {
  type: block;
  label: string;
  icon: JSX.Element | null;
}
const blocks: addBlockProps[] = [
  {
    type: "short_answer",
    label: "Short answer",
    icon: <MinusIcon className="w-4 h-4" />,
  },
  {
    type: "long_answer",
    label: "Long answer",
    icon: <TextIcon className="w-4 h-4" />,
  },
  {
    type: "multiple_choice",
    label: "Multiple choice",
    icon: <CheckSquareIcon className="w-4 h-4" />,
  },
  {
    type: "checkboxes",
    label: "Checkboxes",
    icon: <CheckCircleIcon className="w-4 h-4" />,
  },
  {
    type: "dropdown",
    label: "Dropdown",
    icon: <ChevronDownIcon className="w-4 h-4" />,
  },
  { type: "number", label: "Number", icon: <HashIcon className="w-4 h-4" /> },
  { type: "email", label: "Email", icon: <MailIcon className="w-4 h-4" /> },
  { type: "rating", label: "Rating", icon: <StarIcon className="w-4 h-4" /> },
  { type: "scale", label: "Scale", icon: <ScaleIcon className="w-4 h-4" /> },
];

const AddBlock = ({ children }: { children: React.ReactNode }) => {
  const isDesktop = useMediaQuery({ query: minWidth640 });
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <Body setState={setOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3">
        <Body setState={setOpen} />
      </DrawerContent>
    </Drawer>
  );
};

const Body = ({ setState }: { setState: setState<boolean> }) => {
  const { addBlock } = useEditorStore();

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

    const targetBlock = blocks.find((x) => x.type === blockType);
    if (targetBlock === undefined) return;

    const block: BlockProps = {
      id: uuid(),
      label: targetBlock.label,
      description: "",
      options: null,
      required: true,
      type: blockType,
      placeholder: null,
      max_character_limit: null,
      show_character_limit: null,
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
                    className="grid gap-2"
                    value={field.value}
                    onValueChange={field.onChange}>
                    {blocks.map((block, index) => {
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
                            {block.label}
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
              variant={"secondary"}
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
