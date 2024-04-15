import { RazorpayOptions } from "../../types/interfaces/razorpay.js";
import { WoLoadScriptError } from "../error/index.js";
import loadScript from "../loadScript.js";

interface RazorpayCheckoutOptions {
  currency: string;
  description?: string;
  handleClose: CallableFunction;
  handleError: CallableFunction;
  handleSuccess: CallableFunction;
  key: string;
  name: string;
  orderID: string;
  prefill: object;
}

export async function checkout({
  currency,
  description,
  handleClose,
  handleError,
  handleSuccess,
  key,
  name,
  orderID,
  prefill,
}: RazorpayCheckoutOptions) {
  const response = await loadScript(
    "https://checkout.razorpay.com/v1/checkout.js",
  );
  if (!response) {
    throw new WoLoadScriptError("Razorpay SDK failed to load!");
  }

  const options: RazorpayOptions = {
    currency,
    description,
    handler: handleSuccess,
    key,
    modal: { ondismiss: handleClose },
    name,
    order_id: orderID,
    prefill,
  };

  const razorpay = new window.Razorpay(options);

  razorpay.on("payment.failed", handleError);

  razorpay.open();
}
