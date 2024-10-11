"use client";

import Brand from "@/components/core/brand";
import { Button } from "@/components/ui/button";
import { formList } from "@/mocks/forms";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Editor = () => {
  const pathname = usePathname();
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
            Save
          </Button>
          <Button variant={"secondary"} size={"sm"}>
            Publish
          </Button>
        </div>
      </div>
      <div className="flex justify-center items-center h-full">editor page</div>
    </div>
  );
};

export default Editor;
