"use client";

import Brand from "@/components/core/brand";
import AddBlock from "@/components/private/forms/add-block";
import FormDesign from "@/components/private/forms/form-design";
import FormSettings from "@/components/private/forms/form-settings";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formList } from "@/mocks/forms";
import { BrushIcon, LayoutGridIcon, Loader2, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type state = "loading" | "no_block" | "has_block" | "error";

const Editor = () => {
  const pathname = usePathname();
  const [state] = useState<state>("no_block");
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
      <div className="flex h-full w-full relative justify-center items-center">
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
        {state === "no_block" && (
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
      </div>
    </div>
  );
};

export default Editor;
