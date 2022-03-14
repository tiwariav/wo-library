export interface ChartState {
  isLoading: boolean;
  symbolImages: any;
}

const INITIAL_CHART_STATE: ChartState = {
  isLoading: false,
  symbolImages: {},
};

export default INITIAL_CHART_STATE;
