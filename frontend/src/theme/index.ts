import { extendTheme } from "@chakra-ui/react";

const themeStyles = {
  colors: {
    brand: {
      100: "#f7fafc",
    },
  },
};

export const theme = extendTheme({
  styles: {
    global: {
      "html, body": {
        fontFamily: "Work Sans, sans-serif",
        color: "#4A5568",
      },
    },
  },
  ...themeStyles,
});
