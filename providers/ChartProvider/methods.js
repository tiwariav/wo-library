import { svgNodeToData } from "../../../ye-ui/lib/svg";
import { pushOrCreate } from "../../utils/object";

export default function createChartMethods(state) {
  return {
    setLoading: (isLoading) => {
      return { ...state, isLoading };
    },
    setSymbolImages: (symbolsRef, symbolsData) => {
      const childNodes = symbolsRef.current.childNodes;
      const symbolImages = {};
      symbolsData.forEach((item, index) => {
        symbolImages[item.props.seriesName] = pushOrCreate(
          symbolImages,
          item.props.seriesName,
          svgNodeToData(childNodes[index])
        );
      });
      return { ...state, symbolImages };
    },
    symbolImageReady: (seriesName, seriesIndex, node) => {
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
