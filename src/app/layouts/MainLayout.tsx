import "./MainLayout.css";
import {Link, Outlet, useLocation} from "react-router-dom";
import {ROUTES} from "../router/routes";
import {useTranslation} from "react-i18next";
import {useState} from "react";
import {
    applyTheme,
    getInitialTheme,
    type Theme,
} from "../../shared/utils/theme";
import Sidebar from "./Sidebar";
import chatSocket from "@/shared/services/socket/socketService.ts";

function MainLayout() {
    const {i18n} = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState("vi");
    const [theme, setTheme] = useState<Theme>(getInitialTheme);
    const {pathname} = useLocation();
    const showSidebar = pathname.startsWith(ROUTES.CHAT);

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
      try {
            // 1. Import SocketService
            await chatSocket.connect();
            console.log("WebSocket connected!");

            // comment lại 
            // // 3. Gửi LOGIN và chờ response
            // const response = await chatSocket.request("LOGIN", {
            //     user: "danhtai",
            //     pass: "tai.HDT,011892"
            // });
            // // 4. Hiển thị kết quả
            // console.log("LOGIN RESPONSE:", response);

        } catch (error) {
            console.error("Socket testing failed:", error);
        }
    }

    return (
        <div className="main-layout">
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
            <div className="main-layout__body">
                {showSidebar ? <Sidebar/> : null}
                <main className="main-layout__content">
                    <Outlet/>
                </main>
            </div>
        </div>
    );
}

export default MainLayout;
