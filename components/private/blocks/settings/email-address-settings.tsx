"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import useEditorStore from "@/stores/editor";
import { EBlock } from "@/utils/entities";
import { TSetState } from "@/utils/types";
import { CircleHelpIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

const EmailAddressSettings = ({ block, setState }: { block: EBlock; setState: TSetState<boolean> }) => {
  const t = useTranslations("app");
  const { id, is_identifier } = block;
  const { updateBlock, removeBlock, blocks } = useEditorStore();
  const [isIdentifierAvailable] = useState(blocks.some((e) => e.is_identifier === true && e.id !== id));

  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto">
      <div className="flex justify-center sm:justify-start items-center gap-3">
        {is_identifier && (
          <Badge variant={"green"} uppercase>
            {t("label_identifier")}
          </Badge>
        )}
        <Badge variant={"primary"} uppercase>
          {t("label_email_address")}
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
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label htmlFor="placeholder">{t("label_block_placeholder")}</Label>
            <span className="text-xs text-foreground/60">{t("desc_block_placeholder")}</span>
          </div>
          <Input
            type="text"
            id="placeholder"
            value={block.placeholder ?? ""}
            onChange={(e) => {
              updateBlock(id, { ...block, placeholder: e.target.value });
            }}
          />
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
        {!isIdentifierAvailable && (
          <div className="flex justify-between items-center w-full">
            <div className="grid gap-1">
              <div className="flex justify-start items-center gap-2">
                <Label htmlFor="identifier">{t("label_mark_identifier")}</Label>
                <IdentifierToolTip>
                  <CircleHelpIcon className="w-4 h-4 text-foreground/80" />
                </IdentifierToolTip>
              </div>
              <p className="text-xs text-foreground/60">{t("desc_mark_identifier")}</p>
            </div>
            <Switch
              id="identifier"
              checked={block.is_identifier}
              onCheckedChange={(checked: boolean) => {
                updateBlock(id, { ...block, is_identifier: checked });
              }}
            />
          </div>
        )}
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

const IdentifierToolTip = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("app");

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{t("tt_mark_identifier")}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default EmailAddressSettings;
