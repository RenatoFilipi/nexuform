import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { minWidth640 } from "@/helpers/constants";
import { mockForms } from "@/helpers/mocks";
import { FormProps } from "@/helpers/modules";
import { setState } from "@/helpers/types";
import { useQuery } from "@tanstack/react-query";
import { ExternalLinkIcon, Link2Icon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../ui/drawer";

const FormShare = ({
  children,
  formId,
}: {
  children: React.ReactNode;
  formId: string;
}) => {
  const isDesktop = useMediaQuery({ query: minWidth640 });
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="flex flex-col">
          <DialogHeader>
            <DialogTitle>Form Share</DialogTitle>
            <DialogDescription>
              Share this form with others using the provided link.
            </DialogDescription>
          </DialogHeader>
          <Body setState={setOpen} formId={formId} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3 flex flex-col">
        <DrawerHeader>
          <DrawerTitle>Form Share</DrawerTitle>
          <DrawerDescription>
            Share this form with others using the provided link.
          </DrawerDescription>
        </DrawerHeader>
        <Body setState={setOpen} formId={formId} />
      </DrawerContent>
    </Drawer>
  );
};

const Body = ({
  setState,
  formId,
}: {
  setState: setState<boolean>;
  formId: string;
}) => {
  const [url, setUrl] = useState("");
  const [form, setForm] = useState<FormProps | null>(null);

  useQuery({
    queryKey: ["formShareData"],
    queryFn: () => {
      const currentForm = mockForms.find((x) => x.id === formId);
      if (!currentForm) return;
      setForm(currentForm);
      setUrl(`${window.location.host}/s/${currentForm.id}`);
      return null;
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 justify-center items-start">
        {form?.status !== "published" && (
          <Alert variant={"destructive"}>
            <AlertDescription>
              This form is not currently public, change the status in the editor
              page.
            </AlertDescription>
          </Alert>
        )}
      </div>
      {form?.status === "published" && (
        <div className="flex justify-center items-center gap-4 flex-col sm:flex-row">
          <Input value={url} className="text-foreground/60" readOnly />
        </div>
      )}
      {form?.status === "published" ? (
        <div className="flex w-full justify-between items-center gap-4 flex-col-reverse sm:flex-row">
          <Button
            className="w-full sm:w-fit"
            variant={"outline"}
            size={"sm"}
            onClick={() => setState(false)}>
            Close
          </Button>
          <div className="flex justify-center items-center gap-3 w-full sm:w-fit">
            <Button
              variant={"secondary"}
              size={"sm"}
              className="w-full sm:w-fit">
              <Link
                href={`/s/${form?.id}`}
                className="flex justify-center items-center">
                <ExternalLinkIcon className="w-4 h-4 mr-2" />
                Go to Form
              </Link>
            </Button>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(url);
                toast.success("Link Copied");
              }}
              variant={"default"}
              size={"sm"}
              className="w-full sm:w-fit">
              <Link2Icon className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-end items-center">
          <Button
            className="w-full sm:w-fit"
            variant={"outline"}
            size={"sm"}
            onClick={() => setState(false)}>
            Close
          </Button>
        </div>
      )}
    </div>
  );
};

export default FormShare;
