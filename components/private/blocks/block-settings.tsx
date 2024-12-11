import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { minWidth640 } from "@/helpers/constants";
import { BlockModel } from "@/helpers/models";
import { setState } from "@/helpers/types";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import CheckBoxBlock from "./check-box-block";
import DropdownBlock from "./dropdown-block";
import EmailBlock from "./email-block";
import LongAnswerBlock from "./long-answer-block";
import NumberBlock from "./number-block";
import RadioButtonBlock from "./radio-button-block";
import RatingBlock from "./rating-block";
import ScaleBlock from "./scale-block";
import ShortAnswerBlock from "./short-answer-block";

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
        <DialogContent>
          <Body block={block} setState={setOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3 h-[90%]">
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
      return <ShortAnswerBlock block={block} setState={setState} />;
    }
    case "long_answer": {
      return <LongAnswerBlock block={block} setState={setState} />;
    }
    case "radio_button": {
      return <RadioButtonBlock block={block} setState={setState} />;
    }
    case "checkbox": {
      return <CheckBoxBlock block={block} setState={setState} />;
    }
    case "dropdown": {
      return <DropdownBlock block={block} setState={setState} />;
    }
    case "number": {
      return <NumberBlock block={block} setState={setState} />;
    }
    case "email": {
      return <EmailBlock block={block} setState={setState} />;
    }
    case "rating": {
      return <RatingBlock block={block} setState={setState} />;
    }
    case "scale": {
      return <ScaleBlock block={block} setState={setState} />;
    }
    default:
      return null;
  }
};

export default BlockSettings;
