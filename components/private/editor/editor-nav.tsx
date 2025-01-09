import Brand from "@/components/core/brand";
import { Button } from "@/components/ui/button";
import useEditorStore from "@/stores/editor";
import Link from "next/link";

const EditorNav = () => {
  const { form } = useEditorStore();

  return (
    <div className="fixed h-14 flex justify-between items-center w-full top-0 bg-background border-y border-t-foreground/5 sm:px-6 px-2 z-20">
      <div className="flex justify-center items-center gap-2">
        <Button variant={"ghost"} size={"icon"} className="h-9 w-9" asChild>
          <Link href={"/dashboard/forms"}>
            <Brand type="logo" className="h-5 fill-foreground" />
          </Link>
        </Button>
        <div className="flex justify-center items-center gap-2">
          <span className="text-sm font-medium">{form.name}</span>
        </div>
      </div>
      <div className="flex justify-center items-center gap-2">
        <Button size={"sm"} variant={"default"}>
          Save Form
        </Button>
      </div>
    </div>
  );
};

export default EditorNav;
