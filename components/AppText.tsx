import { Text as RNText, TextProps } from "react-native";
import { useTheme } from "../theme/ThemeProvider";

export default function AppText(props: TextProps) {
  const { fontFamily } = useTheme();
  return <RNText {...props} style={[{ fontFamily }, props.style]} />;
}
