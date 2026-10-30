import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/styles/global.scss";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./app/App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Provider bọc các component bên trong */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
