export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: { expanded: true },
};

export const globalTypes = {
  locale: {
    defaultValue: "en",
    description: "Internationalization locale",
    name: "Locale",
    toolbar: {
      icon: "globe",
      items: [
        { right: "🇺🇸", title: "English", value: "en" },
        { right: "🇫🇷", title: "Français", value: "fr" },
        { right: "🇪🇸", title: "Español", value: "es" },
        { right: "🇨🇳", title: "中文", value: "zh" },
        { right: "🇰🇷", title: "한국어", value: "kr" },
      ],
    },
  },
  theme: {
    defaultValue: "default",
    description: "Global theme for components",
    name: "Theme",
    toolbar: {
      icon: "circlehollow",
      // array of plain string values or MenuItem shape (see below)
      items: ["default"],
    },
  },
};
