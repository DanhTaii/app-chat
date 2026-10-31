import {Link, Outlet} from "react-router";
import {ROUTES} from "../router/routes";
import {useTranslation} from "react-i18next";
import {useState} from "react";

function MainLayout() {
    const {t, i18n} = useTranslation()
    const [currentLanguage, setCurrentLanguage] = useState('en');

    return (
        <>
            <nav>
                <Link to={ROUTES.LOGIN}>Login</Link> |{" "}
                <Link to={ROUTES.CHAT}>Chat</Link> |{" "}
                <Link to={ROUTES.COMPONENTS}>Components</Link>
            </nav>
            <main>
                <Outlet/>
            </main>
            <div className="container text-center">
                <h1 className="my-3">React i18n</h1>
                <button
                    className="btn btn-primary me-2"
                    onClick={() => {
                        setCurrentLanguage(currentLanguage === "en" ? "vi" : "en")
                        i18n.changeLanguage(currentLanguage === "en" ? "vi" : "en")
                    }}
                >
                    Change language EN - VI
                </button>
                <span className="badge rounded-pill text-bg-danger me-1">
                    {t("common.button.search")}
                </span>
                <span className="badge rounded-pill text-bg-danger me-1">
                    {t("common.button.cancel")}
                </span>
                <span className="badge rounded-pill text-bg-danger me-1">
                    {t("common.button.delete")}
                </span>
                <span className="badge rounded-pill text-bg-danger me-1">
                    {t("common.button.save")}
                </span>
            </div>
        </>
    );
}

export default MainLayout;
