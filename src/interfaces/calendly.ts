export interface CalendlyPopupWidgetOptionsPrefill {
  email?: string;
  name?: string;
}

interface CalendlyPopupWidgetOptions {
  prefill?: CalendlyPopupWidgetOptionsPrefill;
  url: string;
}

export interface Calendly {
  initPopupWidget: (options: CalendlyPopupWidgetOptions) => void;
}
