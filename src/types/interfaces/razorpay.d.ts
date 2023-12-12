export interface RazorpayOptions {
  currency: string;
  description?: string;
  handler: CallableFunction;
  key: string;
  modal: {
    ondismiss: CallableFunction;
  };
  name: string;
  order_id: string;
  prefill: object;
}
interface RazorpayClass {
  on: (arg0: string, arg1: CallableFunction) => void;
  open: () => void;
}

export type Razorpay = new (options: RazorpayOptions) => RazorpayClass;
