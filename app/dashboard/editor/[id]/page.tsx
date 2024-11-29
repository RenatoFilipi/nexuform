"use client";

import Brand2 from "@/components/core/brand-2";
import GenericError from "@/components/core/generic-error";
import GenericLoader from "@/components/core/generic-loader";
import AddBlock from "@/components/private/blocks/add-block";
import Block from "@/components/private/blocks/block";
import FormDesign from "@/components/private/forms/form-design";
import FormGroup from "@/components/private/forms/form-group";
import FormReorder from "@/components/private/forms/form-reorder";
import FormSettings from "@/components/private/forms/form-settings";
import { Button } from "@/components/ui/button";
import { nanoid } from "@/helpers/functions";
import { appState, colorLabel } from "@/helpers/types";
import { formSettingsList } from "@/mocks/forms";
import { FormModel } from "@/models/form";
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

const Editor = () => {
  const {
    blocks,
    setName,
    name,
    description,
    ownerId,
    id,
    numericBlocks,
    primaryColor,
    status,
    submitLabel,
    setId,
    setBlocks,
    setDescription,
    setNumericBlock,
    setOwnerId,
    setPrimaryColor,
    setStatus,
    setSubmitLabel,
    reset,
  } = useEditorStore();

  const pathname = usePathname();
  const [isPreview, setIsPreview] = useState(false);
  const [appState, setAppState] = useState<appState>("loading");

  useQuery({
    queryKey: ["editorPageData"],
    queryFn: () => {
      reset();
      const formId = pathname.split("/")[3];
      const formItem = formSettingsList.find((x) => x.id === formId);

      if (!formItem) {
        setAppState("idle");
        return null;
      }

      setId(formId);
      setOwnerId(formItem.owner_id);
      setName(formItem.name);
      setDescription(formItem.description);
      setStatus(formItem.status);
      setSubmitLabel(formItem.submit_label);
      setNumericBlock(formItem.numeric_blocks);
      setPrimaryColor(formItem.primary_color as colorLabel);
      setBlocks(formItem.blocks);
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
          <FormGroup mode="preview" />
          <div className="flex justify-center items-center w-full py-2">
            <span className="border rounded p-2 flex justify-center items-center gap-2 hover:bg-foreground/5 cursor-pointer">
              <Brand2 type="logo" className="fill-foreground w-4 h-4" />
              <span className="text-foreground/80 text-sm font-semibold ">
                Powered by Nebulaform
              </span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  const onSave = () => {
    console.log(nanoid());

    const formModel: FormModel = {
      id,
      owner_id: ownerId,
      name,
      description,
      blocks,
      created_at: "",
      updated_at: "",
      numeric_blocks: numericBlocks,
      primary_color: primaryColor,
      submit_label: submitLabel,
      status,
      responses: 1,
      views: 4,
    };
  };

  return (
    <div className="flex flex-col h-screen flex-1 gap-4">
      <div className="fixed h-14 flex justify-between items-center w-full top-0 bg-background border-b sm:px-6 px-2 z-20">
        <div className="flex justify-center items-center gap-2">
          <Button variant={"ghost"} size={"icon"} className="h-9 w-9" asChild>
            <Link href={"/dashboard/forms"}>
              <Brand2 type="logo" className="h-7 fill-foreground" />
            </Link>
          </Button>
          {appState === "loading" && <GenericLoader className="w-4 h-4" />}
          {appState === "idle" && (
            <span className="text-foreground/80 text-sm font-semibold">
              {name}
            </span>
          )}
        </div>
        <div className="hidden sm:flex justify-center items-center gap-4">
          <Button onClick={onSave} variant={"secondary"} size={"sm"}>
            Save
          </Button>
        </div>
        <div className="flex sm:hidden justify-center items-center gap-2">
          <Button
            onClick={() => setIsPreview(true)}
            variant={"outline"}
            size={"sm"}>
            Preview
          </Button>
          <Button variant={"secondary"} size={"sm"}>
            Save
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
          <div className="sm:w-[360px] w-full flex flex-col p-4 gap-6 fixed bg-background h-full overflow-y-auto pt-14">
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
                <span className="text-foreground/80 text-sm">
                  No block added.
                </span>
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
            <div className="hidden sm:flex justify-center items-center flex-1 bg-foreground/5 ml-[360px] pt-14">
              <div className="flex justify-center items-center gap-3 flex-col">
                <div className="flex justify-center items-center p-2 bg-primary w-fit rounded">
                  <BlocksIcon className="text-black" />
                </div>
                <span className="text-foreground/80 text-sm">
                  No blocks to preview.
                </span>
              </div>
            </div>
          )}
          {blocks.length >= 1 && (
            <div className="hidden sm:flex flex-1 bg-foreground/5 justify-center items-start ml-[360px] pt-14">
              <div className="bg-background w-full rounded mx-8 my-8 flex flex-col px-10 py-4 gap-6">
                <FormGroup mode="preview" />
                <div className="flex justify-center items-center">
                  <span className="border rounded p-2 flex justify-center items-center gap-2 hover:bg-foreground/5 cursor-pointer">
                    <Brand2 type="logo" className="fill-foreground w-4 h-4" />
                    <span className="text-foreground/80 text-sm font-semibold ">
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
