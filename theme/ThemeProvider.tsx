import React, { createContext, ReactNode, useContext } from "react";
import { FONT_FAMILY } from "./typography";

const ThemeContext = createContext({ fontFamily: FONT_FAMILY.arabic });
export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeContext.Provider value={{ fontFamily: FONT_FAMILY.arabic }}>
      {children}
    </ThemeContext.Provider>
  );
}
