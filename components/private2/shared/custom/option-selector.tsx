import { useTranslations } from "next-intl";

interface IStatus {
  status: string;
  label: string;
  description: string;
  icon: any;
  color: string;
}

interface IProps {
  status: string;
  onStatusChange: (status: string) => void;
  options: IStatus[];
}

const OptionSelector = ({ status, onStatusChange, options }: IProps) => {
  return (
    <div className="grid gap-3 overflow-y-auto sm:grid-cols-1 w-full">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onStatusChange(option.status)}
          className={`${
            option.status === status ? "border-primary bg-primary/5" : "hover:bg-foreground/5"
          } border p-4 flex gap-4 h-full w-full rounded bg-background`}>
          <div className="flex items-center justify-center">
            <div className={`p-3 rounded ${option.color} ${status === option.status ? "opacity-100" : "opacity-60"}`}>
              <option.icon className="w-6 h-6" />
            </div>
          </div>
          <div className="flex flex-col justify-center items-start gap-1">
            <span className="font-semibold">{option.label}</span>
            <span className="text-sm text-muted-foreground text-start">{option.description}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default OptionSelector;
