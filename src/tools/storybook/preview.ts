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
        { right: "🇮🇳", title: "हिन्दी", value: "hi" },
      ],
    },
  },
};
