import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../router/routes";
import {
    applyTheme,
    getInitialTheme,
    type Theme,
} from "../../shared/utils/theme";
import "./Sidebar.scss";

function Sidebar() {
    const { i18n } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState("vi");
    const [theme, setTheme] = useState<Theme>(getInitialTheme);
    const [isSettingOpen, setIsSettingOpen] = useState(false);

    const toggleTheme = () => {
        const nextTheme = theme === "dark" ? "light" : "dark";
        setTheme(nextTheme);
        applyTheme(nextTheme);
    };

    const toggleTranslateLanguage = () => {
        setCurrentLanguage(currentLanguage === "en" ? "vi" : "en");
        i18n.changeLanguage(currentLanguage === "en" ? "vi" : "en");
    };

    return (
        <aside className="sidebar">
            <div className="sidebar__top">
                <img className="sidebar__logo" src="/src/shared/assets/logo.png" alt="App Logo"/>

                <Link to={ROUTES.CHAT} className="sidebar__item">
                    <i className="fa-regular fa-comment"></i>
                    <span>Tin nhắn</span>
                </Link>

                <div className="sidebar__setting">
                    <button type="button" className="sidebar__item"
                        onClick={() => setIsSettingOpen(!isSettingOpen)}>
                        <i className="fa-solid fa-gear"></i>
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
                            >
                                <span>Log out</span>
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