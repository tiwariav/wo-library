import { Calendly } from "../src/interfaces/calendly.js";
import { Razorpay } from "../src/interfaces/razorpay.js";

declare global {
  interface Window {
    Calendly: Calendly;
    Razorpay: Razorpay;
  }
}
