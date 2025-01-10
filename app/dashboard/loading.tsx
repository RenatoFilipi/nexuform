import Brand from "@/components/core/brand";

const Loading = () => {
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <Brand type="logo" className="w-10 animate-pulse fill-primary" />
    </div>
  );
};

export default Loading;
