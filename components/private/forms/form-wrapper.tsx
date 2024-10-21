import { BlockProps } from "@/models/form";

interface FormWrapperProps {
  mode: "preview" | "release";
  name: string;
  description: string | null;
  primaryColor: string;
  background: string;
  foreground: string;
  label: string;
  blocks: BlockProps[];
}

const FormWrapper = ({ mode, name, description }: FormWrapperProps) => {
  return (
    <div className="flex flex-col w-full h-full border border-red-500 p-2 gap-4">
      <div className="border border-blue-500">
        <h1>{name}</h1>
        {description && <p>{description}</p>}
      </div>
      <div className="border border-green-500">blocks</div>
    </div>
  );
};

export default FormWrapper;
