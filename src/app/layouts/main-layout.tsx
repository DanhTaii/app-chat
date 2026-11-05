import {Link, Outlet} from "react-router-dom";
import {ROUTES} from "../router/routes";
import {useTranslation} from "react-i18next";
import {useState} from "react";

function MainLayout() {
    const {i18n} = useTranslation()
    const [currentLanguage, setCurrentLanguage] = useState('en');

    const toggleTranslateLanguage = () => {
        setCurrentLanguage(currentLanguage === "en" ? "vi" : "en")
        i18n.changeLanguage(currentLanguage === "en" ? "vi" : "en")
    }

    return (
        <>
            <nav>
                <Link to={ROUTES.LOGIN}>Login</Link> |{" "}
                <Link to={ROUTES.CHAT}>Chat</Link> |{" "}
                <Link to={ROUTES.COMPONENTS}>Components</Link>
                <button className="btn btn-primary "
                    onClick={toggleTranslateLanguage}
                >
                    Change language EN - VI
                </button>
            </nav>
            <main>
                <Outlet/>
            </main>
        </>
    );
}

export default MainLayout;
