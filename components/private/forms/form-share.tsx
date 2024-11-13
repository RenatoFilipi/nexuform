import { Alert2, AlertDescription2 } from "@/components/ui/alert2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { minWidth640 } from "@/helpers/constants";
import { setState } from "@/helpers/types";
import { formList } from "@/mocks/forms";
import { Link2Icon } from "lucide-react";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { toast } from "sonner";
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
        <DialogContent className="sm:min-w-[550px]">
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

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success("Link Copied");
  };

  return (
    <div className="flex flex-col gap-4 pt-4 sm:pt-0">
      <div className="flex flex-col gap-1 justify-center items-start">
        <h1 className="text-xl font-semibold">Share link</h1>
        {currentForm?.status === "published" ? (
          <Alert2 variant={"info"}>
            <AlertDescription2>
              Your form is live! Share it via link on social media, messaging,
              or email.
            </AlertDescription2>
          </Alert2>
        ) : (
          <Alert2 variant={"destructive"}>
            <AlertDescription2>
              This form is not currently public, change the status in the editor
              page.
            </AlertDescription2>
          </Alert2>
        )}
      </div>
      {currentForm?.status === "published" && (
        <div className="flex justify-center items-center gap-4 flex-col sm:flex-row">
          <Input value={shareLink} className="text-foreground/60" />
          <Button
            onClick={handleCopy}
            variant={"secondary"}
            size={"sm"}
            className="w-full sm:w-fit">
            <Link2Icon className="w-4 h-4 mr-2" />
            Copy Link
          </Button>
        </div>
      )}
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
