import { useState } from "react";
import {useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../router/routes";
import {
    applyTheme,
    getInitialTheme,
    type Theme,
} from "../../shared/utils/theme";
import "./Sidebar.scss";
import chatSocket from "../../shared/services/socket/socketService";
import { logout as logoutApi } from "../../features/auth/session/api/sessionApi";
import { clearSession } from "../../features/auth/session/services/authSession";
import { logout as logoutSuccess } from "../../features/auth/store/authSlice";
import { useAppDispatch } from "../store/hooks";
import logoLight from "../../shared/assets/logo-light.svg";
import logoDark from "../../shared/assets/logo-dark.svg";
import themeLight from "../../shared/assets/theme-light.svg";
import themeDark from "../../shared/assets/theme-dark.svg";

function Sidebar() {
    const { t, i18n } = useTranslation("layout");
    const currentLanguage = i18n.language === "en" ? "en" : "vi";
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    // logout
    const [logOut, setLogOut] = useState(false);
    const [logoutError, setLogoutError] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const toggleTheme = () => {
        const nextTheme = theme === "dark" ? "light" : "dark";
        setTheme(nextTheme);
        applyTheme(nextTheme);
    };

    const toggleTranslateLanguage = () => {
        const nextLanguage = currentLanguage === "en" ? "vi" : "en";
        i18n.changeLanguage(nextLanguage);
    };

    const handleLogout = async () => {
        if (logOut) return;

        setLogOut(true);
        setLogoutError(null);
        try {
            const response = await logoutApi();
            if (response.status !== "success") {
                throw new Error(response.mes || "Đăng xuất thất bại.");
            }

            clearSession();
            dispatch(logoutSuccess());
            chatSocket.disconnect();
            navigate(ROUTES.LOGIN, { replace: true });
        } catch (error) {
            setLogoutError(error instanceof Error ? error.message : "Đăng xuất thất bại.");
        } finally {
            setLogOut(false);
        }
    };

    return (
        <aside className="sidebar">
            <div className="sidebar__top">
                <img className="sidebar__logo" src={theme === "dark" ? logoDark : logoLight} alt="App Logo"/>
            </div>
            <div className="sidebar__bottom">
                <button type="button" className="sidebar__item" onClick={toggleTheme} title={theme === "dark" ? t("sidebar.lightMode") : t("sidebar.darkMode")}>
                    <img className="sidebar__icon" src={theme === "dark" ? themeDark : themeLight} alt="" aria-hidden="true"/>
                    <span>{theme === "dark" ? t("sidebar.light") : t("sidebar.dark")}</span>
                </button>
                <button type="button" className="sidebar__item" onClick={toggleTranslateLanguage} title={t("sidebar.changeLanguage")}>
                    <i className="fa-solid fa-globe"></i>
                    <span>{currentLanguage.toUpperCase()}</span>
                </button>
                <button type="button" className="sidebar__item sidebar__item--danger" onClick={handleLogout} disabled={logOut} title={logoutError || t("sidebar.logout")}>
                    <i className="fa-solid fa-right-from-bracket"></i>
                    <span>{logOut ? "..." : t("sidebar.exit")}</span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
