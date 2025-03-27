"use client";

import { createFormAction } from "@/app/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import useUserStore from "@/stores/user";
import { minWidth640 } from "@/utils/constants";
import { nanoid, uuid } from "@/utils/functions";
import { IFormTemplate } from "@/utils/interfaces";
import { createClient } from "@/utils/supabase/client";
import { getTemplates } from "@/utils/templates";
import { TAppState, TSetState } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeftIcon, ConstructionIcon, HexagonIcon, Loader2Icon, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
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

const DashboardNewForm = ({ children }: { children: React.ReactNode }) => {
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
          <DialogHeader className="hidden">
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <Body setState={setOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3 flex flex-col max-h-[90%] h-full">
        <DrawerHeader className="hidden">
          <DrawerTitle></DrawerTitle>
          <DrawerDescription></DrawerDescription>
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
  const t = useTranslations("app");
  const options = [
    {
      title: t("label_custom"),
      description: t("desc_custom"),
      type: "custom",
      icon: PlusIcon,
      enabled: true,
    },
    {
      title: t("label_templates"),
      description: t("desc_templates"),
      type: "templates",
      icon: HexagonIcon,
      enabled: true,
    },
  ];

  return (
    <div className="pt-4 sm:pt-0 flex flex-col h-full gap-6">
      <div className="grid gap-1">
        <span className="font-semibold">{t("label_create_form")}</span>
        <p className="text-xs text-foreground/70">{t("desc_create_form")}</p>
      </div>
      <div className="flex flex-col justify-center items-center gap-6 w-full h-full">
        {options.map((opt) => {
          return (
            <button
              key={opt.type}
              onClick={() => setView(opt.type as TView)}
              className="flex flex-col justify-center items-center border w-full h-full gap-4 hover:bg-primary/5 p-6">
              <div className="flex justify-center items-center p-2 bg-primary/10 rounded">
                <opt.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex flex-col justify-center items-center gap-1">
                <h1 className="text-base font-medium">{opt.title}</h1>
                <p className="text-xs text-foreground/70">{opt.description}</p>
              </div>
            </button>
          );
        })}
      </div>
      <div className="flex justify-end items-center gap-2 flex-col sm:flex-row">
        <Button onClick={() => setState(false)} variant={"outline"} size={"sm"} className="w-full sm:w-fit">
          {t("label_close")}
        </Button>
      </div>
    </div>
  );
};
const CustomForm = ({ setState, setView }: { setState: TSetState<boolean>; setView: TSetState<TView> }) => {
  const t = useTranslations("app");
  const [isPending, startTransition] = useTransition();
  const user = useUserStore();

  const formSchema = z.object({
    name: z.string().min(3, t("required_n_letters", { n: 3 })),
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
      formData.append("userId", user.profile.id);
      await createFormAction(formData);
    });
  };

  return (
    <div className="flex flex-col gap-4 pt-4 sm:pt-0 h-full w-full flex-1">
      <div className="grid gap-1">
        <span className="font-semibold">{t("label_custom_form")}</span>
        <p className="text-xs text-foreground/70">{t("desc_custom_form")}</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 h-full">
          <div className="flex flex-col gap-8 h-full">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div className="grid gap-1">
                    <FormLabel className="font-semibold">{t("label_form_name")}</FormLabel>
                    <p className="text-xs text-foreground/70">{t("desc_form_name")}</p>
                  </div>
                  <FormControl>
                    <Input type="text" {...field} placeholder={t("placeholder_form_name")} className="text-sm" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div className="grid gap-1">
                    <FormLabel className="font-semibold">
                      {t("label_form_desc")} ({t("label_optional")})
                    </FormLabel>
                    <p className="text-xs text-foreground/70">{t("desc_form_desc")}</p>
                  </div>
                  <FormControl>
                    <Textarea {...field} placeholder={t("placeholder_form_desc")} className="text-sm" />
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
              {t("label_cancel")}
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
                {t("label_back")}
              </Button>
              <Button disabled={isPending} type="submit" variant={"secondary"} size={"sm"} className="w-full sm:w-fit">
                {isPending && <Loader2Icon className="animate-spin w-4 h-4 mr-2" />}
                {t("submit_create_form")}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
const TemplateForm = ({ setState, setView }: { setState: TSetState<boolean>; setView: TSetState<TView> }) => {
  const t = useTranslations("app");
  const router = useRouter();
  const supabase = createClient();
  const user = useUserStore();
  const [appState, setAppState] = useState<TAppState>("idle");
  const [localTemplates, setLocalTemplates] = useState<IFormTemplate[]>([]);
  const [value, setValue] = useState("");
  const showBadge = user.subscription.plan !== "pro";

  const query = useQuery({
    queryKey: ["templatesData"],
    queryFn: async () => {
      setLocalTemplates(await getTemplates(user.locale));
      return null;
    },
    refetchOnWindowFocus: false,
  });
  const onSubmit = async () => {
    const targetTemplate = localTemplates.find((x) => x.id === value);
    if (!targetTemplate) return;
    setAppState("loading");
    const { form, blocks } = targetTemplate;

    const { data: formData, error: formError } = await supabase
      .from("forms")
      .insert([
        {
          name: form.name,
          description: form.description,
          owner_id: user.profile.id,
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
      toast.error(t("err_generic"));
      setAppState("idle");
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

    const { error: blocksError } = await supabase.from("blocks").insert(updatedBlocks);
    if (blocksError) {
      toast.error(t("err_generic"));
      await supabase.from("forms").delete().eq("id", formData.id);
      setAppState("idle");
      return;
    }

    router.push(`/dashboard/editor/${formData.id}`);
  };
  if (query.isPending) return null;

  return (
    <div className="flex flex-col h-full gap-6 overflow-y-auto">
      <div className="grid gap-1">
        <span className="font-semibold">{t("label_form_templates")}</span>
        <p className="text-xs text-foreground/70">{t("desc_form_templates")}</p>
      </div>
      <div className="flex flex-col h-full overflow-y-auto gap-4">
        <div className="flex flex-col w-full h-full overflow-y-auto gap-2">
          {localTemplates.map((temp) => {
            return (
              <button
                key={temp.id}
                onClick={() => {
                  if (temp.pro && user.subscription.plan !== "pro") return;
                  setValue(temp.id);
                }}
                className={`${
                  value === temp.id ? "bg-primary/5 border-primary" : ""
                } border flex justify-between items-center rounded hover:bg-primary/5 p-3 flex-col w-full gap-2 min-h-16`}>
                <div className="flex justify-between items-center w-full">
                  <span className="text-sm font-medium">{temp.name}</span>
                  <div className="flex justify-center items-center gap-3">
                    {temp.pro && showBadge && <Badge variant={"pink"}>Pro</Badge>}
                  </div>
                </div>
                <div className="flex w-full flex-col justify-start">
                  <p className="text-xs text-foreground/70 text-start">{temp.description}</p>
                </div>
              </button>
            );
          })}
        </div>
        <Alert variant={"info"} className="px-3 py-2">
          <AlertDescription className="text-xs flex justify-start items-center gap-3">
            <ConstructionIcon className="w-4 h-4" /> {t("label_more_templates_alert")}
          </AlertDescription>
        </Alert>
      </div>
      <div className="flex justify-between flex-col-reverse sm:flex-row items-center gap-2 sm:gap-4">
        <Button
          disabled={appState === "loading"}
          onClick={() => setState(false)}
          type="button"
          variant={"outline"}
          size={"sm"}
          className="w-full sm:w-fit">
          {t("label_cancel")}
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
            {t("label_back")}
          </Button>
          <Button
            disabled={appState === "loading"}
            onClick={onSubmit}
            type="button"
            variant={"secondary"}
            size={"sm"}
            className="w-full sm:w-fit">
            {appState === "loading" && <Loader2Icon className="animate-spin w-4 h-4 mr-2" />}
            {t("submit_create_form")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardNewForm;
