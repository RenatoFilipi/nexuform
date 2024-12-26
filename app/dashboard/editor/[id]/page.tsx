"use client";

import Brand from "@/components/core/brand";
import GenericError from "@/components/core/generic-error";
import GenericLoader from "@/components/core/generic-loader";
import AddBlock from "@/components/private/blocks/add-block";
import Block from "@/components/private/blocks/block";
import FormDesign from "@/components/private/forms/form-design";
import FormGroupPreview from "@/components/private/forms/form-group-preview";
import FormReorder from "@/components/private/forms/form-reorder";
import FormSettings from "@/components/private/forms/form-settings";
import { Button } from "@/components/ui/button";
import { mockBlocks, mockForms } from "@/helpers/mocks";
import { appState, colorLabel } from "@/helpers/types";
import useEditorStore from "@/stores/editor";
import { useQuery } from "@tanstack/react-query";
import {
  BlocksIcon,
  ListIcon,
  PaintbrushIcon,
  PlusIcon,
  Settings2Icon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const tips = [
  {
    desc: "Add new blocks to enrich your form",
    icon: (
      <div className="flex justify-center items-center p-3 rounded bg-blue-500/15 text-blue-600">
        <BlocksIcon />
      </div>
    ),
  },
  {
    desc: "Customize the layout and appearance of your form",
    icon: (
      <div className="flex justify-center items-center p-3 rounded bg-green-500/15 text-green-600">
        <PaintbrushIcon />
      </div>
    ),
  },
  {
    desc: "Configure your form preferences and update settings as needed",
    icon: (
      <div className="flex justify-center items-center p-3 rounded bg-yellow-500/15 text-yellow-600">
        <Settings2Icon />
      </div>
    ),
  },
  {
    desc: "Rearrange the blocks in your form to adjust the flow and structure. Drag and drop to reorder them as needed",
    icon: (
      <div className="flex justify-center items-center p-3 rounded bg-purple-500/15 text-purple-600">
        <ListIcon />
      </div>
    ),
  },
];

const Editor = () => {
  const {
    blocks,
    name,
    id,
    description,
    numericBlocks,
    ownerId,
    status,
    submitLabel,
    theme,
    setId,
    setName,
    setBlocks,
    setDescription,
    setNumericBlock,
    setOwnerId,
    setTheme,
    setStatus,
    setSubmitLabel,
    reset,
  } = useEditorStore();

  const pathname = usePathname();
  const formId = pathname.split("/")[3];
  const [isPreview, setIsPreview] = useState(false);
  const [appState, setAppState] = useState<appState>("loading");
  const [saveState, setSaveState] = useState<appState>("idle");

  useQuery({
    queryKey: ["editorPageData"],
    queryFn: () => {
      reset();
      const form = mockForms.find((x) => x.id === formId);
      const blocks = mockBlocks.filter((x) => x.form_id === formId);
      if (!form) {
        setAppState("idle");
        return null;
      }
      setId(form.id);
      setName(form.name);
      setDescription(form.description);
      setOwnerId(form.owner_id);
      setNumericBlock(form.numeric_blocks);
      setTheme(form.theme as colorLabel);
      setStatus(form.status);
      setSubmitLabel(form.submit_label);
      setBlocks(blocks);
      setAppState("idle");
      return null;
    },
    refetchOnWindowFocus: false,
  });

  if (isPreview) {
    return (
      <div className="flex flex-col h-screen flex-1 gap-4">
        <div className="flex justify-end items-center p-2">
          <Button
            variant={"outline"}
            size={"icon"}
            onClick={() => setIsPreview(false)}>
            <XIcon />
          </Button>
        </div>
        <div className="px-5 flex flex-col justify-center items-center gap-6 overflow-y-auto">
          <FormGroupPreview />
          <div className="flex justify-center items-center w-full py-2">
            <span className="border rounded p-2 flex justify-center items-center gap-2 hover:bg-foreground/5 cursor-pointer">
              <Brand type="logo" className="fill-foreground w-4 h-4" />
              <span className="text-foreground/80 text-sm font-medium">
                Powered by Nebulaform
              </span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  const onSave = () => {
    setSaveState("loading");
    console.log(id);
    console.log(ownerId);
    console.log(name);
    console.log(description);
    console.log(status);
    console.log(numericBlocks);
    console.log(submitLabel);
    console.log(theme);
    console.log(blocks);
    setTimeout(() => {
      setSaveState("idle");
      toast.success("Form updated.");
    }, 2000);
  };

  return (
    <div className="flex flex-col h-screen flex-1 gap-4">
      <div className="fixed h-14 flex justify-between items-center w-full top-0 bg-background border-y border-t-foreground/5 sm:px-6 px-2 z-20">
        <div className="flex justify-center items-center gap-3">
          <Button variant={"ghost"} size={"icon"} className="h-9 w-9" asChild>
            <Link href={"/dashboard/forms"}>
              <Brand type="logo" className="h-7 fill-foreground" />
            </Link>
          </Button>
          {appState === "loading" && <GenericLoader className="w-4 h-4" />}
          {appState === "idle" && (
            <span className="text-foreground/80 text-sm font-medium">
              {name}
            </span>
          )}
        </div>
        <div className="hidden sm:flex justify-center items-center gap-4">
          <Button
            onClick={onSave}
            variant={"default"}
            size={"sm"}
            className="w-24">
            {saveState === "loading" ? (
              <GenericLoader className="w-5 h-5" />
            ) : (
              "Save Form"
            )}
          </Button>
        </div>
        <div className="flex sm:hidden justify-center items-center gap-2">
          <Button
            onClick={() => setIsPreview(true)}
            variant={"outline"}
            size={"sm"}>
            Preview
          </Button>
          <Button
            onClick={onSave}
            variant={"default"}
            size={"sm"}
            className="w-24">
            {saveState === "loading" ? (
              <GenericLoader className="w-5 h-5" />
            ) : (
              "Save Form"
            )}
          </Button>
        </div>
      </div>
      {appState === "loading" && (
        <div className="flex flex-1 justify-center items-center h-full pt-14">
          <div className="flex justify-center items-center gap-2 flex-col">
            <GenericLoader className="w-8 h-8" />
          </div>
        </div>
      )}
      {appState === "idle" && (
        <div className="flex flex-1 relative">
          <div className="sm:w-[360px] w-full flex flex-col p-4 gap-6 fixed bg-background h-full overflow-y-auto pt-14 border-r">
            <div className="flex flex-col gap-4 mt-4">
              <AddBlock formId={id}>
                <Button variant={"default"} size={"sm"} className="w-full">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add New Block
                </Button>
              </AddBlock>
              <div className="flex justify-center items-center gap-4">
                <FormDesign>
                  <Button variant={"outline"} size={"sm"} className="flex-1">
                    <PaintbrushIcon className="w-4 h-4 mr-2" />
                    Design
                  </Button>
                </FormDesign>
                <FormSettings>
                  <Button variant={"outline"} size={"sm"} className="flex-1">
                    <Settings2Icon className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </FormSettings>
                <FormReorder>
                  <Button variant={"outline"} size={"sm"} className="flex-1">
                    <ListIcon className="w-4 h-4 mr-2" />
                    Reorder
                  </Button>
                </FormReorder>
              </div>
            </div>
            {blocks.length <= 0 && (
              <div className="flex flex-1 justify-center items-center">
                <span className="text-foreground/80 text-sm">No block.</span>
              </div>
            )}
            {blocks.length >= 1 && (
              <div className="flex justify-start flex-col gap-2 overflow-y-auto">
                {blocks.map((block) => {
                  return <Block key={block.id} {...block} />;
                })}
              </div>
            )}
          </div>
          {blocks.length <= 0 && (
            <div className="hidden sm:flex justify-center items-center flex-1 ml-[360px] pt-14 ">
              <div className="flex justify-center items-center gap-3 flex-col">
                <div className="grid grid-cols-2 gap-8">
                  {tips.map((tip, index) => {
                    return (
                      <div
                        key={index}
                        className="bg-background border border-foreground/20 rounded flex flex-col justify-center items-center w-60 p-6">
                        {tip.icon}
                        <span className="text-center text-sm text-foreground/80 mt-4">
                          {tip.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          {blocks.length >= 1 && (
            <div className="hidden sm:flex flex-1 bg-neutral-50  dark:bg-black/30 justify-center items-start ml-[360px] pt-14 relative">
              <div className="bg-background w-full rounded mx-8 my-8 flex flex-col p-6 gap-6 sm:w-[600px] z-10 border">
                <FormGroupPreview />
                <div className="flex justify-center items-center">
                  <span className="border rounded p-2 flex justify-center items-center gap-2 hover:bg-foreground/5 cursor-pointer">
                    <Brand type="logo" className="fill-foreground w-4 h-4" />
                    <span className="text-foreground/80 text-sm font-medium">
                      Powered by Nebulaform
                    </span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {appState === "error" && (
        <div className="flex flex-1 justify-center items-center h-full pt-14">
          <GenericError />
        </div>
      )}
    </div>
  );
};

export default Editor;
