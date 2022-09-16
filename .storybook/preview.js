import { withTests } from "@storybook/addon-jest";
import { addDecorator } from "@storybook/react";
import { globalTypes, parameters } from "../src/tools/cjs/storybook/index.cjs";
// import "../styles/base.css";

export { parameters, globalTypes };

let results;

try {
  results = "../reports/test-report.json";
} catch {
  console.log("reports/test-report.json does not exist, skipping.");
}

if (results) addDecorator(withTests({ results }));
