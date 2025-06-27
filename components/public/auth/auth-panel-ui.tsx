import GridPattern from "@/components/magicui/animated-grid-pattern";

const AuthPanelUI = () => {
  return (
    <div className="flex-1 sm:flex hidden w-full bg-gradient-to-b relative from-primary/15 to-primary/90">
      <GridPattern width={20} height={20} x={-1} y={-1} strokeDasharray={"4 2"} className="" maxOpacity={0.2} />
    </div>
  );
};

export default AuthPanelUI;
