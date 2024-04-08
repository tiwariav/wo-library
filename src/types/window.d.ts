import type { Calendly } from "./interfaces/calendly.js";
import type { Razorpay } from "./interfaces/razorpay.js";

declare global {
  interface Window {
    Calendly: Calendly;
    Razorpay: Razorpay;
  }
}
