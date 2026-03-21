declare module "*.module.css" {
  const classes: Record<string, string>;
  export = classes;
}

declare module "*.css" {
  const content: string;
  export default content;
}
