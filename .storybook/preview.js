import { withTests } from "@storybook/addon-jest";

let results;

try {
  results = "../reports/test-report.json";
} catch {
  console.log("reports/test-report.json does not exist, skipping.");
}
export const decorators = [withTests({ results })];
