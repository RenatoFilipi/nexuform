"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { minWidth640 } from "@/helpers/constants";
import { uuid } from "@/helpers/functions";
import { setState } from "@/helpers/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMediaQuery } from "react-responsive";
import { z } from "zod";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../../ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "../../ui/drawer";
import { Input } from "../../ui/input";

const CreateForm = ({ children }: { children: React.ReactNode }) => {
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
  const router = useRouter();
  const formSchema = z.object({ name: z.string() });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    router.push(`/dashboard/editor/${uuid()}`);
  };

  return (
    <div className="flex flex-col gap-4 pt-4 sm:pt-0">
      <div className="flex flex-col gap-1 justify-center items-start">
        <h1 className="text-xl font-semibold">Create Form</h1>
        <p className="text-foreground/80 text-sm">
          Start by giving your form a name.
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex justify-end flex-col-reverse sm:flex-row items-center gap-2 sm:gap-4">
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
              Create Form
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateForm;
