import Brand from "@/components/core/brand";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Editor = () => {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex justify-between items-center h-16 px-2 sm:px-6 z-10 bg-background border-b">
        <div className="flex justify-center items-center gap-4">
          <Button variant={"ghost"} size={"icon"} className="h-9 w-9" asChild>
            <Link href={"/dashboard/forms"}>
              <Brand type="logo" className="h-7 fill-foreground" />
            </Link>
          </Button>
          <span className="text-foreground/80 text-sm hidden sm:flex ">
            Form name placeholder
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
