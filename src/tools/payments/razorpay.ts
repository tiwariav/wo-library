import { WoLoadScriptError } from "../error/index.js";
import loadScript from "../loadScript.js";

export async function checkout({
  currency,
  description,
  handleClose,
  handleSuccess,
  handleError,
  name,
  orderID,
  prefill,
  key,
}: {
  currency: string;
  description: string;
  handleClose: CallableFunction;
  handleSuccess: CallableFunction;
  handleError: CallableFunction;
  name: string;
  orderID: string;
  prefill: object;
  key: string;
}) {
  const response = await loadScript(
    "https://checkout.razorpay.com/v1/checkout.js"
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
