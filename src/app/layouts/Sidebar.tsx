import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../router/routes";
import {
    applyTheme,
    getInitialTheme,
    type Theme,
} from "../../shared/utils/theme";
import "./Sidebar.scss";
import chatSocket from "../../shared/services/socket/socketService";
import { logout as logoutApi } from "../../features/auth/services/authApi";
import { clearSession } from "../../features/auth/services/authSession";
import { logout as logoutSuccess } from "../../features/auth/slices/authSlice";
import { useAppDispatch } from "../store/hooks";

function Sidebar() {
    const { i18n } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState("vi");
    const [theme, setTheme] = useState<Theme>(getInitialTheme);
    const [isSettingOpen, setIsSettingOpen] = useState(false);

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
        setCurrentLanguage(currentLanguage === "en" ? "vi" : "en");
        i18n.changeLanguage(currentLanguage === "en" ? "vi" : "en");
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
                <img className="sidebar__logo" src="/src/shared/assets/logo-light.svg" alt="App Logo"/>

                <NavLink to={ROUTES.CHAT} className={({isActive}) => isActive ? "sidebar__item sidebar__item--active" : "sidebar__item"}>
                    <img className="sidebar__icon" src="/src/shared/assets/messages.svg" alt="Tin nhắn"/>
                    <span>Tin nhắn</span>
                </NavLink>

                {/*phần setting*/}
                <div className="sidebar__setting">
                    <button type="button" className="sidebar__item"
                        onClick={() => setIsSettingOpen(!isSettingOpen)}>
                        <img className="sidebar__icon" src="/src/shared/assets/setting.svg" alt="Cài đặt"/>
                        <span>Cài đặt</span>
                    </button>

                    {isSettingOpen && (
                        <div className="sidebar__menu">
                            <button type="button" className="sidebar__menu-item" onClick={toggleTheme}>
                                <span>{theme === "dark" ? "☀️" : "🌙"}</span>
                                <span>Theme ({theme})</span>
                            </button>

                            <button
                                type="button"
                                className="sidebar__menu-item"
                                onClick={toggleTranslateLanguage}
                            >
                                <i className="fa-solid fa-globe"></i>
                                <span>Language ({currentLanguage.toUpperCase()})</span>
                            </button>

                            <button
                                type="button"
                                className="sidebar__menu-item sidebar__menu-item--danger"
                                onClick={handleLogout}
                                disabled={logOut}
                            >
                                <span>{logOut ? "Đang đăng xuất…" : "Đăng xuất"}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="sidebar__bottom">
                <img
                    className="sidebar__avatar"
                    src="/src/shared/assets/avatar.webp"
                    alt="Avatar"
                />
            </div>
        </aside>
    );
}

export default Sidebar;