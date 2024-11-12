"use client";

import Brand2 from "@/components/core/brand-2";
import AddBlock from "@/components/private/blocks/add-block";
import FormDesign from "@/components/private/forms/form-design";
import FormSettings from "@/components/private/forms/form-settings";
import FormWrapper from "@/components/private/forms/form-wrapper";
import { Button } from "@/components/ui/button";
import { formList } from "@/mocks/forms";
import useEditorStore from "@/stores/editor";
import { useQuery } from "@tanstack/react-query";
import {
  LoaderIcon,
  PaintbrushIcon,
  PlusIcon,
  Settings2Icon,
  ViewIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Editor = () => {
  const { blocks, setName, name, description, primaryColor, submitLabel } =
    useEditorStore();
  const pathname = usePathname();
  const [isPreview, setIsPreview] = useState(false);
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

  if (isPreview) {
    return (
      <div className="h-full flex flex-col overflow-y-auto relative">
        <div className="w-full flex justify-start p-2 sm:p-4 sm:absolute right-4">
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={() => setIsPreview(false)}>
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
        <div className="flex sm:justify-end justify-center items-center sm:border-transparent sm:p-4 p-2">
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
                <span className="font-bold bg-gradient-to-r from-[#FFA14D] via-[#F5536B] to-[#0D91F6] inline-block text-transparent bg-clip-text">
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
    <div className="flex flex-col h-full flex-1 gap-4">
      <div className="fixed h-14 flex justify-between items-center w-full top-0 bg-background border-b sm:px-6 px-2 z-20">
        <div className="flex justify-center items-center gap-2">
          <Button variant={"ghost"} size={"icon"} className="h-9 w-9" asChild>
            <Link href={"/dashboard/forms"}>
              <Brand2 type="logo" className="h-7 fill-foreground" />
            </Link>
          </Button>
          {name === "".trim() ? (
            <LoaderIcon className="animate-spin w-4 h-4" />
          ) : (
            <span className="text-foreground/80 text-sm font-semibold">
              {name}
            </span>
          )}
        </div>
        <div className="hidden sm:flex justify-center items-center gap-4">
          <Button variant={"secondary"} size={"sm"}>
            Save
          </Button>
        </div>
        <div className="flex sm:hidden justify-center items-center gap-2">
          <Button
            onClick={() => setIsPreview(true)}
            variant={"ghost"}
            size={"sm"}>
            <ViewIcon className="w-6 h-6" />
          </Button>
          <Button variant={"secondary"} size={"sm"}>
            Save
          </Button>
        </div>
      </div>
      <div className="mt-14 flex flex-1">
        <div className="sm:w-[360px] w-full flex flex-col p-4 gap-4">
          <div className="flex flex-col gap-4">
            <AddBlock>
              <Button variant={"secondary"} size={"sm"} className="w-full">
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
            </div>
          </div>
          {blocks.length <= 0 && (
            <div className="flex flex-1 justify-center items-center">
              <span className="text-foreground/80 text-sm">
                No block added.
              </span>
            </div>
          )}
        </div>
        <div className="hidden sm:flex justify-center items-center flex-1 bg-foreground/5">
          <span className="text-sm">No blocks to preview.</span>
        </div>
      </div>

      {/* {blocks.length <= 0 && (
        <div className="flex flex-1 overflow-y-auto justify-center items-center sm:px-3 px-2 mt-14">
          <div className="flex flex-col justify-center items-center gap-4">
            <BlocksIcon className="w-8 h-8" />
            <div className="flex flex-col justify-center items-center gap-0">
              <span className="font-semibold">This form has no blocks.</span>
              <p className="text-foreground/80 text-center">
                Start designing your form by adding customizable blocks.
              </p>
            </div>
            <AddBlock>
              <Button variant={"secondary"} size={"sm"} className="">
                <PlusIcon className=" w-4 h-4 mr-2" />
                Add block
              </Button>
            </AddBlock>
          </div>
        </div>
      )}
      {blocks.length >= 1 && (
        <div className="sm:mt-24 mt-16 sm:px-6 px-2 mb-4 lg:gap-16 sm:gap-4 overflow-y-auto h-full flex z-10">
          <div className="sm:w-[500px] w-full">
            <BlocksGroup blocks={blocks} />
          </div>
          <div className="hidden sm:flex flex-1">
            <Card className="flex w-full flex-col shadow-none overflow-y-auto">
              <FormWrapper
                mode="preview"
                name={name}
                description={description}
                primaryColor={primaryColor}
                submitLabel={submitLabel}
                blocks={blocks}
              />
              <div className="flex justify-center items-center mb-6">
                <Button
                  variant={"outline"}
                  size={"sm"}
                  className="flex justify-center items-center gap-2 w-fit"
                  asChild>
                  <Link
                    href={"/"}
                    className="flex justify-center items-center gap-1 text-base font-semibold">
                    <span>
                      Powered by{" "}
                      <span className="font-bold bg-gradient-to-r from-[#FFA14D] via-[#F5536B] to-[#0D91F6] inline-block text-transparent bg-clip-text">
                        Nebulaform
                      </span>
                    </span>
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Editor;
