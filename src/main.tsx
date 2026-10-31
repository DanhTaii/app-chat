import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./shared/assets/styles/global.scss";
import { Provider } from "react-redux";
import { store } from "./app/store/store";
import App from "./app/App";
import "./shared/i18n";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Provider bọc các component bên trong */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
