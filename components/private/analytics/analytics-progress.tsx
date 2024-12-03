import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FormProps } from "@/helpers/modules";

const AnalyticsProgress = ({ forms }: { forms: FormProps[] }) => {
  const total = forms.reduce((sum, prog) => sum + prog.submissions, 0);

  if (forms.length <= 0) {
    return (
      <Card className="flex justify-center items-center py-6">
        <span className="text-foreground/80 text-sm">No data to show.</span>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col gap-6 p-4">
      {forms.map((form) => (
        <div key={form.id} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">{form.name}</span>
            <span className="text-sm text-foreground/80">
              {form.submissions} / {total} submissions
            </span>
          </div>
          <Progress value={(form.submissions / total) * 100} className="h-2" />
        </div>
      ))}
    </Card>
  );
};

export default AnalyticsProgress;
