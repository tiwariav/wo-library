import { Calendly } from "./interfaces/calendly.ts";
import { Razorpay } from "./interfaces/razorpay.ts";

declare global {
  interface Window {
    Calendly: Calendly;
    Razorpay: Razorpay;
  }
}
