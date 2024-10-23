import { minWidth640 } from "@/helpers/constants";
import { setState } from "@/helpers/types";
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
  return <>{id}</>;
};

export default FormShare;
