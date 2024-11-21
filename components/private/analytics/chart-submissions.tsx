import GenericError from "@/components/core/generic-error";
import GenericLoader from "@/components/core/generic-loader";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChartSubmissionsProps } from "@/helpers/interfaces";

const ChartSubmissions = ({ forms, state }: ChartSubmissionsProps) => {
  const totalSubmissions = forms.reduce(
    (sum, form) => sum + form.submissions,
    0
  );

  return (
    <Card className="p-4">
      {state === "loading" && (
        <div className="flex justify-center items-center py-8">
          <GenericLoader className="w-5 h-5 animate-spin" />
        </div>
      )}
      {state === "idle" && forms.length <= 0 && (
        <div className="flex justify-center items-center">
          <span className="text-foreground/80">No data to show.</span>
        </div>
      )}
      {state === "idle" && forms.length >= 1 && (
        <div className="flex flex-col gap-6">
          {forms.map((form) => (
            <div key={form.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{form.name}</span>
                <span className="text-sm text-muted-foreground">
                  {form.submissions} / {totalSubmissions} submissions
                </span>
              </div>
              <Progress
                value={(form.submissions / totalSubmissions) * 100}
                className="h-2"
              />
            </div>
          ))}
        </div>
      )}
      {state === "error" && (
        <div className="flex justify-center items-center py-4">
          <GenericError />
        </div>
      )}
    </Card>
  );
};

export default ChartSubmissions;
