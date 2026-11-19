import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store/store";
import App from "./app/App";

// import cấu hình, style chung
import "./shared/assets/styles/global.scss";
import "./shared/i18n";
import { applyTheme, getInitialTheme } from "./shared/utils/theme";

applyTheme(getInitialTheme());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Provider bọc các components bên trong */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
