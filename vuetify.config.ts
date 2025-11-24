export const vuetifyConfig = {
  // Define global component defaults
  defaults: {
    VTextField: {
      hideDetails: true,
      variant: "outlined",
    },
    VTextarea: {
      hideDetails: true,
      variant: "outlined",
    },
    VSelect: {
      hideDetails: true,
      variant: "outlined",
    },
    VCard: {
      elevation: 0,
      rounded: "0",
    },
    VAppBar: {
      elevation: 0,
      rounded: "0",
    },
    VList: {
      rounded: "0",
    },
  },

  // Define themes
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        colors: {
          background: "#C4C0A9",
          surface: "#D3CDB5",
          primary: "#47453D",
          secondary: "#C4C0A9",
          accent: "#D3CDB5",
          error: "#FF5252",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FB8C00",
          text: "#47453D",
          "on-surface": "#47453D",
          "on-background": "#47453D",
          "on-primary": "#C4C0A9",
          "on-secondary": "#47453D",
        },
      },
    },
  },
};
