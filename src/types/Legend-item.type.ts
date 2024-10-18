import {types} from "sass";
import Color = types.Color;

export type  LegendItem = {
    text: string;
    fillStyle: string;
    strokeStyle: string;
    lineWidth: number;
    hidden: boolean;
    datasetIndex: number;
    index: number;
};