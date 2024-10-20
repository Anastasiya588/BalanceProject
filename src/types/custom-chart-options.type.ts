
import { ChartOptions, PluginOptionsByType, ChartTypeRegistry } from "chart.js";

export interface CustomChartOptions extends Omit<ChartOptions, 'plugins'> {
  plugins: {
      htmlLegend?: {
          containerID: string;
      };
  } & PluginOptionsByType<keyof ChartTypeRegistry>;
}