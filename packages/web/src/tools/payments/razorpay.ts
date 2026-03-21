import type { RazorpayOptions } from "../../types/interfaces/razorpay.js";

import { WoLoadScriptError } from "../error/index.js";
import loadScript from "../loadScript.js";

/**
 * Configuration options for the Razorpay checkout popup.
 *
 * @property currency - ISO 4217 currency code (e.g., `"INR"`).
 * @property description - Optional description shown in the checkout modal.
 * @property handleClose - Called when the user dismisses the modal.
 * @property handleError - Called when a payment fails.
 * @property handleSuccess - Called when a payment succeeds.
 * @property key - Razorpay API key.
 * @property name - Merchant/business name.
 * @property orderId - Razorpay order ID.
 * @property prefill - Prefill data (name, email, contact, etc.).
 */
export interface RazorpayCheckoutOptions {
  currency: string;
  description?: string;
  handleClose: CallableFunction;
  handleError: CallableFunction;
  handleSuccess: CallableFunction;
  key: string;
  name: string;
  orderId: string;
  prefill: object;
}

/**
 * Loads the Razorpay SDK and opens the checkout modal.
 *
 * @param options - Checkout configuration including key, order ID, and callbacks.
 * @throws {WoLoadScriptError} If the Razorpay SDK fails to load.
 *
 * @example
 * ```ts
 * await checkout({
 *   key: "rzp_live_xxx",
 *   orderId: "order_abc",
 *   name: "My Store",
 *   currency: "INR",
 *   handleSuccess: (response) => console.log(response),
 *   handleError: (err) => console.error(err),
 *   handleClose: () => console.log("closed"),
 *   prefill: { email: "user@example.com" },
 * });
 * ```
 */
export async function checkout({
  currency,
  description,
  handleClose,
  handleError,
  handleSuccess,
  key,
  name,
  orderId,
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
    order_id: orderId,
    prefill,
  };

  const razorpay = new globalThis.window.Razorpay(options);

  razorpay.on("payment.failed", handleError);

  razorpay.open();
}
