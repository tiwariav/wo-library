import { WoLoadScriptError } from "../../utils/error";
import loadScript from "../loadScript";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export async function checkout({
  currency,
  description,
  handleClose,
  handleSuccess,
  handleError,
  name,
  orderID,
  prefill,
}) {
  const response = await loadScript(
    "https://checkout.razorpay.com/v1/checkout.js"
  );
  if (!response) {
    throw new WoLoadScriptError("Razorpay SDK failed to load!");
  }

  const options = {
    currency,
    description,
    handler: handleSuccess,
    key: process.env.REACT_APP_WO_RAZORPAY_KEY,
    modal: { ondismiss: handleClose },
    name,
    order_id: orderID,
    prefill,
  };

  const razorpay = new window.Razorpay(options);

  razorpay.on("payment.failed", handleError);

  razorpay.open();
}
