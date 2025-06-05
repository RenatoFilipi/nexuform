import FormNav from "@/components/private/form/form-nav";

const FormLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex-1 mt-14 mb-14 sm:mb-0 flex flex-col h-dvh relative justify-between">
      <FormNav />
      <div className="px-4 sm:px-10 lg:px-56 py-16">{children}</div>
    </div>
  );
};

export default FormLayout;
