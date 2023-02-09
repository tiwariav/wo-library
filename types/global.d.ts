declare global {
  interface CalendlyPopupWidgetOptionsPrefill {
    email?: string;
    name?: string;
  }
  interface CalendlyPopupWidgetOptions {
    prefill: CalendlyPopupWidgetOptionsPrefill;
    url: string;
  }
  interface RazorpayOptions {
    currency: string;
    description: string;
    handler: CallableFunction;
    key: string;
    modal: {
      ondismiss: CallableFunction;
    };
    name: string;
    order_id: string;
    prefill: object;
  }
  class RazorpayClass {
    on: (arg0: string, arg1: CallableFunction) => void;
    open: () => void;
  }
  interface Window {
    Calendly: {
      initPopupWidget: (options: CalendlyPopupWidgetOptions) => void;
    };
    Razorpay: {
      new (options: RazorpayOptions): RazorpayClass;
    };
  }
}

export {};
