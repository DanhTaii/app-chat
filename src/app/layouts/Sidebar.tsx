import "./Sidebar.scss";

function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar__top">
                <img
                    className="sidebar__logo"
                    src="/src/shared/assets/logo.png"
                    alt="App Logo"
                />
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