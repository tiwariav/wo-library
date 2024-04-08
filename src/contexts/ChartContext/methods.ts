import type { MutableRefObject, ReactElement } from "react";

import type { ChartState } from "./state.js";

import { pushOrCreate } from "../../tools/others/objects.js";
import { svgNodeToData } from "../../tools/svg.js";

export default function createChartMethods(state: ChartState) {
  return {
    setLoading: (isLoading: boolean): ChartState => {
      return { ...state, isLoading };
    },
    setSymbolImages: (
      symbolsRef: MutableRefObject<HTMLDivElement | null>,
      symbolsData: ReactElement<{ seriesName: string }>[],
    ): ChartState => {
      const childNodes = symbolsRef.current?.childNodes;
      if (!childNodes) {
        return state;
      }
      const symbolImages: Record<string, string[]> = {};
      for (const [index, item] of symbolsData.entries()) {
        symbolImages[item.props.seriesName] = pushOrCreate({
          data: symbolImages,
          key: item.props.seriesName,
          value: svgNodeToData(childNodes[index]),
        });
      }
      return { ...state, symbolImages };
    },
    symbolImageReady: (
      seriesName: string,
      seriesIndex: number,
      node: Node,
    ): ChartState => {
      const symbolImages: Record<string, string[]> = { ...state.symbolImages };
      symbolImages[seriesName] = pushOrCreate({
        data: symbolImages,
        index: seriesIndex,
        key: seriesName,
        value: svgNodeToData(node),
      });
      return { ...state, symbolImages };
    },
  };
}
