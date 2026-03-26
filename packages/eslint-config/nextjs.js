import config, { rcCompat } from "./flatConfig";

export default [
  ...config,
  rcCompat.extends("plugin:@next/next/recommended", "plugin:@next/next/core-web-vitals")
];
