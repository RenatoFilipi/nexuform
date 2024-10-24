import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { minWidth640 } from "@/helpers/constants";
import { setState } from "@/helpers/types";
import { formList } from "@/mocks/forms";
import { Link2Icon } from "lucide-react";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Dialog, DialogContent, DialogTrigger } from "../../ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "../../ui/drawer";

const FormShare = ({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) => {
  const isDesktop = useMediaQuery({ query: minWidth640 });
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <Body setState={setOpen} id={id} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3">
        <Body setState={setOpen} id={id} />
      </DrawerContent>
    </Drawer>
  );
};

const Body = ({
  setState,
  id,
}: {
  setState: setState<boolean>;
  id: string;
}) => {
  const currentForm = formList.find((x) => x.id === id);
  const shareLink = `${window.location.host}/r/${currentForm?.id}`;

  return (
    <div className="flex flex-col justify-center gap-4">
      <div>
        <h1>Share Link</h1>
      </div>
      <div className="flex justify-center items-center gap-4">
        <Input value={shareLink} />
        <Button
          onClick={() => {
            navigator.clipboard.writeText(shareLink);
          }}
          variant={"secondary"}
          size={"sm"}>
          <Link2Icon className="w-4 h-4 mr-2" />
          Copy Link
        </Button>
      </div>
      <div className="flex w-full justify-end items-center">
        <Button
          className="w-full sm:w-fit"
          variant={"outline"}
          size={"sm"}
          onClick={() => setState(false)}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default FormShare;
