"use client";

import Brand from "@/components/core/brand";
import AddBlock from "@/components/private/blocks/add-block";
import Block from "@/components/private/blocks/block";
import FormDesign from "@/components/private/forms/form-design";
import FormSettings from "@/components/private/forms/form-settings";
import FormWrapper from "@/components/private/forms/form-wrapper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { dashboardEditorState } from "@/helpers/types";
import { formList } from "@/mocks/forms";
import useEditorStore from "@/stores/editor";
import { useQuery } from "@tanstack/react-query";
import { Reorder } from "framer-motion";
import {
  BlocksIcon,
  ChevronLeftIcon,
  Loader2,
  PaintbrushIcon,
  Settings2Icon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Editor = () => {
  const {
    blocks,
    setName,
    name,
    setBlocks,
    description,
    primaryColor,
    submitLabel,
  } = useEditorStore();
  const pathname = usePathname();
  const [isPreview, setIsPreview] = useState(false);
  const [state] = useState<dashboardEditorState>("no_block");
  const currentFormId = pathname.split("/")[3];
  const currentForm = formList.find((x) => x.id === currentFormId);

  useQuery({
    queryKey: ["editorPageData"],
    queryFn: () => {
      if (!currentForm) return null;
      setName(currentForm.title);
      return null;
    },
  });

  const handleDebug = () => {
    console.log(primaryColor);
    console.log(blocks);
  };

  if (isPreview) {
    return (
      <div className="h-full flex flex-col overflow-y-auto">
        <div className="w-full flex justify-end p-3">
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={() => setIsPreview(false)}>
            <ChevronLeftIcon className="w-4 h-4 mr-2" />
            Return to editor
          </Button>
        </div>
        <div className="flex h-full w-full overflow-y-auto">
          <FormWrapper
            mode="preview"
            name={name}
            description={description}
            primaryColor={primaryColor}
            submitLabel={submitLabel}
            blocks={blocks}
          />
        </div>
        <div className="flex justify-end items-center border-t sm:border-transparent sm:p-4 p-3">
          <Button
            variant={"outline"}
            size={"sm"}
            className="flex justify-center items-center gap-2"
            asChild>
            <Link
              href={"/"}
              className="flex justify-center items-center gap-1 text-base font-semibold">
              <span>
                Powered by{" "}
                <span className="font-bold bg-gradient-to-r from-[#75BDFF] via-[#FF75E9] to-[#FFA775] inline-block text-transparent bg-clip-text">
                  Nebulaform
                </span>
              </span>
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full relative">
      <div className="flex justify-between items-center h-16 px-2 sm:px-6 z-10 bg-background">
        <div className="flex justify-center items-center gap-4">
          <Button variant={"ghost"} size={"icon"} className="h-9 w-9" asChild>
            <Link href={"/dashboard/forms"}>
              <Brand type="logo" className="h-7 fill-foreground" />
            </Link>
          </Button>
          <span className="text-foreground/80 text-sm hidden sm:flex ">
            {name}
          </span>
        </div>
        <div className="flex justify-center items-center gap-4">
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={() => setIsPreview(true)}>
            Preview
          </Button>
          <Button onClick={handleDebug} variant={"secondary"} size={"sm"}>
            Save
          </Button>
        </div>
      </div>
      <div className="flex h-full w-full relative justify-center items-center overflow-y-auto">
        <Card className="absolute border p-1 sm:left-4 bottom-4 sm:bottom-auto sm:top-8 flex flex-row sm:flex-col items-center justify-center gap-2">
          <AddBlock>
            <Button variant={"ghost"} size={"icon"}>
              <BlocksIcon className="w-5 h-5" />
            </Button>
          </AddBlock>
          <FormDesign>
            <Button variant={"ghost"} size={"icon"}>
              <PaintbrushIcon className="w-5 h-5" />
            </Button>
          </FormDesign>
          <FormSettings>
            <Button variant={"ghost"} size={"icon"}>
              <Settings2Icon className="w-5 h-5" />
            </Button>
          </FormSettings>
        </Card>
        {state === "loading" && (
          <div className="flex justify-center items-center h-full w-full">
            <Loader2 className="animate-spin w-7 h-7" />
          </div>
        )}
        {blocks.length <= 0 && (
          <div className="flex justify-center items-center h-full w-full">
            <div className="flex flex-col justify-center items-center gap-3 mb-32">
              <BlocksIcon className="w-8 h-8" />
              <span>This form has no blocks.</span>
              <AddBlock>
                <Button variant={"secondary"} size={"sm"} className="w-full">
                  Add block
                </Button>
              </AddBlock>
            </div>
          </div>
        )}
        {blocks.length >= 1 && (
          <div className="flex w-full h-full pt-6 pb-20 justify-center px-2 sm:px-0 overflow-y-auto">
            <Reorder.Group
              values={blocks}
              onReorder={setBlocks}
              className="w-full flex flex-col items-center justify-start sm:max-w-[600px] gap-2 overflow-y-auto">
              {blocks.map((block) => (
                <Reorder.Item key={block.id} value={block} className="w-full">
                  <Block {...block} />
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
