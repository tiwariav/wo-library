import { Calendly } from "./calendly.js";
import { Razorpay } from "./razorpay.js";

declare global {
  interface Window {
    Calendly: Calendly;
    Razorpay: Razorpay;
  }
}
