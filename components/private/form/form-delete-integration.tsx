import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import useFormStore from "@/stores/form";
import useUserStore from "@/stores/user";
import { EIntegration } from "@/utils/entities";
import { createClient } from "@/utils/supabase/client";
import { TAppState } from "@/utils/types";
import { AlertCircleIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const FormDeleteIntegration = ({ children, integration }: { children: React.ReactNode; integration: EIntegration }) => {
  const [appState, setAppState] = useState<TAppState>("idle");
  const user = useUserStore();
  const { integrations, setIntegrations } = useFormStore();
  const supabase = createClient();
  const [open, setOpen] = useState(false);

  const onDelete = async () => {
    setAppState("loading");
    const { error } = await supabase
      .from("integrations")
      .delete()
      .eq("id", integration.id)
      .eq("profile_id", user.profile.id);

    if (error) {
      toast.error("Error on deleting integration, please try again.");
      setAppState("idle");
      return;
    }

    const updatedIntegrations = integrations.filter((x) => x.id !== integration.id);
    setIntegrations(updatedIntegrations);
    toast.success("Integration updated.");
    setAppState("idle");
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="flex flex-col min-w-[650px] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will permanently delete the selected integration, along with all associated settings.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col gap-4">
          <div>
            <Alert variant={"destructive"}>
              <AlertDescription className="flex justify-start items-center gap-2">
                <AlertCircleIcon className="w-5 h-5" />
                This action cannot be undone
              </AlertDescription>
            </Alert>
          </div>
          <div className="flex justify-end flex-col-reverse sm:flex-row items-center gap-2 sm:gap-4">
            <Button disabled={appState === "loading"} variant={"outline"} size={"sm"} onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button disabled={appState === "loading"} onClick={onDelete} variant={"destructive"} size={"sm"}>
              {appState === "loading" && <Loader2Icon className="animate-spin w-4 h-4 mr-2" />}
              Delete Integration
            </Button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FormDeleteIntegration;
