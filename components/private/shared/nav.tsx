"use client";

import { signOutAction } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
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
  HelpingHandIcon,
  InboxIcon,
  LoaderIcon,
  LogOutIcon,
  Menu,
  MessageSquareCodeIcon,
  MonitorIcon,
  MoonIcon,
  Settings2Icon,
  SunIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { default as Brand } from "../../core/brand";
import Feedback from "../../core/feedback";
import { Avatar, AvatarFallback } from "../../ui/avatar";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import ManageSubscription from "./manage-subscription";

const Nav = () => {
  const pathname = usePathname();

  if (pathname.includes("dashboard/payment-confirmation")) return null;
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
        <div className="flex justify-between items-center">
          <span>{t("label_plan")}</span>
          {user.subscription.plan === "" ? null : <PlanBadge plan={user.subscription.plan as TPlan} />}
        </div>
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
                  } p-2 text-sm flex justify-start items-center`}>
                  <link.icon className="w-4 h-4 mr-2" />
                  {link.name}
                </Link>
              );
          })}
        </div>
        <div className="flex flex-col w-full gap-2">
          <div className="flex justify-between items-center px-2">
            <span className="text-sm flex items-center justify-center">Theme</span>
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
          <Button variant={"ghost"} size={"sm"} className="flex justify-between" asChild>
            <Link href={"/"}>
              Log out
              <LogOutIcon className="w-4 h-4" />
            </Link>
          </Button>
        </div>
        <div className="justify-end items-center gap-2 p-2 hidden">
          <Link href={"/legal/privacy"} className="text-xs text-foreground/80 hover:underline">
            Privacy
          </Link>
          <Link href={"/legal/terms"} className="text-xs text-foreground/80 hover:underline">
            Terms
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
const AvatarAppMenu = () => {
  const t = useTranslations("app");
  const user = useUserStore();
  const { setTheme, theme } = useTheme();
  const avatarName = user.email.charAt(0);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer w-8 h-8">
          <AvatarFallback className="text-sm bg-foreground/5 text-foreground uppercase">{avatarName}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-4 min-w-52 text-foreground/80">
        {user.email !== "" && (
          <>
            <DropdownMenuLabel className="flex justify-center items-center gap-4">
              {user.email}
              {user.subscription.plan === "" ? null : <PlanBadge plan={user.subscription.plan as TPlan} />}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem className="py-0">
          <Button variant={"ghost"} size={"sm"} asChild className="flex justify-between w-full items-center p-0">
            <Link href={"/dashboard/settings"}>
              {t("label_settings")}
              <Settings2Icon className="w-4 h-4" />
            </Link>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem className="py-0">
          <Button variant={"ghost"} size={"sm"} asChild className="flex justify-between w-full items-center p-0">
            <Link href={"/dashboard/help"}>
              {t("nav_help")}
              <HelpingHandIcon className="w-4 h-4" />
            </Link>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex flex-row justify-between items-center">
          {t("label_theme")}
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
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="py-0">
          <Button
            onClick={signOutAction}
            variant={"ghost"}
            size={"sm"}
            className="flex justify-between w-full items-center p-0">
            {t("label_logout")}
            <LogOutIcon className="w-4 h-4" />
          </Button>
        </DropdownMenuItem>
        {user.subscription.plan === "free_trial" && (
          <div className="flex flex-col">
            <DropdownMenuSeparator />
            <ManageSubscription>
              <Button size={"sm"} variant={"secondary"} className="m-1">
                {t("label_upgrade")}
              </Button>
            </ManageSubscription>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
const NavApp = () => {
  const t = useTranslations("app");
  const editorStore = useEditorStore();
  const pathname = usePathname();
  const isActive = (path: string) => path === pathname;
  const borderB = pathname === "/dashboard/forms";

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
  ];

  useQuery({
    queryKey: [],
    queryFn: () => {
      editorStore.reset();
      return null;
    },
  });

  return (
    <div
      className={`${
        borderB ? "" : ""
      } border-t border-t-foreground/5 h-12 flex items-center px-2 sm:px-4 justify-between z-10 bg-background fixed w-full`}>
      <div className="flex justify-center items-center gap-4 h-full">
        <div className="flex justify-center items-center gap-2">
          <Button variant={"ghost"} size={"icon"} className="h-9 w-9" asChild>
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
          <Feedback>
            <Button variant={"outline"} size={"xs"}>
              <MessageSquareCodeIcon className="w-4 h-4 mr-2" />
              {t("fb_label")}
            </Button>
          </Feedback>
        </div>
        <AvatarAppMenu />
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
  const { form, theme, blocks, blocksReadyOnly, preview, setPreview } = useEditorStore();
  const { subscription } = useUserStore();
  const queryClient = useQueryClient();
  const supabase = createClient();
  const router = useRouter();
  const [appState, setAppState] = useState<TAppState>("idle");
  const active = isSubscriptionActive(subscription);
  const empty = blocks.length <= 0;

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
      const { error } = await supabase
        .from("forms")
        .update({
          name: form.name,
          description: form.description,
          status: form.status,
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
      let inBoth = [];
      let inEither = [];
      let newElements = [];
      let removedElements = [];
      let elementsToUpsert = [];
      let elementsToDelete = [];

      const beforeIds = new Set(elementsBefore.map((x) => x.id));
      const afterIds = new Set(elementsAfter.map((x) => x.id));

      inBoth = [
        ...elementsBefore.filter((x) => afterIds.has(x.id)),
        ...elementsAfter.filter((x) => beforeIds.has(x.id)),
      ];
      inEither = [
        ...elementsBefore.filter((x) => !afterIds.has(x.id)),
        ...elementsAfter.filter((x) => !beforeIds.has(x.id)),
      ];

      inBoth = inBoth.filter((item, index, self) => self.findIndex((x) => x.id === item.id) === index);
      inEither = inEither.filter((item, index, self) => self.findIndex((x) => x.id === item.id) === index);

      newElements = inEither.filter((x) => afterIds.has(x.id));
      removedElements = inEither.filter((x) => beforeIds.has(x.id));

      elementsToUpsert = inBoth.map((before) => {
        const after = elementsAfter.find((x) => x.id === before.id);
        if (after && JSON.stringify(before) !== JSON.stringify(after)) {
          return { ...before, ...after };
        }
        return before;
      });

      elementsToUpsert = [...elementsToUpsert, ...newElements];

      elementsToDelete = [...removedElements];

      const { error: upsertError } = await supabase.from("blocks").upsert(elementsToUpsert);
      if (upsertError) {
        throw new Error(t("err_generic"));
      }

      const deletePromises = elementsToDelete.map(async (x) => await supabase.from("blocks").delete().eq("id", x.id));
      const deleteResults = await Promise.all(deletePromises);

      deleteResults.forEach(({ error }, index) => {
        if (error) {
          throw new Error(t("err_generic"));
        }
      });
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="h-12 flex justify-between items-center w-full bg-background border-y border-y-foreground/5 sm:px-4 px-2 z-20 fixed">
      <div className="flex justify-center items-center gap-1">
        <Button variant={"ghost"} size={"icon"} className="h-9 w-9" asChild>
          <Link href={"/dashboard/forms"}>
            <Brand type="logo" className="h-5 fill-foreground" />
          </Link>
        </Button>
        <div className="flex justify-center items-center gap-2">
          <span className="text-sm font-medium truncate max-w-[280px] hover:bg-foreground/5 py-1 px-2 flex justify-center items-center rounded">
            {form.name}
          </span>
        </div>
      </div>
      {active && (
        <div className="flex justify-center items-center gap-4">
          {form.updated_at !== "" && (
            <span className="text-xs text-foreground/80 hidden sm:flex">
              {t("label_last_updated")}: {new Date(form.updated_at).toLocaleString()}
            </span>
          )}
          {!empty && (
            <Button size={"xs"} variant={"outline"} className="flex sm:hidden" onClick={() => setPreview(!preview)}>
              {preview ? t("label_close") : t("label_preview")}
            </Button>
          )}
          {!preview && (
            <Button size={"xs"} variant={"secondary"} onClick={onSave} disabled={appState === "loading"}>
              {appState === "loading" && <LoaderIcon className="animate-spin w-4 h-4 mr-2" />}
              {t("label_save_form")}
            </Button>
          )}
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

export default Nav;
