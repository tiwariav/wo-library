// jest-dom adds custom jest matchers for asserting on DOM nodes.
import { jest } from "@jest/globals";
import "@testing-library/jest-dom";

window.scrollTo = jest.fn();

Object.defineProperty(globalThis, "matchMedia", {
  value: jest.fn().mockImplementation((query) => ({
    // deprecated
    addEventListener: jest.fn(),

    addListener: jest.fn(),

    dispatchEvent: jest.fn(),

    matches: false,
    media: query,

    onchange: null,

    removeEventListener: jest.fn(),
    // deprecated
    removeListener: jest.fn(),
  })),
  writable: true,
});
