"use client";

import { createFormAction } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import useUserStore from "@/stores/user";
import { minWidth640 } from "@/utils/constants";
import { FormTemplates } from "@/utils/form-templates";
import { nanoid, uuid } from "@/utils/functions";
import { createClient } from "@/utils/supabase/client";
import { TAppState, TSetState } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeftIcon, HexagonIcon, Loader2Icon, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useMedia } from "react-use";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "../../ui/drawer";
import { Input } from "../../ui/input";

type TView = "custom" | "templates" | "none";

const options = [
  {
    title: "Custom",
    description: "Start a new form from the ground up, tailored to your needs.",
    type: "custom",
    icon: PlusIcon,
    enabled: true,
  },
  {
    title: "Templates",
    description: "Choose from a variety of pre-designed templates to jumpstart your form creation.",
    type: "templates",
    icon: HexagonIcon,
    enabled: true,
  },
];

const DashboardNewForm = ({ children, userId }: { children: React.ReactNode; userId: string }) => {
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
        <DialogContent className="flex flex-col min-w-[650px] h-[600px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Form</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new form. You can customize the settings as needed.
            </DialogDescription>
          </DialogHeader>
          <Body setState={setOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3 flex flex-col max-h-[90%]">
        <DrawerHeader>
          <DrawerTitle>Create Form</DrawerTitle>
          <DrawerDescription>
            Fill in the details below to create a new form. You can customize the settings as needed.
          </DrawerDescription>
        </DrawerHeader>
        <Body setState={setOpen} />
      </DrawerContent>
    </Drawer>
  );
};
const Body = ({ setState }: { setState: TSetState<boolean> }) => {
  const [view, setView] = useState<TView>("none");

  if (view === "custom") return <CustomForm setState={setState} setView={setView} />;
  if (view === "templates") return <TemplateForm setState={setState} setView={setView} />;
  return <PreSelectForm setState={setState} setView={setView} />;
};
const PreSelectForm = ({ setState, setView }: { setState: TSetState<boolean>; setView: TSetState<TView> }) => {
  return (
    <div className="pt-4 sm:pt-0 flex flex-col h-full gap-6">
      <div className="flex flex-col justify-center items-center gap-6 w-full h-full">
        {options.map((opt) => {
          return (
            <button
              key={opt.type}
              onClick={() => setView(opt.type as TView)}
              className="flex flex-col justify-center items-center border w-full h-full gap-4 hover:bg-primary/5 p-6">
              <div className="flex justify-center items-center p-2 bg-primary/10 rounded">
                <opt.icon className="w-8 h-8 text-primary" />
              </div>
              <div className="flex flex-col justify-center items-center">
                <h1 className="text-lg font-medium">{opt.title}</h1>
                <p className="text-sm text-foreground/70">{opt.description}</p>
              </div>
            </button>
          );
        })}
      </div>
      <div className="flex justify-end items-center gap-2 flex-col sm:flex-row">
        <Button onClick={() => setState(false)} variant={"outline"} size={"sm"} className="w-full sm:w-fit">
          Close
        </Button>
      </div>
    </div>
  );
};
const CustomForm = ({ setState, setView }: { setState: TSetState<boolean>; setView: TSetState<TView> }) => {
  const [isPending, startTransition] = useTransition();
  const { profile } = useUserStore();

  const formSchema = z.object({
    name: z.string().min(3, "Name must contain at least 3 letters."),
    description: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { name, description } = values;
    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("userId", profile.id);
      await createFormAction(formData);
    });
  };

  return (
    <div className="flex flex-col gap-4 pt-4 sm:pt-0 h-full w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 h-full">
          <div className="flex flex-col gap-8 h-full">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div className="grid gap-1">
                    <FormLabel className="font-semibold">Name</FormLabel>
                    <p className="text-xs text-foreground/70">
                      Provide a unique name for your form to identify it easily.
                    </p>
                  </div>
                  <FormControl>
                    <Input type="text" {...field} placeholder="Enter form name" className="text-sm" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div className="grid gap-1">
                    <FormLabel className="font-semibold">Description (optional)</FormLabel>
                    <p className="text-xs text-foreground/70">
                      Add a brief description to inform users about the purpose of this form.
                    </p>
                  </div>
                  <FormControl>
                    <Textarea {...field} placeholder="Enter form description" className="text-sm" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-between flex-col-reverse sm:flex-row items-center gap-2 sm:gap-4">
            <Button
              disabled={isPending}
              onClick={() => setState(false)}
              type="button"
              variant={"outline"}
              size={"sm"}
              className="w-full sm:w-fit">
              Cancel
            </Button>
            <div className="flex justify-center items-center gap-2 sm:gap-4 w-full sm:w-fit">
              <Button
                disabled={isPending}
                onClick={() => setView("none")}
                type="button"
                variant={"outline"}
                size={"sm"}
                className="w-full sm:w-fit">
                <ChevronLeftIcon className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button disabled={isPending} type="submit" variant={"default"} size={"sm"} className="w-full sm:w-fit">
                {isPending && <Loader2Icon className="animate-spin w-4 h-4 mr-2" />}
                Create Form
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
const TemplateForm = ({ setState, setView }: { setState: TSetState<boolean>; setView: TSetState<TView> }) => {
  const supabase = createClient();
  const router = useRouter();
  const [appState, setAppState] = useState<TAppState>("idle");
  const [value, setValue] = useState("");
  const { subscription, profile } = useUserStore();
  const showBadge = subscription.plan !== "pro";

  const onSubmit = async () => {
    const targetTemplate = FormTemplates.find((x) => x.id === value);
    if (!targetTemplate) return;
    setAppState("loading");
    const { form, blocks } = targetTemplate;

    const { data: formData, error: formError } = await supabase
      .from("forms")
      .insert([
        {
          name: form.name,
          description: form.description,
          owner_id: profile.id,
          public_url: nanoid(20, true, true),
          submit_text: form.submit_text,
          nebulaform_branding: true,
          status: "draft",
          success_title: form.success_title,
          success_description: form.success_description,
        },
      ])
      .select()
      .single();

    if (formError) {
      toast.error("An unexpected error occurred while creating the form. Please try again later.");
      return;
    }

    const updatedBlocks = blocks.map((x) => {
      return {
        ...x,
        form_id: formData.id,
        id: uuid(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    });
  };

  return (
    <div className="flex flex-col h-full gap-6 overflow-y-auto">
      <div className="flex flex-col w-full h-full overflow-y-auto gap-3 sm:pr-4">
        {FormTemplates.map((temp) => {
          return (
            <button
              key={temp.id}
              onClick={() => {
                if (temp.pro && subscription.plan !== "pro") return;
                setValue(temp.id);
              }}
              className={`${
                value === temp.id ? "bg-primary/5 border-primary" : ""
              } border flex justify-between items-center rounded hover:bg-primary/5 p-3 flex-col w-full gap-1`}>
              <div className="flex justify-between items-center w-full">
                <span className="text-sm font-medium">{temp.form.name}</span>
                <div>{temp.pro && showBadge && <Badge variant={"pink"}>Pro Template</Badge>}</div>
              </div>
              <div className="flex w-full">
                <p className="text-xs text-foreground/70">{temp.form.description}</p>
              </div>
            </button>
          );
        })}
      </div>
      <div className="flex justify-between flex-col-reverse sm:flex-row items-center gap-2 sm:gap-4">
        <Button
          disabled={appState === "loading"}
          onClick={() => setState(false)}
          type="button"
          variant={"outline"}
          size={"sm"}
          className="w-full sm:w-fit">
          Cancel
        </Button>
        <div className="flex justify-center items-center gap-2 sm:gap-4 w-full sm:w-fit">
          <Button
            disabled={appState === "loading"}
            onClick={() => setView("none")}
            type="button"
            variant={"outline"}
            size={"sm"}
            className="w-full sm:w-fit">
            <ChevronLeftIcon className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            disabled={appState === "loading"}
            onClick={onSubmit}
            type="button"
            variant={"default"}
            size={"sm"}
            className="w-full sm:w-fit">
            {appState === "loading" && <Loader2Icon className="animate-spin w-4 h-4 mr-2" />}
            Create Form
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardNewForm;
