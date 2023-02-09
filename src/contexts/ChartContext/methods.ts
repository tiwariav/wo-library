import { pushOrCreate } from "../../tools/others/objects.js";
import { svgNodeToData } from "../../tools/svg.js";
import { ChartState } from "./state.js";

export default function createChartMethods(state: ChartState) {
  return {
    setLoading: (isLoading: boolean): ChartState => {
      return { ...state, isLoading };
    },
    setSymbolImages: (
      symbolsRef: React.MutableRefObject<HTMLDivElement>,
      symbolsData: React.Component<{ seriesName: string }>[]
    ): ChartState => {
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
    symbolImageReady: (
      seriesName: string,
      seriesIndex: string | number,
      node: Node
    ): ChartState => {
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
