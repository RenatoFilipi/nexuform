import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { minWidth640 } from "@/helpers/constants";
import { BlockProps } from "@/models/form";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import CheckboxesBlock from "./blocks/check-boxes-block";
import DropdownBlock from "./blocks/dropdown-block";
import EmailBlock from "./blocks/email-block";
import LongAnswerBlock from "./blocks/long-answer-block";
import MultiSelectBlock from "./blocks/multi-select-block";
import MultipleChoiceBlock from "./blocks/multiple-choice-block";
import NumberBlock from "./blocks/number-block";
import RatingBlock from "./blocks/rating-block";
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
          <Body block={block} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3 h-[90%]">
        <Body block={block} />
      </DrawerContent>
    </Drawer>
  );
};

const Body = ({ block }: { block: BlockProps }) => {
  switch (block.type) {
    case "short_answer": {
      return <ShortAnswerBlock block={block} />;
    }
    case "long_answer": {
      return <LongAnswerBlock block={block} />;
    }
    case "multiple_choice": {
      return <MultipleChoiceBlock block={block} />;
    }
    case "checkboxes": {
      return <CheckboxesBlock block={block} />;
    }
    case "dropdown": {
      return <DropdownBlock block={block} />;
    }
    case "multi_select": {
      return <MultiSelectBlock block={block} />;
    }
    case "number": {
      return <NumberBlock block={block} />;
    }
    case "email": {
      return <EmailBlock block={block} />;
    }
    case "rating": {
      return <RatingBlock block={block} />;
    }
    default:
      return null;
  }
};

export default BlockSettings;
