import { useState } from "react";
import { NavLink } from "react-router-dom";
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