import { Card } from "@/components/ui/card";
import useAppStore from "@/stores/app";
import { useTranslations } from "next-intl";
import { ArrowUp, ArrowDown, Minus, PieChartIcon } from "lucide-react";
import { motion } from "framer-motion";

const AnalyticsViewsByFormChart = ({ ids }: { ids: string[] }) => {
  const t = useTranslations("app");
  const app = useAppStore();
  const hasData = ids.length > 0;
  console.log(ids);

  const filteredForms = app.forms.filter((form) => ids.includes(form.id)) || [];

  // Calcula o total de views para cada período
  const totalViews = app.viewLogs.length;

  const totalCompareViews = app.viewLogsCompare?.length || 1;

  // Contagem de views por formulário
  const getViewCount = (formId: string) => {
    return app.viewLogs.filter((log) => log.form_id === formId).length;
  };

  const getCompareViewCount = (formId: string) => {
    return app.viewLogsCompare?.filter((log) => log.form_id === formId).length || 0;
  };

  // Calcula a porcentagem de change
  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current === 0 ? 0 : 100;
    return ((current - previous) / previous) * 100;
  };

  // Variantes de animação
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const barVariants = {
    hidden: { width: 0 },
    show: (percentage: number) => ({
      width: `${percentage}%`,
      transition: { duration: 0.2 },
    }),
  };

  const countVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1, transition: { delay: 0.3, duration: 0.5 } },
  };

  return (
    <Card className="flex flex-col justify-between gap-4 relative border rounded w-full p-6 h-fit hover:border-primary transition-all duration-300 hover:shadow-sm">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <PieChartIcon className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">{t("label_views_by_form")}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{t("label_compare_dates")}</p>
      </div>

      {!hasData ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
          <div className="flex justify-center items-center p-2 w-fit rounded bg-foreground/5">
            <PieChartIcon className="w-6 h-6 text-primary" />
          </div>
          <p>{t("label_no_data")}</p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-6"
          key={ids.join(",") + totalViews}>
          {filteredForms.map((form) => {
            const currentViews = getViewCount(form.id);
            const compareViews = getCompareViewCount(form.id);
            const percentageChange = getPercentageChange(currentViews, compareViews);
            const isIncrease = percentageChange > 0;
            const isEqual = percentageChange === 0;

            const currentPercentage = totalViews > 0 ? (currentViews / totalViews) * 100 : 0;
            const comparePercentage = totalCompareViews > 0 ? (compareViews / totalCompareViews) * 100 : 0;

            return (
              <motion.div key={form.id} variants={itemVariants} className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{form.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.span variants={countVariants} className="font-semibold">
                      {currentViews}
                    </motion.span>
                    <motion.span
                      variants={countVariants}
                      className={`text-xs flex items-center gap-0.5 ${
                        isIncrease ? "text-green-600" : isEqual ? "text-gray-500" : "text-red-600"
                      }`}>
                      {isIncrease ? (
                        <ArrowUp className="w-3 h-3" />
                      ) : isEqual ? (
                        <Minus className="w-3 h-3" />
                      ) : (
                        <ArrowDown className="w-3 h-3" />
                      )}
                      {!isEqual && `${Math.abs(Math.round(percentageChange))}%`}
                    </motion.span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {/* Barra do período atual */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-14">{t("label_current")}</span>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="relative flex-1 bg-foreground/10 rounded h-2.5">
                        <motion.div
                          variants={barVariants}
                          custom={currentPercentage}
                          initial="hidden"
                          animate="show"
                          className="absolute top-0 left-0 h-full rounded"
                          style={{
                            background: `linear-gradient(90deg, ${form.label_color} 0%, ${form.label_color}66 100%)`,
                          }}
                        />
                      </div>
                      <motion.span variants={countVariants} className="text-xs text-muted-foreground whitespace-nowrap">
                        {Math.round(currentPercentage)}% ({currentViews})
                      </motion.span>
                    </div>
                  </div>

                  {/* Barra do período de comparação */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-14">{t("label_previous")}</span>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="relative flex-1 bg-foreground/10 rounded h-2.5">
                        <motion.div
                          variants={barVariants}
                          custom={comparePercentage}
                          initial="hidden"
                          animate="show"
                          className="absolute top-0 left-0 h-full rounded"
                          style={{
                            background: `linear-gradient(90deg, ${form.label_color} 0%, ${form.label_color}66 100%)`,
                          }}
                        />
                      </div>
                      <motion.span variants={countVariants} className="text-xs text-muted-foreground whitespace-nowrap">
                        {Math.round(comparePercentage)}% ({compareViews})
                      </motion.span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </Card>
  );
};

export default AnalyticsViewsByFormChart;
