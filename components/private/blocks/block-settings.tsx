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
import { minWidth640 } from "@/utils/constants";
import { EBlock } from "@/utils/entities";
import { TSetState } from "@/utils/types";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useMedia } from "react-use";
import CheckboxesSettings from "./settings/checkboxes-settings";
import CustomScaleSettings from "./settings/custom-scale-settings";
import DropdownMenuSettings from "./settings/dropdown-menu-settings";
import EmailAddressSettings from "./settings/email-address-settings";
import MultipleChoiceSettings from "./settings/multiple-choice-settings";
import NumberInputSettings from "./settings/number-input-settings";
import ParagraphTextSettings from "./settings/paragraph-text-settings";
import ShortTextSettings from "./settings/short-text-settings";
import StarRatingSettings from "./settings/star-rating-settings";

const BlockSettings = ({ children, block }: { children: React.ReactNode; block: EBlock }) => {
  const t = useTranslations("app");
  const isDesktop = useMedia(minWidth640);
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="flex flex-col min-w-[650px] h-[600px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("label_block_settings")}</DialogTitle>
            <DialogDescription>{t("desc_block_settings")}</DialogDescription>
          </DialogHeader>
          <Body block={block} setState={setOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3 max-h-[90%] flex flex-col">
        <DrawerHeader>
          <DrawerTitle>{t("label_block_settings")}</DrawerTitle>
          <DrawerDescription>{t("desc_block_settings")}</DrawerDescription>
        </DrawerHeader>
        <Body block={block} setState={setOpen} />
      </DrawerContent>
    </Drawer>
  );
};

const Body = ({ block, setState }: { block: EBlock; setState: TSetState<boolean> }) => {
  switch (block.type) {
    case "short_text": {
      return <ShortTextSettings block={block} setState={setState} />;
    }
    case "paragraph_text": {
      return <ParagraphTextSettings block={block} setState={setState} />;
    }
    case "multiple_choice": {
      return <MultipleChoiceSettings block={block} setState={setState} />;
    }
    case "checkboxes": {
      return <CheckboxesSettings block={block} setState={setState} />;
    }
    case "dropdown_menu": {
      return <DropdownMenuSettings block={block} setState={setState} />;
    }
    case "number_input": {
      return <NumberInputSettings block={block} setState={setState} />;
    }
    case "email_address": {
      return <EmailAddressSettings block={block} setState={setState} />;
    }
    case "star_rating": {
      return <StarRatingSettings block={block} setState={setState} />;
    }
    case "custom_scale": {
      return <CustomScaleSettings block={block} setState={setState} />;
    }
    default:
      return null;
  }
};

export default BlockSettings;
