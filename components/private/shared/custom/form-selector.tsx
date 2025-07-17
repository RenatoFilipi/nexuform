import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { EForm } from "@/utils/entities";
import { EyeIcon, EyeOffIcon, LayersIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

const FormSelector = ({ forms, onChange }: { forms: EForm[]; onChange: (ids: string[]) => void }) => {
  const t = useTranslations("app");
  const [visibleForms, setVisibleForms] = useState<string[]>(forms.map((f) => f.id));

  const toggleFormVisibility = (formId: string) => {
    const newVisibleForms = visibleForms.includes(formId)
      ? visibleForms.filter((id) => id !== formId)
      : [...visibleForms, formId];

    setVisibleForms(newVisibleForms);
    onChange(newVisibleForms);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex justify-between items-center gap-3 sm:min-w-44">
          <div className="flex justify-center items-center gap-2">
            <LayersIcon className="h-4 w-4 text-primary" />
            <span>{t("label_forms")}</span>
          </div>
          <span className="ml-1 text-muted-foreground text-xs font-normal">
            ({visibleForms.length}/{forms.length})
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="sm:min-w-64 p-2 mt-1" align="end">
        <div className="space-y-2">
          <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {t("label_forms")}
          </div>
          <div className="max-h-60 overflow-y-auto">
            {forms.map((f) => {
              const isVisible = visibleForms.includes(f.id);
              return (
                <button
                  key={f.id}
                  onClick={() => toggleFormVisibility(f.id)}
                  className="w-full flex items-center justify-between p-2 rounded hover:bg-accent/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <div
                      style={{ backgroundColor: f.label_color }}
                      className={`w-3 h-3 rounded-sm flex-shrink-0 ${isVisible ? "" : "opacity-20"}`}
                    />
                    <span className={`text-sm ${isVisible ? "font-medium" : "text-muted-foreground"}`}>{f.name}</span>
                  </div>
                  {isVisible ? (
                    <EyeIcon className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <EyeOffIcon className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FormSelector;
