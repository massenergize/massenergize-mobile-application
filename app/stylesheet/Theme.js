// Customize Native Base Theme to match the app theme
import { extendTheme } from "native-base";

export default Theme = extendTheme({
  colors: {
    primary: {
      50: "#89cd7f",
      100: "#80c575",
      200: "#77be6c",
      300: "#6fb664",
      400: "#64b058",
      500: "#60aa55",
      600: "#5fa155",
      700: "#5d9754",
      800: "#5b8e54",
      900: "#598553",
    },
    secondary: {
      50: "#df755e",
      100: "#d96b52",
      200: "#d36148",
      300: "#cd583d",
      400: "#c84e34",
      500: "#bc4d34",
      600: "#b14c35",
      700: "#a74a35",
      800: "#9d4936",
      900: "#934736",
    },
  },
  // customize breakpoints
  // reference:https://github.com/GeekyAnts/NativeBase/issues/5217#issuecomment-1194435310
  breakpoints: {
    'base': 0,
    'sm': 376,
    'md': 481,
    'lg': 769,
    'xl': 993,
    '2xl': 1281,
  },
  components: {
  },
});
