export interface ChartState {
  isLoading: boolean;
  symbolImages: object;
}

const INITIAL_CHART_STATE: ChartState = {
  isLoading: false,
  symbolImages: {},
};

export default INITIAL_CHART_STATE;
