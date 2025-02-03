import { MegaphoneIcon } from "lucide-react";

const FormIntegrations = () => {
  return (
    <div className="flex justify-center items-center w-full flex-1 py-28">
      <div className="flex flex-col justify-center items-center gap-3">
        <div className="flex justify-center items-center p-2 rounded bg-primary/10">
          <MegaphoneIcon className="w-5 h-5 text-primary" />
        </div>
        <span className="text-foreground/80 uppercase text-xs">
          Comming Soon
        </span>
      </div>
    </div>
  );
};

export default FormIntegrations;
