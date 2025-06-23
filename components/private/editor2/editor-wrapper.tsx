"use client";

import PoweredByBadge from "@/components/shared/badges/powered-by-badge";
import { Button } from "@/components/ui/button";
import usePlatformStore from "@/stores/platform";
import useStudioStore from "@/stores/studio";
import useUserStore from "@/stores/user";
import { fallbackColor } from "@/utils/constants";
import { EBlock, EForm, EOrganization, EProfile, ESubscription, ETeamMemberProfile, ETheme } from "@/utils/entities";
import { TBlock } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { Reorder, useDragControls } from "framer-motion";
import { Edit2Icon, GripVerticalIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import CheckBoxesDesign from "../design/checkboxes-design";
import CustomScaleDesign from "../design/custom-scale-design";
import DatePickerDesign from "../design/date-picker-design";
import DropdownMenuDesign from "../design/dropdown-menu-design";
import EmailAddressDesign from "../design/email-address-design";
import MultipleChoiceDesign from "../design/multiple-choice-design";
import NumberInputDesign from "../design/number-input-design";
import ParagraphTextDesign from "../design/paragraph-text-design";
import ShortTextDesign from "../design/short-text-design";
import StarRatingDesign from "../design/star-rating-design";
import EditorAddBlock from "../editor/editor-add-block";

interface IProps {
  locale: string;
  email: string;
  profile: EProfile;
  organization: EOrganization;
  subscription: ESubscription;
  teamMemberProfile: ETeamMemberProfile;
  form: EForm;
  theme: ETheme;
  blocks: EBlock[];
}

const EditorWrapper = (props: IProps) => {
  const t = useTranslations("app");
  const pf = usePlatformStore();
  const studio = useStudioStore();
  const user = useUserStore();

  const query = useQuery({
    queryKey: ["editor-page"],
    queryFn: () => {
      user.setLocale(props.locale);
      user.setEmail(props.email);
      user.setProfile(props.profile);
      pf.setOrganizations([props.organization]);
      pf.setSubscriptions([props.subscription]);
      pf.setTeamMemberProfiles([props.teamMemberProfile]);
      studio.setForm(props.form);

      const primaryColor = props.theme.custom_primary_color.trim() || fallbackColor;

      studio.setTheme({ ...props.theme, custom_primary_color: primaryColor });
      studio.setBlocks(props.blocks);
      studio.setOriginalBlocks(props.blocks);
      return null;
    },
  });

  if (query.isPending) return null;

  return (
    <div className="flex justify-center items-center flex-1 h-full">
      <EditorCanva />
      <EditorToolbar />
    </div>
  );
};

interface IBlockComponent {
  block: EBlock;
  theme: ETheme;
  onValueChange: () => void;
}
const COMPONENT_MAP: Record<TBlock, React.ComponentType<IBlockComponent>> = {
  short_text: ShortTextDesign,
  paragraph_text: ParagraphTextDesign,
  multiple_choice: MultipleChoiceDesign,
  checkboxes: CheckBoxesDesign,
  dropdown_menu: DropdownMenuDesign,
  number_input: NumberInputDesign,
  email_address: EmailAddressDesign,
  star_rating: StarRatingDesign,
  custom_scale: CustomScaleDesign,
  date_picker: DatePickerDesign,
};
const EditorCanva = () => {
  const t = useTranslations("app");
  const studio = useStudioStore();
  const hasBlocks = studio.blocks.length > 0;

  const handleReorder = (newOrder: EBlock[]) => {
    const updatedBlocks = newOrder.map((block, index) => ({
      ...block,
      position: index + 1,
    }));
    studio.setBlocks(updatedBlocks);
  };

  return (
    <div className="flex justify-center items-center h-full w-full flex-col">
      <div className="h-16 w-full flex justify-start items-center px-2">
        <EditorAddBlock>
          <Button variant={"outline"} size={"sm"}>
            <PlusIcon className="w-4 h-4 mr-2" />
            {t("label_add_block")}
          </Button>
        </EditorAddBlock>
      </div>
      {!hasBlocks && (
        <div className="flex justify-center items-center h-full w-full overflow-y-auto">
          <div className="flex flex-col items-center max-w-md text-center space-y-6">
            <div className="rounded bg-primary/10 p-3">
              <PlusIcon className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">{t("label_start_form")}</h3>
              <p className="text-sm text-muted-foreground">{t("desc_start_form")}</p>
            </div>
          </div>
        </div>
      )}
      {hasBlocks && (
        <div className="flex justify-center items-start h-full w-full overflow-y-auto">
          <div className="flex flex-col gap-6 w-full sm:w-[650px]">
            <div className="flex flex-col gap-2 px-3 justify-center items-start">
              <h1 className="text-2xl font-bold">{studio.form.name}</h1>
              <p className="text-sm text-foreground/80">{studio.form.description}</p>
            </div>
            <Reorder.Group
              axis="y"
              values={studio.blocks}
              onReorder={handleReorder}
              className="flex flex-col gap-2 w-full">
              {studio.blocks.map((block) => {
                const Component = COMPONENT_MAP[block.type as TBlock];
                if (!Component) return null;
                return (
                  <BlockWrapper key={block.id} block={block}>
                    <Component block={block} theme={studio.theme} onValueChange={() => {}} />
                  </BlockWrapper>
                );
              })}
            </Reorder.Group>
            <div className="flex justify-center items-center w-full flex-col gap-6">
              <button
                style={{ backgroundColor: studio.theme.custom_primary_color }}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 text-white w-full">
                {studio.form.submit_label}
              </button>
              <div className="flex justify-center sm:justify-end items-center w-full gap-2 h-14">
                {studio.theme.app_branding && <PoweredByBadge version="default" />}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
const BlockWrapper = ({ children, block }: { children: React.ReactNode; block: EBlock }) => {
  const studio = useStudioStore();
  const dragControls = useDragControls();

  const onSelectBlock = () => {
    studio.setBlockView(block);
    studio.setToolView("block");
  };

  const onRemoveBlock = () => {
    studio.setToolView("properties");
    studio.removeBlock(block.id);
  };

  return (
    <Reorder.Item
      value={block}
      dragListener={false}
      dragControls={dragControls}
      className={`${
        block.id === studio.blockView.id && studio.toolView === "block"
          ? "border-2 border-primary dark:border-primary"
          : "border border-transparent"
      } flex w-full p-3 relative group hover:bg-foreground/10 transition-colors rounded`}>
      {/* Content */}
      <div className="flex-1">{children}</div>
      {/* Action buttons */}
      <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 p-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded">
        <button
          onPointerDown={(e) => {
            e.preventDefault();
            dragControls.start(e);
          }}
          className="cursor-grab active:cursor-grabbing p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50/50 dark:text-gray-300 dark:hover:text-green-400 dark:hover:bg-green-900/30 rounded transition-colors">
          <GripVerticalIcon className="w-4 h-4" />
        </button>
        <button
          onClick={onSelectBlock}
          className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-blue-900/30 rounded transition-colors">
          <Edit2Icon className="w-4 h-4" />
        </button>
        <button
          onClick={onRemoveBlock}
          className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50/50 dark:text-gray-300 dark:hover:text-red-400 dark:hover:bg-red-900/30 rounded transition-colors">
          <Trash2Icon className="w-4 h-4" />
        </button>
      </div>
    </Reorder.Item>
  );
};
const EditorToolbar = () => {
  return <div className="border-l flex justify-center items-center h-full w-[500px]">toolbar</div>;
};

export default EditorWrapper;
