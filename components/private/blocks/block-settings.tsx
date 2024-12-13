import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { minWidth640 } from "@/helpers/constants";
import { BlockModel } from "@/helpers/models";
import { setState } from "@/helpers/types";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import CheckboxesSettings from "./settings/checkboxes-settings";
import CustomScaleSettings from "./settings/custom-scale-settings";
import DropdownMenuSettings from "./settings/dropdown-menu-settings";
import EmailAddressSettings from "./settings/email-address-settings";
import MultipleChoiceSettings from "./settings/multiple-choice-settings";
import NumberInputSettings from "./settings/number-input-settings";
import ParagraphTextSettings from "./settings/paragraph-text-settings";
import ShortTextSettings from "./settings/short-text-settings";
import StarRatingSettings from "./settings/star-rating-settings";

const BlockSettings = ({
  children,
  block,
}: {
  children: React.ReactNode;
  block: BlockModel;
}) => {
  const isDesktop = useMediaQuery({ query: minWidth640 });
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="flex flex-col">
          <DialogHeader>
            <DialogTitle>Block Settings</DialogTitle>
            <DialogDescription>
              Customize the settings for this form block. Adjust its properties
              to match your desired design and functionality.
            </DialogDescription>
          </DialogHeader>
          <Body block={block} setState={setOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3 h-[90%] flex flex-col">
        <DrawerHeader>
          <DrawerTitle>Block Settings</DrawerTitle>
          <DrawerDescription>
            Customize the settings for this form block. Adjust its properties to
            match your desired design and functionality.
          </DrawerDescription>
        </DrawerHeader>
        <Body block={block} setState={setOpen} />
      </DrawerContent>
    </Drawer>
  );
};

const Body = ({
  block,
  setState,
}: {
  block: BlockModel;
  setState: setState<boolean>;
}) => {
  switch (block.type) {
    case "short_answer": {
      return <ShortTextSettings block={block} setState={setState} />;
    }
    case "long_answer": {
      return <ParagraphTextSettings block={block} setState={setState} />;
    }
    case "radio_button": {
      return <MultipleChoiceSettings block={block} setState={setState} />;
    }
    case "checkbox": {
      return <CheckboxesSettings block={block} setState={setState} />;
    }
    case "dropdown": {
      return <DropdownMenuSettings block={block} setState={setState} />;
    }
    case "number": {
      return <NumberInputSettings block={block} setState={setState} />;
    }
    case "email": {
      return <EmailAddressSettings block={block} setState={setState} />;
    }
    case "rating": {
      return <StarRatingSettings block={block} setState={setState} />;
    }
    case "scale": {
      return <CustomScaleSettings block={block} setState={setState} />;
    }
    default:
      return null;
  }
};

export default BlockSettings;
