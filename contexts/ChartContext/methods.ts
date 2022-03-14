import { svgNodeToData } from "ye-ui/lib/svg";
import { pushOrCreate } from "../../utils/objects";
import { ChartState } from "./state";

export default function createChartMethods(state: ChartState) {
  return {
    setLoading: (isLoading: boolean): ChartState => {
      return { ...state, isLoading };
    },
    setSymbolImages: (symbolsRef, symbolsData): ChartState => {
      const childNodes = symbolsRef.current.childNodes;
      const symbolImages = {};
      for (const [index, item] of symbolsData.entries()) {
        symbolImages[item.props.seriesName] = pushOrCreate(
          symbolImages,
          item.props.seriesName,
          svgNodeToData(childNodes[index])
        );
      }
      return { ...state, symbolImages };
    },
    symbolImageReady: (seriesName, seriesIndex, node): ChartState => {
      const symbolImages = { ...state.symbolImages };
      symbolImages[seriesName] = pushOrCreate(
        symbolImages,
        seriesName,
        svgNodeToData(node),
        seriesIndex
      );
      return { ...state, symbolImages };
    },
  };
}
