import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { minWidth640 } from "@/helpers/constants";
import { setState } from "@/helpers/types";
import { BlockProps } from "@/models/form";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import CheckboxesBlock from "./blocks/check-boxes-block";
import DropdownBlock from "./blocks/dropdown-block";
import EmailBlock from "./blocks/email-block";
import LongAnswerBlock from "./blocks/long-answer-block";
import MultipleChoiceBlock from "./blocks/multiple-choice-block";
import NumberBlock from "./blocks/number-block";
import RatingBlock from "./blocks/rating-block";
import ScaleBlock from "./blocks/scale-block";
import ShortAnswerBlock from "./blocks/short-answer-block";

const BlockSettings = ({
  children,
  block,
}: {
  children: React.ReactNode;
  block: BlockProps;
}) => {
  const isDesktop = useMediaQuery({ query: minWidth640 });
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent>
          <Body block={block} setState={setOpen} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3">
        <Body block={block} setState={setOpen} />
      </DrawerContent>
    </Drawer>
  );
};

const Body = ({
  block,
  setState,
}: {
  block: BlockProps;
  setState: setState<boolean>;
}) => {
  switch (block.type) {
    case "short_answer": {
      return <ShortAnswerBlock block={block} setState={setState} />;
    }
    case "long_answer": {
      return <LongAnswerBlock block={block} setState={setState} />;
    }
    case "multiple_choice": {
      return <MultipleChoiceBlock block={block} setState={setState} />;
    }
    case "checkboxes": {
      return <CheckboxesBlock block={block} setState={setState} />;
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
