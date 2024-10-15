"use client";

import Brand from "@/components/core/brand";
import AddBlock from "@/components/private/forms/add-block";
import Block from "@/components/private/forms/block";
import FormDesign from "@/components/private/forms/form-design";
import FormSettings from "@/components/private/forms/form-settings";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { dashboardEditorState } from "@/helpers/types";
import { formList } from "@/mocks/forms";
import useEditorStore from "@/stores/editor";
import { BrushIcon, LayoutGridIcon, Loader2, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Editor = () => {
  const { blocks } = useEditorStore();
  const pathname = usePathname();
  const [state] = useState<dashboardEditorState>("no_block");
  const currentFormId = pathname.split("/")[3];
  const currentForm = formList.find((x) => x.id === currentFormId);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex justify-between items-center h-16 px-2 sm:px-6 z-10 bg-background">
        <div className="flex justify-center items-center gap-4">
          <Button variant={"ghost"} size={"icon"} className="h-9 w-9" asChild>
            <Link href={"/dashboard/forms"}>
              <Brand type="logo" className="h-7 fill-foreground" />
            </Link>
          </Button>
          <span className="text-foreground/80 text-sm hidden sm:flex ">
            {currentForm?.title}
          </span>
        </div>
        <div className="flex justify-center items-center gap-4">
          <Button variant={"outline"} size={"sm"}>
            Preview
          </Button>
          <Button variant={"secondary"} size={"sm"}>
            Save
          </Button>
        </div>
      </div>
      <div className="flex h-full w-full relative justify-center items-center overflow-y-auto">
        <Card className="absolute border p-1 sm:left-4 bottom-4 sm:bottom-auto sm:top-8 flex flex-row sm:flex-col items-center justify-center gap-2">
          <AddBlock>
            <Button variant={"ghost"} size={"icon"}>
              <LayoutGridIcon className="w-5 h-5" />
            </Button>
          </AddBlock>
          <FormDesign>
            <Button variant={"ghost"} size={"icon"}>
              <BrushIcon className="w-5 h-5" />
            </Button>
          </FormDesign>
          <FormSettings>
            <Button variant={"ghost"} size={"icon"}>
              <SettingsIcon className="w-5 h-5" />
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
            <div className="flex flex-col justify-center items-center gap-2">
              <LayoutGridIcon className="w-7 h-7" />
              <span>This form has no blocks.</span>
              <AddBlock>
                <Button variant={"secondary"} size={"sm"} className="mt-3">
                  Add block
                </Button>
              </AddBlock>
            </div>
          </div>
        )}
        {blocks.length >= 1 && (
          <div className="flex w-full h-full pt-6 pb-20 justify-center px-2 sm:px-0 overflow-y-auto">
            <div className="w-full flex flex-col items-center justify-start sm:max-w-[500px] gap-2 overflow-y-auto">
              {blocks.map((block) => {
                return <Block key={block.id} {...block} />;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
