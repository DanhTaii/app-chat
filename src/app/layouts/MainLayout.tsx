import "./MainLayout.scss";
import {Outlet, useLocation} from "react-router-dom";
import {ROUTES} from "../router/routes";
import Sidebar from "./Sidebar";

function MainLayout() {
    const {pathname} = useLocation();
    const showSidebar = pathname.startsWith(ROUTES.CHAT);

    return (
        <div className="main-layout">

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
