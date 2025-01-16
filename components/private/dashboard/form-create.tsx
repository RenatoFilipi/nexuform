"use client";

import { createFormAction } from "@/app/actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { minWidth640 } from "@/utils/constants";
import { setState } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useQueryState } from "nuqs";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useMedia } from "react-use";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../ui/drawer";
import { Input } from "../../ui/input";

const FormCreate = ({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string;
}) => {
  const [error] = useQueryState("error");
  const isDesktop = useMedia(minWidth640);
  const [open, setOpen] = useState(false);

  useQuery({
    queryKey: [error],
    queryFn: () => {
      if (error !== null) {
        toast.error(error);
      }
      return null;
    },
    refetchOnWindowFocus: false,
  });

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="flex flex-col">
          <DialogHeader>
            <DialogTitle>Create New Form</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new form. You can customize
              the settings as needed.
            </DialogDescription>
          </DialogHeader>
          <Body setState={setOpen} userId={userId} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3 flex flex-col">
        <DrawerHeader>
          <DrawerTitle>Create New Form</DrawerTitle>
          <DrawerDescription>
            Fill in the details below to create a new form. You can customize
            the settings as needed.
          </DrawerDescription>
        </DrawerHeader>
        <Body setState={setOpen} userId={userId} />
      </DrawerContent>
    </Drawer>
  );
};

const Body = ({
  setState,
  userId,
}: {
  setState: setState<boolean>;
  userId: string;
}) => {
  const [isPending, startTransition] = useTransition();

  const formSchema = z.object({
    name: z.string().min(3, "Name must contain at least 3 letters."),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { name } = values;
    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("userId", userId);
      await createFormAction(formData);
    });
  };

  return (
    <div className="flex flex-col gap-4 pt-4 sm:pt-0">
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
                <FormMessage />
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
              {isPending ? (
                <Loader2Icon className="animate-spin w-4 h-4" />
              ) : (
                "Create New Form"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormCreate;
