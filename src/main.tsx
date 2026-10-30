import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import { Provider } from "react-redux";
import { store } from "./app/store";
import Auth from "./features/auth/components/Auth";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Provider bọc các component bên trong */}
    <Provider store={store}>
      <main>
        <Auth />
      </main>
    </Provider>
  </StrictMode>,
);
