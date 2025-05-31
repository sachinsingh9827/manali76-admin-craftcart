import { useEffect } from "react";
import { useSelector } from "react-redux";

export const useThemeEffect = () => {
  const theme = useSelector((state) => state.theme.mode);

  useEffect(() => {
    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [theme]);
};
