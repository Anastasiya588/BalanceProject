import {Chart} from "chart.js/auto";

export  type ChartHtmlLegendType={
    id: string,
    afterUpdate: (chart: Chart, args: any, options: { containerID: string }) => void
}


