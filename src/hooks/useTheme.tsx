import { useColorScheme } from "./xnft-hooks";

export function useTheme() {
  const colorScheme = useColorScheme();
  const theme = darkTheme;

  return {
    custom: theme,
    colorScheme,
  };
}

const darkTheme = {
  backgroundColor: "black",
  fontColor: "white",
};
