"use client";

import { signOutAction } from "@/app/actions/auth";
import FeedbackForm from "@/components/private/shared/core/feedback-form";
import FormStatusBadge from "@/components/shared/badges/form-status-badge";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useEditorStore from "@/stores/editor";
import useFormStore from "@/stores/form";
import useUserStore from "@/stores/user";
import { minWidth640 } from "@/utils/constants";
import { isSubscriptionActive } from "@/utils/functions";
import { createClient } from "@/utils/supabase/client";
import { TAppState, TFormStatus, TPlan, TSetState } from "@/utils/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChartNoAxesColumnIcon,
  ChevronsUpDownIcon,
  CreditCardIcon,
  HelpingHandIcon,
  InboxIcon,
  LoaderIcon,
  LogOutIcon,
  Menu,
  MessageSquareCodeIcon,
  MonitorIcon,
  MoonIcon,
  PlusIcon,
  Settings2Icon,
  SunIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useMedia } from "react-use";
import { toast } from "sonner";
import { default as Brand } from "../../../shared/core/brand";
import { Avatar, AvatarFallback } from "../../../ui/avatar";
import { Button } from "../../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";

const Nav = () => {
  const pathname = usePathname();
  if (pathname.includes("dashboard/checkout-result")) return null;
  if (pathname.includes("dashboard/editor/")) return <NavEditor />;
  return <NavApp />;
};
const NavAppMobile = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("app");
  const user = useUserStore();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (path: string) => path === pathname;
  const { setTheme, theme } = useTheme();

  const linksMobile = [
    {
      id: 1,
      name: t("nav_dashboard"),
      path: "/dashboard/forms",
      icon: InboxIcon,
      enabled: true,
    },
    {
      id: 2,
      name: t("nav_analytics"),
      path: "/dashboard/analytics",
      icon: ChartNoAxesColumnIcon,
      enabled: true,
    },
    {
      id: 5,
      name: t("label_billing"),
      path: "/dashboard/settings/billing",
      icon: CreditCardIcon,
      enabled: true,
    },
    {
      id: 3,
      name: t("nav_settings"),
      path: "/dashboard/settings",
      icon: Settings2Icon,
      enabled: true,
    },
    {
      id: 4,
      name: t("nav_help"),
      path: "/dashboard/help",
      icon: HelpingHandIcon,
      enabled: true,
    },
  ];

  // app
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-screen flex flex-col gap-2 py-4">
        <div className="flex justify-between items-center px-2">
          <span className="font-medium">{user.email}</span>
          {user.subscription.plan === "" ? null : <PlanBadge plan={user.subscription.plan as TPlan} />}
        </div>
        <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-muted/30 to-transparent h-[1px]" />
        <div className="flex flex-col">
          {linksMobile.map((link) => {
            if (link.enabled)
              return (
                <Link
                  onClick={() => setOpen(false)}
                  key={link.id}
                  href={link.path}
                  className={`${
                    isActive(link.path) ? "bg-foreground text-background" : ""
                  } p-2 text-sm flex justify-between items-center`}>
                  {link.name}
                  <link.icon className="w-4 h-4 mr-2" />
                </Link>
              );
          })}
        </div>
        <div className="flex flex-col w-full gap-2">
          <div className="flex justify-between items-center px-2">
            <span className="text-sm flex items-center justify-center">{t("label_theme")}</span>
            <RadioGroup value={theme} onValueChange={setTheme} className="flex gap-1">
              <div>
                <RadioGroupItem value="system" id="system" className="peer sr-only" />
                <Label
                  htmlFor="system"
                  className="text-xs cursor-pointer flex items-center justify-start gap-2 rounded-md border-1 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:bg-foreground/10">
                  <MonitorIcon className="w-3 h-3" />
                </Label>
              </div>
              <div>
                <RadioGroupItem value="light" id="light" className="peer sr-only" />
                <Label
                  htmlFor="light"
                  className="text-xs cursor-pointer flex items-center justify-start gap-2 rounded-md border-1 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:bg-foreground/10">
                  <SunIcon className="w-3 h-3" />
                </Label>
              </div>
              <div>
                <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                <Label
                  htmlFor="dark"
                  className="text-xs cursor-pointer flex items-center justify-start gap-2 rounded-md border-1 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:bg-foreground/10">
                  <MoonIcon className="w-3 h-3" />
                </Label>
              </div>
            </RadioGroup>
          </div>
          <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-muted/30 to-transparent h-[1px]" />
          <Button variant={"ghost"} size={"sm"} className="flex justify-between" onClick={signOutAction}>
            {t("label_logout")}
            <LogOutIcon className="w-4 h-4" />
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
const NavApp = () => {
  const { slug } = useParams<{ slug: string }>();
  const t = useTranslations("app");
  const editorStore = useEditorStore();
  const formStore = useFormStore();
  const pathname = usePathname();
  const userStore = useUserStore();
  const avatarName = userStore.email.slice(0, 2);
  const isActive = (path: string) => path === pathname;

  const links = [
    {
      id: 1,
      name: t("nav_dashboard"),
      path: "/dashboard/forms",
      icon: InboxIcon,
      enabled: true,
    },
    {
      id: 2,
      name: t("nav_analytics"),
      path: "/dashboard/analytics",
      icon: ChartNoAxesColumnIcon,
      enabled: true,
    },
    {
      id: 3,
      name: t("nav_settings"),
      path: "/dashboard/settings",
      icon: Settings2Icon,
      enabled: false,
    },
    {
      id: 4,
      name: t("label_billing"),
      path: "/dashboard/settings/billing",
      icon: CreditCardIcon,
      enabled: false,
    },
  ];

  const query = useQuery({
    queryKey: ["editorResetData"],
    queryFn: () => {
      editorStore.reset();
      return null;
    },
  });

  if (query.isPending) return null;

  return (
    <div className="h-12 flex items-center px-3 justify-between z-10 bg-background fixed w-full">
      <div className="flex justify-center items-center gap-4 h-full">
        <div className="flex justify-center items-center gap-2">
          <Button variant={"ghost"} size={"icon"} className="h-9 w-9" asChild>
            <Link href={"/dashboard/forms"}>
              <Brand type="logo" className="h-5 fill-foreground" />
            </Link>
          </Button>
        </div>
        {slug && formStore.form.id !== "" && (
          <div className="flex justify-center items-center gap-1">
            <span className="text-xs font-medium">{formStore.form.name}</span>
            <ChangeForm>
              <button className="flex justify-center items-center p-1 hover:bg-foreground/5 rounded">
                <ChevronsUpDownIcon className="w-4 h-4" />
              </button>
            </ChangeForm>
          </div>
        )}
        <div className="hidden sm:flex justify-center items-center gap-2 h-full">
          {links.map((link) => {
            if (link.enabled)
              return (
                <Link
                  key={link.id}
                  href={link.path}
                  className={`${
                    isActive(link.path) ? "text-foreground/100 font-medium bg-foreground/5" : "text-foreground/70"
                  } text-xs flex justify-center items-center px-2 py-2 rounded hover:bg-foreground/5 relative gap-2`}>
                  <link.icon className={`${isActive(link.path) ? "text-primary" : "text-foreground/70"} w-4 h-4`} />
                  {link.name}
                </Link>
              );
          })}
        </div>
      </div>
      <div className="hidden sm:flex justify-center items-center gap-4">
        <div className="flex justify-center items-center gap-3">
          <FeedbackForm>
            <Button variant={"outline"} size={"xs"}>
              <MessageSquareCodeIcon className="w-4 h-4 mr-2" />
              {t("fb_label")}
            </Button>
          </FeedbackForm>
        </div>
        <AvatarAppMenu>
          <Avatar className="cursor-pointer w-8 h-8">
            <AvatarFallback className="bg-foreground/5">
              <span className="first-letter:uppercase text-xs">{avatarName}</span>
            </AvatarFallback>
          </Avatar>
        </AvatarAppMenu>
      </div>
      <div className="flex sm:hidden">
        <NavAppMobile>
          <Button variant={"ghost"} size={"icon"}>
            <Menu className="w-6 h-6" />
          </Button>
        </NavAppMobile>
      </div>
    </div>
  );
};
const NavEditor = () => {
  const t = useTranslations("app");
  const appTheme = useTheme();
  const { form, theme, blocks, blocksReadyOnly } = useEditorStore();
  const { subscription } = useUserStore();
  const queryClient = useQueryClient();
  const supabase = createClient();
  const router = useRouter();
  const [appState, setAppState] = useState<TAppState>("idle");
  const active = isSubscriptionActive(subscription);

  const onSave = async () => {
    try {
      setAppState("loading");

      await onSaveForm();
      await onSaveTheme();
      await onSaveBlocks();

      toast.success(t("suc_update_form"));
      queryClient.invalidateQueries({ queryKey: ["submissionData"] });
      router.push(`/dashboard/forms/${form.id}`);
    } catch (error) {
      toast.error((error as Error).message || t("err_generic"));
    } finally {
      setAppState("idle");
    }
  };
  const onSaveForm = async () => {
    try {
      const newStatus = blocks.length <= 0 ? "draft" : form.status;
      const { error } = await supabase
        .from("forms")
        .update({
          name: form.name,
          description: form.description,
          status: newStatus,
          submit_text: form.submit_text,
          nebulaform_branding: form.nebulaform_branding,
          success_title: form.success_title,
          success_description: form.success_description,
          new_submission_notification: form.new_submission_notification,
        })
        .eq("id", form.id);

      if (error) {
        throw new Error(t("err_generic"));
      }
    } catch (error) {
      throw error;
    }
  };
  const onSaveTheme = async () => {
    try {
      const { error } = await supabase
        .from("themes")
        .update({
          primary_color: theme.primary_color,
          numeric_blocks: theme.numeric_blocks,
          nebulaform_branding: theme.nebulaform_branding,
          uppercase_block_name: theme.uppercase_block_name,
          width: theme.width,
          custom_primary_color: theme.custom_primary_color,
        })
        .eq("id", theme.id);

      if (error) {
        throw new Error(t("err_generic"));
      }
    } catch (error) {
      throw error;
    }
  };
  const onSaveBlocks = async () => {
    try {
      const elementsBefore = blocksReadyOnly;
      const elementsAfter = blocks;

      const beforeIds = new Set(elementsBefore.map((x) => x.id));
      const afterIds = new Set(elementsAfter.map((x) => x.id));

      const modifiedElements = elementsAfter.filter((after) => {
        if (!beforeIds.has(after.id)) return false;
        const before = elementsBefore.find((x) => x.id === after.id);
        return JSON.stringify(before) !== JSON.stringify(after);
      });

      const newElements = elementsAfter.filter((x) => !beforeIds.has(x.id));
      const removedElements = elementsBefore.filter((x) => !afterIds.has(x.id));

      const elementsToUpsert = [...modifiedElements, ...newElements];

      if (elementsToUpsert.length > 0) {
        const { error: upsertError } = await supabase.from("blocks").upsert(elementsToUpsert);

        if (upsertError) {
          throw new Error(t("err_generic"));
        }
      }

      if (removedElements.length > 0) {
        const deletePromises = removedElements.map((x) => supabase.from("blocks").delete().eq("id", x.id));

        const deleteResults = await Promise.all(deletePromises);

        const hasError = deleteResults.some(({ error }) => error);
        if (hasError) {
          throw new Error(t("err_generic"));
        }
      }
    } catch (error) {
      console.error("Error saving blocks:", error);
      throw error;
    }
  };

  return (
    <div className="h-12 flex justify-between items-center w-full bg-background border-b px-3 z-20 fixed">
      <div className="flex justify-center items-center gap-1">
        <Button variant={"ghost"} size={"icon"} className="h-9 w-9" asChild>
          <Link href={"/dashboard/forms"}>
            <Brand type="logo" className="h-5 fill-foreground" />
          </Link>
        </Button>
        <div className="hidden sm:flex justify-center items-center gap-2">
          <span className="text-sm font-medium truncate max-w-[280px] hover:bg-foreground/5 py-1 px-2 flex justify-center items-center rounded">
            {form.name}
          </span>
        </div>
      </div>
      {active && (
        <div className="flex justify-center items-center gap-4">
          <Button size={"xs"} variant={"secondary"} onClick={onSave} disabled={appState === "loading"}>
            {appState === "loading" && <LoaderIcon className="animate-spin w-4 h-4 mr-2" />}
            {t("label_save_form")}
          </Button>
          <RadioGroup value={appTheme.theme} onValueChange={appTheme.setTheme} className="flex gap-1">
            <div>
              <RadioGroupItem value="light" id="light" className="peer sr-only" />
              <Label
                htmlFor="light"
                className="text-xs cursor-pointer flex items-center justify-start gap-2 rounded-md border-1 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:bg-foreground/10">
                <SunIcon className="w-3 h-3" />
              </Label>
            </div>
            <div>
              <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
              <Label
                htmlFor="dark"
                className="text-xs cursor-pointer flex items-center justify-start gap-2 rounded-md border-1 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:bg-foreground/10">
                <MoonIcon className="w-3 h-3" />
              </Label>
            </div>
          </RadioGroup>
        </div>
      )}
    </div>
  );
};
const PlanBadge = ({ plan }: { plan: TPlan }) => {
  const planLabels: Record<TPlan, string> = {
    free_trial: "Free Trial",
    basic: "Basic",
    pro: "Pro",
    business: "Business",
    custom: "Custom",
  };

  return <Badge variant="plan">{planLabels[plan] || "Custom"}</Badge>;
};
const ChangeForm = ({ children }: { children: React.ReactNode }) => {
  const isDesktop = useMedia(minWidth640);
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent className="flex w-[300px] p-3">
          <ChangeFormBody setState={setOpen} />
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3 flex flex-col max-h-[60%] h-full">
        <DrawerHeader className="hidden">
          <DrawerTitle></DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <ChangeFormBody setState={setOpen} />
      </DrawerContent>
    </Drawer>
  );
};
const ChangeFormBody = ({ setState }: { setState: TSetState<boolean> }) => {
  const t = useTranslations("app");
  const store = useFormStore();

  return (
    <div className="flex flex-col gap-5 w-full h-full">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-medium text-foreground">{t("label_forms")}</h3>
      </div>
      {/* Forms List */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
        <div className="flex flex-col gap-2">
          {store.forms.map((x) => (
            <a
              key={x.id}
              href={`/dashboard/forms/${x.id}`}
              className={`
                group relative flex items-center justify-between rounded-lg p-2 transition-all
                ${
                  store.form.id === x.id
                    ? "bg-accent/50 border border-accent cursor-default"
                    : "hover:bg-accent/30 border border-transparent hover:border-accent/30"
                }
              `}>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm truncate ${
                    store.form.id === x.id ? "font-medium text-foreground" : "text-foreground/90"
                  }`}>
                  {x.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">{new Date(x.created_at).toLocaleDateString()}</p>
              </div>
              <FormStatusBadge status={x.status as TFormStatus} />
            </a>
          ))}
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2 border-t border-muted/20">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setState(false)}
          className="w-full sm:w-24 hover:bg-muted/50">
          {t("label_close")}
        </Button>
        <Button size="sm" variant="secondary" asChild>
          <Link href="/dashboard/forms/new">
            <PlusIcon className="w-4 h-4 mr-2" />
            {t("label_create_form")}
          </Link>
        </Button>
      </div>
    </div>
  );
};
const AvatarAppMenu = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("app");
  const user = useUserStore();
  const { setTheme, theme } = useTheme();
  const showPlan = user.subscription.status !== "canceled";

  const options = [
    { label: t("label_billing"), icon: CreditCardIcon, path: "/dashboard/settings/billing" },
    { label: t("label_settings"), icon: Settings2Icon, path: "/dashboard/settings" },
    { label: t("nav_help"), icon: HelpingHandIcon, path: "/dashboard/help" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="mr-4 w-64 rounded" align="end" sideOffset={8}>
        {/* User Info Section */}
        {user.email !== "" && (
          <>
            <DropdownMenuLabel className="flex flex-col px-3 py-2.5">
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{user.email}</p>
                </div>
              </div>
              {showPlan && (
                <div className="mt-2">
                  <PlanBadge plan={user.subscription.plan as TPlan} />
                </div>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-muted/30 to-transparent h-[1px]" />
          </>
        )}
        {/* Menu Items */}
        <div className="space-y-1 p-1">
          {options.map((opt) => {
            return (
              <DropdownMenuItem key={opt.path} className="rounded-lg hover:bg-accent/50 focus:bg-accent/50">
                <a href={opt.path} className="flex justify-between items-center gap-2 w-full">
                  <span className="">{opt.label}</span>
                  <opt.icon className="w-4 h-4" />
                </a>
              </DropdownMenuItem>
            );
          })}
        </div>
        {/* Theme Selector */}
        <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-muted/30 to-transparent h-[1px]" />
        <div className="w-full flex justify-between items-center px-2">
          <span className="text-sm">{t("label_theme")}</span>
          <div className="flex items-center gap-1 p-1 rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 ${theme === "system" ? "bg-accent" : ""}`}
              onClick={() => setTheme("system")}>
              <MonitorIcon className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 ${theme === "light" ? "bg-accent" : ""}`}
              onClick={() => setTheme("light")}>
              <SunIcon className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 ${theme === "dark" ? "bg-accent" : ""}`}
              onClick={() => setTheme("dark")}>
              <MoonIcon className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
        {/* Logout */}
        <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-muted/30 to-transparent h-[1px]" />
        <DropdownMenuItem className="space-y-1 p-1">
          <Button onClick={signOutAction} variant="ghost" size="sm" className="w-full justify-between gap-3 px-2">
            <span>{t("label_logout")}</span>
            <LogOutIcon className="w-4 h-4" />
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default Nav;
