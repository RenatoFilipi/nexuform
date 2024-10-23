import { Input } from "@/components/ui/input";
import { BlockProps } from "@/models/form";

const EmailDesign = ({ block }: { block: BlockProps }) => {
  const { name, description, required } = block;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid">
        <h1 className="text-base font-medium">
          {name} {required && <span className="text-red-500">*</span>}
        </h1>
        <span className="text-xs text-foreground/80">{description}</span>
      </div>
      <Input type="email" />
    </div>
  );
};

export default EmailDesign;
