"use client";

import { signOutAction } from "@/app/actions/auth-actions";
import Brand from "@/components/shared/brand";
import ModeToggle2 from "@/components/shared/mode-toggle2";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import useAppStore from "@/stores/app";
import useEditorStore from "@/stores/editor";
import useUserStore from "@/stores/user";
import { minute } from "@/utils/constants";
import { TPlan } from "@/utils/pricing";
import { createClient } from "@/utils/supabase/client";
import { TAppState } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import Avvvatars from "avvvatars-react";
import {
  BoxesIcon,
  CheckIcon,
  ChevronsUpDownIcon,
  CircleHelpIcon,
  CircleUserIcon,
  LoaderIcon,
  LogOutIcon,
  MenuIcon,
  PlusIcon,
  XIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import FeedbackForm from "../custom/feedback-form";
import PlanBadge from "../custom/plan-badge";

const Navbar = () => {
  const pathname = usePathname();
  const isEditorResource = pathname.split("/")[6] === "editor";
  const isInOrg = pathname.includes("/organizations/") && pathname.split("/organizations/")[1]?.split("/")[0] !== "";
  const isCheckoutResource = pathname.includes("/checkout-result");

  if (isEditorResource) return <EditorNavbar />;
  if (isInOrg) return <AfterOrgNavbar />;
  if (isCheckoutResource) return null;
  return <BeforeOrgNavbar />;
};
const BeforeOrgNavbar = () => {
  const t = useTranslations("app");
  const [open, setOpen] = useState(false);

  return (
    <nav className={`${open ? "" : "border-b"} z-10 flex flex-col bg-background fixed w-full`}>
      <div className="flex w-full justify-between items-center h-14 px-4 sm:px-6">
        {/* content */}
        <div>
          <Button variant={"ghost"} size={"icon"} className="p-2" asChild>
            <a href={"/dashboard/organizations"}>
              <Brand type="logo" className="h-5 fill-foreground" />
            </a>
          </Button>
        </div>
        {/* avatar - desk */}
        <div className="hidden sm:flex justify-center items-center gap-4">
          <FeedbackForm>
            <Button variant={"outline"} size={"sm"}>
              {t("label_feedback")}
            </Button>
          </FeedbackForm>
          <AvatarMenuDesk />
        </div>
        {/* avatar = mob */}
        <div className="sm:hidden">
          <Button variant={"ghost"} size={"icon"} onClick={() => setOpen(!open)}>
            {open ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </Button>
        </div>
      </div>
      {open && <AvatarMenuMob />}
    </nav>
  );
};
const AfterOrgNavbar = () => {
  const t = useTranslations("app");
  const app = useAppStore();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const orgId = pathname.split("/")[3];
  const formId = pathname.split("/")[5];
  const isFormResource = pathname.split("/")[4] === "form";
  const orgPath = `/dashboard/organizations/${orgId}/forms`;
  const formPath = `/dashboard/organizations/${orgId}/form/${formId}/overview`;

  return (
    <nav className="z-40 flex flex-col bg-background fixed w-full">
      <div className="flex w-full justify-between items-center h-14 px-4 sm:px-6">
        {/* content */}
        <div className="flex justify-center items-center gap-2">
          <Button variant={"ghost"} size={"icon"} className="p-2" asChild>
            <a href={"/dashboard/organizations"}>
              <Brand type="logo" className="h-5 fill-foreground" />
            </a>
          </Button>
          {orgId && app.organization.name !== "" && (
            <div className="hidden sm:flex justify-start items-center gap-2">
              <Separator orientation="vertical" className="h-4 bg-muted-foreground rotate-12" />
              <div className="flex justify-center items-center gap-0">
                <Link
                  href={orgPath}
                  className="text-sm hover:bg-foreground/10 p-1 rounded flex justify-center items-center gap-2">
                  <PlanBadge size={"sm"} type={app.subscription.plan as TPlan} />
                  {app.organization.name}
                </Link>
                <SearchOrgs orgId={orgId}>
                  <Button variant={"ghost"} size={"icon"} className="w-5 h-5">
                    <ChevronsUpDownIcon className="w-4 h-4" />
                  </Button>
                </SearchOrgs>
              </div>
              {formId && isFormResource && (
                <div className="flex justify-center items-center gap-0">
                  <Separator orientation="vertical" className="h-4 bg-muted-foreground rotate-12 mr-2" />
                  <Link href={formPath} className="text-sm hover:bg-foreground/10 px-2 py-1 rounded">
                    {app.form.name}
                  </Link>
                  <SearchForms orgId={orgId}>
                    <Button variant={"ghost"} size={"icon"} className="w-5 h-5">
                      <ChevronsUpDownIcon className="w-4 h-4" />
                    </Button>
                  </SearchForms>
                </div>
              )}
            </div>
          )}
        </div>
        {/* avatar - desk */}
        <div className="hidden sm:flex justify-center items-center gap-4">
          <FeedbackForm>
            <Button variant={"outline"} size={"sm"}>
              {t("label_feedback")}
            </Button>
          </FeedbackForm>
          <AvatarMenuDesk />
        </div>
        {/* avatar - mob */}
        <div className="sm:hidden">
          <Button variant={"ghost"} size={"icon"} onClick={() => setOpen(!open)}>
            {open ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </Button>
        </div>
      </div>
      {open && (
        <div className="fixed w-full mt-14 z-20">
          <AvatarMenuMob />
        </div>
      )}
    </nav>
  );
};
const AvatarMenuDesk = () => {
  const t = useTranslations("app");
  const user = useUserStore();

  const resources = [
    { name: t("label_organizations"), path: "/dashboard/organizations", icon: BoxesIcon, enabled: true },
    { name: t("label_account"), path: "/dashboard/account/general", icon: CircleUserIcon, enabled: true },
    { name: t("label_help"), path: "/dashboard/help", icon: CircleHelpIcon, enabled: true },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avvvatars value={user.email} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-64" align="end" sideOffset={6}>
        {user.email !== "" && (
          <>
            <div className="flex flex-col p-1">
              <span className="text-base font-semibold">{user.profile.first_name}</span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        <div className="flex flex-col gap-2 p-1">
          {resources.map((r) => {
            return (
              <a
                key={r.name}
                href={r.path}
                className="flex justify-between items-center w-full p-1 hover:bg-foreground/5 rounded">
                <span className="text-sm">{r.name}</span>
                <r.icon className="w-4 h-4" />
              </a>
            );
          })}
        </div>
        <div className="p-1 px-2 flex justify-between items-center">
          <span className="text-sm">{t("label_theme")}</span>
          <ModeToggle2 />
        </div>
        <DropdownMenuSeparator />
        <button
          onClick={signOutAction}
          className="p-2 text-sm flex items-center justify-between w-full hover:bg-destructive/5 hover:text-destructive">
          {t("label_logout")}
          <LogOutIcon className="w-4 h-4" />
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
const AvatarMenuMob = () => {
  const t = useTranslations("app");

  const resources = [
    { name: t("label_organizations"), path: "/dashboard/organizations", icon: BoxesIcon, enabled: true },
    { name: t("label_account"), path: "/dashboard/account/general", icon: CircleUserIcon, enabled: true },
    { name: t("label_help"), path: "/dashboard/help", icon: CircleHelpIcon, enabled: true },
  ];

  return (
    <div className="border-b flex w-full px-4 sm:px-6 pb-4 flex-col bg-background z-50">
      <div className="flex flex-col w-full gap-2">
        {resources.map((r) => (
          <Link
            key={r.name}
            href={r.path}
            className="flex justify-between items-center group hover:bg-foreground/5 p-2 rounded">
            <span className="text-sm">{r.name}</span>
            <r.icon className="w-5 h-5" />
          </Link>
        ))}
      </div>
      <div className="p-2 flex justify-between items-center w-full">
        <span className="text-sm">{t("label_theme")}</span>
        <ModeToggle2 />
      </div>
      <button onClick={signOutAction} className="p-2 flex justify-between items-center w-full hover:bg-foreground/5">
        <span className="text-sm">{t("label_logout")}</span>
      </button>
    </div>
  );
};
const EditorNavbar = () => {
  const t = useTranslations("app");
  const app = useAppStore();
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const editor = useEditorStore();
  const [appState, setAppState] = useState<TAppState>("idle");
  const orgId = pathname.split("/")[3];
  const formId = pathname.split("/")[5];
  const overviewPath = `/dashboard/organizations/${orgId}/form/${formId}/overview`;

  const handleSave = async () => {
    if (appState === "loading") return;
    try {
      setAppState("loading");
      await Promise.all([saveForm(), saveTheme(), saveBlocks()]);
      toast.success(t("suc_update_form"));
      router.push(overviewPath);
    } catch (error) {
      toast.error((error as Error).message || t("err_generic"));
      setAppState("idle");
    }
  };
  const saveForm = async () => {
    try {
      const newStatus = editor.blocks.length <= 0 ? "draft" : editor.form.status;
      const { error } = await supabase
        .from("forms")
        .update({
          name: editor.form.name,
          description: editor.form.description,
          status: newStatus,
          submit_label: editor.form.submit_label,
          success_title: editor.form.success_title,
          success_description: editor.form.success_description,
        })
        .eq("id", editor.form.id);

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
        numeric_blocks: editor.theme.numeric_blocks,
        app_branding: editor.theme.app_branding,
        uppercase_block_name: editor.theme.uppercase_block_name,
        custom_primary_color: editor.theme.custom_primary_color,
      })
      .eq("id", editor.theme.id);

    if (error) {
      throw new Error(t("err_generic"));
    }
  };
  const saveBlocks = async () => {
    const elementsBefore = editor.originalBlocks;
    const elementsAfter = editor.blocks;

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

  if (!app.context.isSubscriptionActive) return null;

  return (
    <nav className="z-10 flex flex-col bg-background fixed w-full border-b">
      <div className="flex w-full justify-between items-center h-14 px-4 sm:px-6">
        <div className="flex justify-center items-center gap-2">
          <Button variant={"ghost"} size={"icon"} className="p-2" asChild>
            <a href={overviewPath}>
              <Brand type="logo" className="h-5 fill-foreground" />
            </a>
          </Button>
          <div className="flex justify-center items-center gap-2">
            <Separator orientation="vertical" className="h-4 bg-muted-foreground rotate-12" />
            <Link href={""} className="text-sm hover:bg-foreground/10 px-2 py-1 rounded">
              {editor.form.name}
            </Link>
          </div>
        </div>
        <div>
          <Button size={"sm"} variant={"secondary"} onClick={handleSave} disabled={appState === "loading"}>
            {appState === "loading" && <LoaderIcon className="animate-spin w-4 h-4 mr-2" />}
            {t("label_save_form")}
          </Button>
        </div>
      </div>
    </nav>
  );
};
const SearchOrgs = ({ children, orgId }: { children: React.ReactNode; orgId: string }) => {
  const t = useTranslations("app");
  const supabase = createClient();
  const app = useAppStore();

  const query = useQuery({
    queryKey: ["orgs", orgId],
    queryFn: async () => {
      const teamMemberProfiles = await supabase
        .from("team_member_profiles")
        .select("org_id")
        .eq("profile_id", app.teamMemberProfile.profile_id);
      if (teamMemberProfiles.error) return null;

      const orgIds = teamMemberProfiles.data.map((x) => x.org_id);
      const organizations = await supabase.from("organizations").select("name, public_id").in("id", orgIds);
      if (organizations.error) return null;

      return { orgs: organizations.data };
    },
    staleTime: 10 * minute,
    gcTime: 10 * minute,
  });

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align="start" className="p-0 z-50">
        <div className="flex flex-col">
          <div className="px-3 py-2 border-b">
            <h3 className="font-semibold text-sm">{t("label_organizations")}</h3>
          </div>
          <div className="max-h-60 overflow-y-auto p-2">
            {query.isPending ? (
              <div className="flex justify-center items-center p-4">
                <LoaderIcon className="w-5 h-5 animate-spin" />
              </div>
            ) : query.data ? (
              <div className="flex flex-col gap-1">
                {query.data.orgs.map((x) => (
                  <a
                    href={`/dashboard/organizations/${x.public_id}/forms`}
                    key={x.name}
                    className={`${
                      x.public_id === app.organization.public_id ? "bg-foreground/5" : ""
                    } px-3 py-2 text-sm rounded transition-colors flex items-center gap-2 hover:bg-foreground/5 group`}>
                    <span className="flex-1 truncate">{x.name}</span>
                    {x.public_id === app.organization.public_id && <CheckIcon className="w-4 h-4" />}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
const SearchForms = ({ children, orgId }: { children: React.ReactNode; orgId: string }) => {
  const t = useTranslations("app");
  const supabase = createClient();
  const app = useAppStore();

  const query = useQuery({
    queryKey: ["forms", orgId],
    queryFn: async () => {
      const forms = await supabase
        .from("forms")
        .select("name, public_id")
        .eq("org_id", app.organization.id)
        .order("created_at", { ascending: true });

      if (forms.error) return null;

      return { forms: forms.data };
    },
    staleTime: 10 * minute,
    gcTime: 10 * minute,
  });

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align="start" className="p-0 z-50">
        <div className="flex flex-col">
          <div className="px-3 py-2 border-b">
            <h3 className="font-semibold text-sm">{t("label_forms")}</h3>
          </div>
          <div className="max-h-60 overflow-y-auto p-2">
            {query.isPending ? (
              <div className="flex justify-center items-center p-4">
                <LoaderIcon className="w-5 h-5 animate-spin" />
              </div>
            ) : query.data ? (
              <div className="flex flex-col gap-1">
                {query.data.forms.map((x) => (
                  <a
                    href={`/dashboard/organizations/${orgId}/form/${x.public_id}/overview`}
                    key={x.name}
                    className={`${
                      x.public_id === app.form.public_id ? "bg-foreground/5" : ""
                    } px-3 py-2 text-sm rounded transition-colors flex items-center gap-2 hover:bg-foreground/5 group`}>
                    <span className="flex-1 truncate">{x.name}</span>
                    {x.public_id === app.form.public_id && <CheckIcon className="w-4 h-4" />}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
          <div className="w-full flex p-2">
            <Button className="w-full" variant={"outline"} size={"sm"} asChild>
              <Link href={`/dashboard/organizations/${app.organization.public_id}/forms/new`}>
                <PlusIcon className="w-4 h-4 mr-2" /> {t("label_create_form")}
              </Link>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Navbar;
