import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";
import { I18nProvider } from "./i18n/I18nContext";
import { ThemeProvider } from "./theme/ThemeContext";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <I18nProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </I18nProvider>
);
