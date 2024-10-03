import EditorNav from "@/components/private/editor-nav";

const EditorLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen relative flex flex-col">
      <EditorNav />
      {children}
    </div>
  );
};

export default EditorLayout;
