import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FormProgressProps } from "@/models/analytics";

interface Props {
  forms: FormProgressProps[];
}

const ChartSubmissions = ({ forms }: Props) => {
  const totalSubmissions = forms.reduce(
    (sum, form) => sum + form.submissions,
    0
  );

  return (
    <Card className="p-6">
      {forms.length <= 0 && (
        <div className="flex justify-center items-center">
          <span className="text-foreground/80">No data to show.</span>
        </div>
      )}
      {forms.length >= 1 && (
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
    </Card>
  );
};

export default ChartSubmissions;
