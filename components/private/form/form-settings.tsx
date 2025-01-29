import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import useFormStore from "@/stores/form";
import { IFormStatus } from "@/utils/interfaces";
import { createClient } from "@/utils/supabase/client";
import { TAppState } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircleIcon,
  FileEditIcon,
  LoaderIcon,
  XCircleIcon,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import FormDelete from "../forms/form-delete";

const statusList: IFormStatus[] = [
  {
    status: "draft",
    label: "Draft",
    description:
      "The form is currently being created or edited and is not yet available for users to access.",
    icon: <FileEditIcon className="w-5 h-5 text-blue-500" />,
  },
  {
    status: "published",
    label: "Published",
    description:
      "The form is live and can be accessed, filled out, and submitted by users.",
    icon: <CheckCircleIcon className="w-5 h-5 text-green-500" />,
  },
  {
    status: "inactive",
    label: "Inactive",
    description:
      "The form is no longer available for users to fill out or submit.",
    icon: <XCircleIcon className="w-5 h-5 text-red-500" />,
  },
];

const FormSettings = () => {
  const supabase = createClient();
  const [settingsState, setSettingsState] = useState<TAppState>("idle");
  const { form, setForm } = useFormStore();
  const [statusDescription, setStatusDescription] = useState(
    statusList.find((x) => x.status === form.status)?.description
  );
  const formSchema = z.object({
    name: z.string().min(3, "Name must contain at least 3 letters."),
    description: z.string(),
    submitText: z
      .string()
      .min(3, "Submit text must contain at least 3 letters."),
    status: z.string(),
  });
  const formHandler = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: form.name,
      description: form.description ?? "",
      submitText: form.submit_text,
      status: form.status,
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { name, description, status, submitText } = values;
    setSettingsState("loading");
    const { data, error } = await supabase
      .from("forms")
      .update({ name, description, status, submit_text: submitText })
      .eq("id", form.id)
      .select("*")
      .single();

    if (error) {
      toast.error("Error on update the form.");
      setSettingsState("idle");
      return;
    }
    setForm(data);
    toast.success("Form updated with success.");
    setSettingsState("idle");
  };
  const handleStatusClick = (status: string) => {
    formHandler.setValue("status", status);
    setStatusDescription(
      statusList.find((x) => x.status === status)?.description
    );
  };

  return (
    <div className="flex w-full flex-1 flex-col gap-6">
      <Form {...formHandler}>
        <form
          onSubmit={formHandler.handleSubmit(onSubmit)}
          className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Left Section: Inputs */}
            <div className="flex flex-col gap-6">
              <FormField
                control={formHandler.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <div className="grid gap-2">
                      <FormLabel className="font-semibold">Name</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Provide a unique name for your form to identify it
                        easily.
                      </p>
                    </div>

                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        placeholder="Enter form name"
                        className="text-sm"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={formHandler.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <div className="grid gap-2">
                      <FormLabel className="font-semibold">
                        Description
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Add a brief description to inform users about the
                        purpose of this form.
                      </p>
                    </div>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter form description"
                        className="text-sm"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={formHandler.control}
                name="submitText"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <div className="grid gap-2">
                      <FormLabel className="font-semibold">
                        Submit Text
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Customize the text displayed on the form&apos;s submit
                        button.
                      </p>
                    </div>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        placeholder="Submit button text"
                        className="text-sm"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            {/* Right Section: Status */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <FormLabel className="font-semibold">Status</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Choose the current status of the form. This determines its
                    availability and visibility.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {statusList.map((item) => (
                    <div
                      key={item.status}
                      onClick={() => handleStatusClick(item.status)}
                      className={cn(
                        "cursor-pointer p-4 border flex flex-col items-center justify-center gap-2 rounded",
                        formHandler.watch("status") === item.status
                          ? "border-primary bg-primary/10"
                          : "border-muted"
                      )}
                      aria-label={item.label}>
                      {item.icon}
                      <p className="text-sm font-medium">{item.label}</p>
                    </div>
                  ))}
                </div>
                <Alert variant="info">
                  <AlertDescription className="text-sm text-center">
                    {statusDescription}
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </div>
          <div className="flex justify-end items-center gap-4">
            <FormDelete formId={form.id} formName={form.name}>
              <Button type="button" variant={"destructive_outline"} size={"sm"}>
                Delete This Form
              </Button>
            </FormDelete>
            <Button
              variant={"secondary"}
              disabled={settingsState === "loading"}
              type="submit"
              size="sm"
              className="sm:w-auto w-full">
              {settingsState === "loading" && (
                <LoaderIcon className="w-4 h-4 animate-spin mr-2" />
              )}
              Update Form Settings
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormSettings;
