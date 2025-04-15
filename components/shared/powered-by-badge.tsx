import { ArrowUpRightIcon, BadgeCheckIcon, SparklesIcon, ZapIcon } from "lucide-react";

type TVersion = "default" | "minimal" | "highlight" | "gradient" | "premium";

const PoweredByBadge = ({ version = "default" }: { version?: TVersion }) => {
  if (version === "minimal") {
    return (
      <div className="inline-flex items-center gap-1 bg-transparent hover:bg-foreground/5 transition-colors rounded px-2 py-1 w-fit">
        <span className="text-foreground/60 text-xs">by</span>
        <span className="text-foreground text-sm font-medium">Nebulaform</span>
      </div>
    );
  }
  if (version === "highlight") {
    return (
      <div className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/15 transition-colors rounded-full px-4 py-1.5 border border-primary/20 w-fit">
        <ZapIcon className="w-4 h-4 text-primary" />
        <span className="text-primary text-sm font-semibold">Nebulaform</span>
      </div>
    );
  }
  if (version === "gradient") {
    return (
      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/15 hover:to-purple-500/15 transition-colors rounded-lg px-4 py-2 backdrop-blur-sm w-fit">
        <SparklesIcon className="w-4 h-4 text-purple-500" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 text-sm font-bold">
          Powered by Nebulaform
        </span>
      </div>
    );
  }
  if (version === "premium") {
    return (
      <div className="inline-flex items-center gap-2 bg-amber-50/80 hover:bg-amber-50 dark:bg-amber-900/20 dark:hover:bg-amber-900/30 transition-colors rounded-full px-4 py-1.5 border border-amber-200 dark:border-amber-700/50 shadow-sm dark:shadow-none w-fit">
        <BadgeCheckIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        <span className="text-amber-900 dark:text-amber-100 text-sm font-semibold">Nebulaform</span>
        <span className="text-amber-600/80 dark:text-amber-400/90 text-xs font-medium">PRO</span>
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-2 bg-foreground/10 hover:bg-foreground/15 transition-colors rounded px-4 py-1.5 border border-foreground/5 shadow-sm w-fit">
      <span className="text-foreground/80 text-sm font-medium">Powered by</span>
      <span className="text-foreground font-bold">Nebulaform</span>
      <ArrowUpRightIcon className="w-4 h-4" />
    </div>
  );
};

export default PoweredByBadge;
