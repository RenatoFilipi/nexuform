"use client";

import { signOutAction } from "@/app/actions/auth";
import FeedbackForm from "@/components/private/shared/core/feedback-form";
import PlanBadge from "@/components/shared/badges/plan-badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useEditorStore from "@/stores/editor";
import useUserStore from "@/stores/user";
import { isSubscriptionActive } from "@/utils/functions";
import { createClient } from "@/utils/supabase/client";
import { TAppState, TPlan } from "@/utils/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChartNoAxesColumnIcon,
  CircleHelpIcon,
  CreditCardIcon,
  InboxIcon,
  LoaderIcon,
  LogOutIcon,
  Menu,
  MessageSquareCodeIcon,
  MonitorIcon,
  MoonIcon,
  Settings2Icon,
  SunIcon,
  ZapIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
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
      id: 3,
      name: t("nav_settings"),
      path: "/dashboard/settings/account",
      icon: Settings2Icon,
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
      id: 4,
      name: t("nav_help"),
      path: "/dashboard/help",
      icon: CircleHelpIcon,
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
  const t = useTranslations("app");
  const editor = useEditorStore();
  const pathname = usePathname();
  const user = useUserStore();
  const avatarName = user.email.slice(0, 1);
  const isActive = (path: string) => path === pathname;
  const isFreeTrial = user.subscription.plan === "free_trial";

  const noBottomNav =
    pathname === "/dashboard/forms" ||
    pathname === "/dashboard/analytics" ||
    pathname === "/dashboard/help" ||
    pathname === "/dashboard/forms/new";

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
      path: "/dashboard/settings/account",
      icon: Settings2Icon,
      enabled: false,
    },
  ];
  const query = useQuery({
    queryKey: ["editorResetData"],
    queryFn: () => {
      editor.reset();
      return null;
    },
  });

  if (query.isPending) return null;

  return (
    <div
      className={`${
        noBottomNav ? "border-b" : ""
      } h-14 flex items-center px-4 sm:px-8 justify-between z-10 bg-background fixed w-full`}>
      <div className="flex justify-center items-center gap-4 h-full">
        <div className="flex justify-center items-center gap-4">
          <Button variant={"ghost"} size={"icon"} className="h-8 w-8" asChild>
            <Link href={"/dashboard/forms"}>
              <Brand type="logo" className="h-5 fill-foreground" />
            </Link>
          </Button>
        </div>
        <div className="hidden sm:flex justify-center items-center gap-2 h-full">
          {links.map((link) => {
            if (link.enabled)
              return (
                <Link
                  key={link.id}
                  href={link.path}
                  className={`${
                    isActive(link.path) ? "text-foreground/100 font-medium bg-foreground/5" : "text-muted-foreground"
                  } text-sm flex justify-center items-center px-2 py-2 rounded hover:bg-foreground/5 relative gap-2`}>
                  <link.icon className={`${isActive(link.path) ? "text-primary" : "text-muted-foreground"} w-4 h-4`} />
                  {link.name}
                </Link>
              );
          })}
        </div>
      </div>
      <div className="hidden sm:flex justify-center items-center gap-4">
        <div className="flex justify-center items-center gap-3">
          <FeedbackForm>
            <Button variant={"outline"} size={"sm"}>
              <MessageSquareCodeIcon className="w-4 h-4 mr-2" />
              {t("fb_label")}
            </Button>
          </FeedbackForm>
          {isFreeTrial && (
            <Button variant={"outline"} size={"sm"} asChild>
              <Link href={"/dashboard/settings/billing"}>
                <ZapIcon className="w-4 h-4 mr-2" />
                {t("label_upgrade_now")}
              </Link>
            </Button>
          )}
        </div>
        <AvatarAppMenu>
          <Avatar className="cursor-pointer w-9 h-9">
            <AvatarFallback className="bg-foreground hover:bg-foreground/70 transition">
              <span className="first-letter:uppercase text-xs font-bold text-background">{avatarName}</span>
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

  const handleSave = async () => {
    if (appState === "loading") return;
    try {
      setAppState("loading");

      await Promise.all([saveForm(), saveTheme(), saveBlocks()]);
      toast.success(t("suc_update_form"));
      queryClient.invalidateQueries({ queryKey: ["submissionData"] });
      router.push(`/dashboard/forms/${form.id}/overview`);
    } catch (error) {
      console.error("Save operation failed:", error);
      toast.error((error as Error).message || t("err_generic"));
    } finally {
      setAppState("idle");
    }
  };
  const saveForm = async () => {
    try {
      const newStatus = blocks.length <= 0 ? "draft" : form.status;
      const { error } = await supabase
        .from("forms")
        .update({
          name: form.name,
          description: form.description,
          status: newStatus,
          submit_label: form.submit_label,
          success_title: form.success_title,
          success_description: form.success_description,
        })
        .eq("id", form.id);

      if (error) {
        throw new Error(t("err_generic"));
      }
    } catch (error) {
      throw error;
    }
  };
  const saveTheme = async () => {
    const { error } = await supabase
      .from("themes")
      .update({
        numeric_blocks: theme.numeric_blocks,
        app_branding: theme.app_branding,
        uppercase_block_name: theme.uppercase_block_name,
        custom_primary_color: theme.custom_primary_color,
      })
      .eq("id", theme.id);

    if (error) {
      throw new Error(t("err_generic"));
    }
  };
  const saveBlocks = async () => {
    const elementsBefore = blocksReadyOnly;
    const elementsAfter = blocks;

    // Identify changes between versions
    const beforeIds = new Set(elementsBefore.map((x) => x.id));
    const afterIds = new Set(elementsAfter.map((x) => x.id));

    const modifiedElements = elementsAfter.filter((after) => {
      const before = elementsBefore.find((x) => x.id === after.id);
      return before && JSON.stringify(before) !== JSON.stringify(after);
    });

    const newElements = elementsAfter.filter((x) => !beforeIds.has(x.id));
    const removedElements = elementsBefore.filter((x) => !afterIds.has(x.id));

    // Process changes in a single transaction if possible
    const upsertPromises = [];
    const deletePromises = [];

    if (modifiedElements.length > 0 || newElements.length > 0) {
      upsertPromises.push(supabase.from("blocks").upsert([...modifiedElements, ...newElements]));
    }

    if (removedElements.length > 0) {
      deletePromises.push(...removedElements.map((x) => supabase.from("blocks").delete().eq("id", x.id)));
    }

    // Execute all operations in parallel
    const results = await Promise.all([...upsertPromises, ...deletePromises]);

    // Check for errors
    const hasError = results.some((result) => result.error);
    if (hasError) {
      throw new Error(t("err_generic"));
    }
  };

  return (
    <div className="h-14 flex justify-between items-center w-full bg-background border-b px-4 sm:px-8 z-20 fixed">
      <div className="flex justify-center items-center gap-2">
        <Button variant={"ghost"} size={"icon"} className="h-9 w-9" asChild>
          <Link href={"/dashboard/forms"}>
            <Brand type="logo" className="h-5 fill-foreground" />
          </Link>
        </Button>
        <div className="hidden sm:flex justify-center items-center gap-2">
          <span className="text-sm font-semibold truncate max-w-[280px] hover:bg-foreground/5 py-1 px-2 flex justify-center items-center rounded">
            {form.name}
          </span>
        </div>
      </div>
      {active && (
        <div className="flex justify-center items-center gap-4">
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
          <div className="flex justify-center items-center gap-2">
            <Button size={"sm"} variant={"secondary"} onClick={handleSave} disabled={appState === "loading"}>
              {appState === "loading" && <LoaderIcon className="animate-spin w-4 h-4 mr-2" />}
              {t("label_save_form")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
const AvatarAppMenu = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("app");
  const user = useUserStore();
  const { setTheme, theme } = useTheme();
  const showPlan = user.subscription.status !== "canceled";

  const options = [
    { label: t("label_settings"), icon: Settings2Icon, path: "/dashboard/settings/account" },
    { label: t("label_billing"), icon: CreditCardIcon, path: "/dashboard/settings/billing" },
    { label: t("nav_help"), icon: CircleHelpIcon, path: "/dashboard/help" },
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
