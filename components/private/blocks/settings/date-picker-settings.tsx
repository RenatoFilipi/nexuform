import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import useEditorStore from "@/stores/editor";
import { EBlock } from "@/utils/entities";
import { TSetState } from "@/utils/types";
import { useTranslations } from "next-intl";

const DatePickerSettings = ({ block, setState }: { block: EBlock; setState: TSetState<boolean> }) => {
  const t = useTranslations("app");
  const { id } = block;
  const { updateBlock, removeBlock } = useEditorStore();

  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto">
      <div className="flex justify-center sm:justify-start items-center gap-3">
        <Badge variant={"primary"} uppercase>
          {t("label_date_picker")}
        </Badge>
      </div>
      <div className="h-full flex flex-col gap-8 overflow-y-auto pr-4">
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label htmlFor="name">{t("label_block_name")}</Label>
            <span className="text-xs text-foreground/60">{t("desc_block_name")}</span>
          </div>
          <Input
            type="text"
            id="name"
            value={block.name}
            onChange={(e) => {
              updateBlock(id, { ...block, name: e.target.value });
            }}
          />
        </div>
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label htmlFor="description">{t("label_block_desc")}</Label>
            <span className="text-xs text-foreground/60">{t("desc_block_desc")}</span>
          </div>
          <Textarea
            id="description"
            value={block.description ?? ""}
            onChange={(e) => {
              updateBlock(id, { ...block, description: e.target.value });
            }}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-3">
            <Label htmlFor="min-date">{t("label_block_min")}</Label>
            <Input
              type="date"
              id="min-date"
              value={block.min_date ?? ""}
              onChange={(e) => {
                updateBlock(id, {
                  ...block,
                  min_date: e.target.value,
                });
              }}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="max-date">{t("label_block_max")}</Label>
            <Input
              type="date"
              id="max-date"
              value={block.max_date ?? ""}
              onChange={(e) => {
                updateBlock(id, {
                  ...block,
                  max_date: e.target.value,
                });
              }}
            />
          </div>
        </div>
        <div className="flex justify-between items-center w-full">
          <div className="grid gap-1">
            <Label htmlFor="required">{t("label_block_required")}</Label>
            <p className="text-xs text-foreground/60">{t("desc_block_required")}</p>
          </div>
          <Switch
            id="required"
            checked={block.required}
            onCheckedChange={(checked: boolean) => {
              updateBlock(id, { ...block, required: checked });
            }}
          />
        </div>
      </div>
      <div className="flex justify-between gap-4 items-center flex-col sm:flex-row">
        <Button
          onClick={() => {
            removeBlock(block.id);
            setState(false);
          }}
          variant={"destructive_outline"}
          size={"sm"}
          className="w-full sm:w-fit">
          {t("label_remove_block")}
        </Button>
        <Button onClick={() => setState(false)} variant={"outline"} size={"sm"} className="w-full sm:w-fit">
          {t("label_close")}
        </Button>
      </div>
    </div>
  );
};

export default DatePickerSettings;
