import { Link, Outlet } from "react-router-dom";
import { ROUTES } from "../router/routes";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
  applyTheme,
  getInitialTheme,
  type Theme,
} from "../../shared/utils/theme";

function MainLayout() {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState("vi");
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  const toggleTranslateLanguage = () => {
    setCurrentLanguage(currentLanguage === "en" ? "vi" : "en");
    i18n.changeLanguage(currentLanguage === "en" ? "vi" : "en");
  };

  async function createSocket() {
    // @ts-ignore
    const { default: chatSocket } =
      await import("/src/shared/services/socket/socketService.ts");
    chatSocket.connect();
  }

  return (
    <>
      <nav>
        <Link to={ROUTES.LOGIN}>Login</Link> |{" "}
        <Link to={ROUTES.REGISTER}>Register</Link> |{" "}
        <Link to={ROUTES.CHAT}>Chat</Link> |{" "}
        <Link to={ROUTES.COMPONENTS}>Components</Link>
        <button className="btn btn-primary " onClick={toggleTranslateLanguage}>
          Change language EN - VI
        </button>
        <button onClick={createSocket}>Socket Testing</button>
        <button
          className="theme-toggle"
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          title={`Chuyển ${theme === "dark" ? "light" : "dark"} theme`}
        >
          <span aria-hidden="true">{theme === "dark" ? "☀️" : "🌙"}</span>
        </button>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;
