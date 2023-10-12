import { Calendly } from "./interfaces/calendly.js";
import { Razorpay } from "./interfaces/razorpay.js";

declare global {
  interface Window {
    Calendly: Calendly;
    Razorpay: Razorpay;
  }
}
