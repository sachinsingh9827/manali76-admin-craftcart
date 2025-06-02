import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
import dashboardReducer from "./dashboardSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    dashboard: dashboardReducer, // <-- use the slice name here
  },
});
