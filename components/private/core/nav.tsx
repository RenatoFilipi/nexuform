"use client";

import { signOutAction } from "@/app/actions";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useEditorStore from "@/stores/editor";
import useFormStore from "@/stores/form";
import { createClient } from "@/utils/supabase/client";
import { TAppState } from "@/utils/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChartPieIcon,
  Layers2Icon,
  LoaderIcon,
  LogOutIcon,
  Menu,
  MonitorIcon,
  MoonIcon,
  Settings2Icon,
  SunIcon,
} from "lucide-react";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

const links = [
  {
    id: 1,
    name: "Dashboard",
    path: "/dashboard/forms",
    icon: <Layers2Icon className="w-4 h-4 mr-2" />,
    enabled: true,
  },
  {
    id: 2,
    name: "Analytics",
    path: "/dashboard/analytics",
    icon: <ChartPieIcon className="w-4 h-4 mr-2" />,
    enabled: true,
  },
  {
    id: 3,
    name: "Settings",
    path: "/dashboard/settings",
    icon: <Settings2Icon className="w-4 h-4 mr-2" />,
    enabled: false,
  },
];
const Nav = () => {
  const pathname = usePathname();

  if (pathname.includes("dashboard/editor/")) return <NavEditor />;
  return <NavApp />;
};
const NavAppMobile = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (path: string) => path === pathname;
  const { setTheme, theme } = useTheme();

  // app
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-screen flex flex-col gap-4">
        <div className="flex flex-col">
          {links.map((link) => {
            if (link.enabled)
              return (
                <Link
                  onClick={() => setOpen(false)}
                  key={link.id}
                  href={link.path}
                  className={`${
                    isActive(link.path) &&
                    "bg-primary text-white hover:bg-primary"
                  } p-2 border hover:bg-foreground/5 text-sm flex justify-start items-center`}>
                  {link.icon}
                  {link.name}
                </Link>
              );
          })}
        </div>
        <div className="flex flex-col w-full gap-2">
          <div className="flex justify-between items-center px-2">
            <span className="text-sm flex items-center justify-center">
              Theme
            </span>
            <RadioGroup
              value={theme}
              onValueChange={setTheme}
              className="flex gap-1">
              <div>
                <RadioGroupItem
                  value="system"
                  id="system"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="system"
                  className="text-xs cursor-pointer flex items-center justify-start gap-2 rounded-md border-1 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:bg-foreground/10">
                  <MonitorIcon className="w-3 h-3" />
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="light"
                  id="light"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="light"
                  className="text-xs cursor-pointer flex items-center justify-start gap-2 rounded-md border-1 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:bg-foreground/10">
                  <SunIcon className="w-3 h-3" />
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="dark"
                  id="dark"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="dark"
                  className="text-xs cursor-pointer flex items-center justify-start gap-2 rounded-md border-1 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:bg-foreground/10">
                  <MoonIcon className="w-3 h-3" />
                </Label>
              </div>
            </RadioGroup>
          </div>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="flex justify-between"
            asChild>
            <Link href={"/"}>
              Log out
              <LogOutIcon className="w-4 h-4" />
            </Link>
          </Button>
        </div>
        <div className="flex justify-end items-center gap-2 p-2">
          <Link
            href={"/legal/privacy"}
            className="text-xs text-foreground/80 hover:underline">
            Privacy
          </Link>
          <Link
            href={"/legal/terms"}
            className="text-xs text-foreground/80 hover:underline">
            Terms
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
const AvatarAppMenu = () => {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarFallback className="text-sm bg-foreground/10 text-foreground font-bold">
            RF
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-6 min-w-52 text-foreground/80">
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem className="flex flex-row justify-between items-center">
          Theme
          <RadioGroup
            value={theme}
            onValueChange={setTheme}
            className="flex gap-1">
            <div>
              <RadioGroupItem
                value="system"
                id="system"
                className="peer sr-only"
              />
              <Label
                htmlFor="system"
                className="text-xs cursor-pointer flex items-center justify-start gap-2 rounded-md border-1 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:bg-foreground/10">
                <MonitorIcon className="w-3 h-3" />
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="light"
                id="light"
                className="peer sr-only"
              />
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
        <DropdownMenuItem>
          <Button
            onClick={signOutAction}
            variant={"ghost"}
            size={"sm"}
            className="flex justify-between w-full items-center p-0">
            Log out
            <LogOutIcon className="w-4 h-4" />
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
const NavApp = () => {
  const editorStore = useEditorStore();
  const formStore = useFormStore();
  const pathname = usePathname();
  const isActive = (path: string) => path === pathname;

  useQuery({
    queryKey: [],
    queryFn: () => {
      editorStore.reset();
      return null;
    },
  });

  return (
    <div className="border-y border-t-foreground/5 h-14 flex items-center px-2 sm:px-6 justify-between z-10 bg-background fixed w-full">
      <div className="flex justify-center items-center gap-3 h-full">
        <div className="flex justify-center items-center gap-4">
          <Button variant={"ghost"} size={"icon"} className="h-9 w-9" asChild>
            <Link href={"/dashboard/forms"}>
              <Brand type="logo" className="h-7 fill-foreground" />
            </Link>
          </Button>
        </div>
        <div className="hidden sm:flex justify-center items-center gap-0 h-full">
          {links.map((link) => {
            if (link.enabled)
              return (
                <Link
                  key={link.id}
                  href={link.path}
                  className={`${
                    isActive(link.path) && ""
                  } text-sm h-full flex justify-center items-center px-3 hover:bg-foreground/5 relative`}>
                  {isActive(link.path) && (
                    <div className="bg-foreground/80 bottom-0 w-full h-1 absolute"></div>
                  )}
                  {link.icon}
                  {link.name}
                </Link>
              );
          })}
        </div>
      </div>
      <div className="hidden sm:flex justify-center items-center gap-4">
        <Feedback>
          <Button variant={"outline"} size={"sm"}>
            Feedback
          </Button>
        </Feedback>
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
  const { form, theme, blocks, blocksReadyOnly, preview, setPreview } =
    useEditorStore();
  const queryClient = useQueryClient();
  const supabase = createClient();
  const router = useRouter();
  const [appState, setAppState] = useState<TAppState>("idle");

  const onSave = async () => {
    try {
      setAppState("loading");

      await onSaveForm();
      await onSaveTheme();
      await onSaveBlocks();

      toast.success("Form Updated.");
      queryClient.invalidateQueries({ queryKey: ["submissionData"] });
      router.push(`/dashboard/forms/${form.id}`);
    } catch (error) {
      toast.error((error as Error).message || "Something went wrong.");
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
        })
        .eq("id", form.id);

      if (error) {
        console.error("Error updating form:", error);
        throw new Error("Failed to update form.");
      }
    } catch (error) {
      console.error("Unexpected error in onSaveForm:", error);
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
        })
        .eq("id", theme.id);

      if (error) {
        console.error("Error updating theme:", error);
        throw new Error("Failed to update theme.");
      }
    } catch (error) {
      console.error("Unexpected error in onSaveTheme:", error);
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

      inBoth = inBoth.filter(
        (item, index, self) => self.findIndex((x) => x.id === item.id) === index
      );
      inEither = inEither.filter(
        (item, index, self) => self.findIndex((x) => x.id === item.id) === index
      );

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

      const { error: upsertError } = await supabase
        .from("blocks")
        .upsert(elementsToUpsert);
      if (upsertError) {
        console.error("Error upserting blocks:", upsertError);
        throw new Error("Failed to upsert blocks.");
      }

      const deletePromises = elementsToDelete.map(
        async (x) => await supabase.from("blocks").delete().eq("id", x.id)
      );
      const deleteResults = await Promise.all(deletePromises);

      deleteResults.forEach(({ error }, index) => {
        if (error) {
          console.error(
            `Error deleting block with id ${elementsToDelete[index].id}:`,
            error
          );
          throw new Error("Failed to delete blocks.");
        }
      });
    } catch (error) {
      console.error("Unexpected error in onSaveBlocks:", error);
      throw error;
    }
  };

  return (
    <div className="h-14 flex justify-between items-center w-full bg-background border-y border-t-foreground/5 sm:px-6 px-2 z-20 fixed">
      <div className="flex justify-center items-center gap-2">
        <Button variant={"ghost"} size={"icon"} className="h-9 w-9" asChild>
          <Link href={"/dashboard/forms"}>
            <Brand type="logo" className="h-5 fill-foreground" />
          </Link>
        </Button>
        <div className="flex justify-center items-center gap-2">
          <span className="text-sm font-medium truncate max-w-[280px]">
            {form.name}
          </span>
        </div>
      </div>
      <div className="flex justify-center items-center gap-2">
        {form.updated_at !== "" && (
          <span className="text-sm text-foreground/80 mr-5 hidden sm:flex">
            Last updated at {new Date(form.updated_at).toLocaleString()}
          </span>
        )}
        <Button
          variant={"outline"}
          size={"sm"}
          className="flex sm:hidden"
          onClick={() => setPreview(!preview)}>
          Preview
        </Button>
        <Button
          size={"sm"}
          variant={"default"}
          onClick={onSave}
          disabled={appState === "loading"}>
          {appState === "loading" ? (
            <LoaderIcon className="animate-spin w-4 h-4" />
          ) : (
            "Save Form"
          )}
        </Button>
      </div>
    </div>
  );
};

export default Nav;
