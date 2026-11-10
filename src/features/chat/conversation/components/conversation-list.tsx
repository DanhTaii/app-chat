import {useState} from "react";
import {useTranslation} from "react-i18next";
import "./conversation-list.scss";

interface ConversationItem {
    id: number;
    initials?: string;
    name: string;
    senderPrefix?: string;
    lastMessage: string;
    time: string;
    unreadCount?: number;
    online?: boolean;
    isGroup?: boolean;
    variant?: "primary" | "default" | "pink";
}

const SAMPLE_CONVERSATIONS: ConversationItem[] = [
    {
        id: 1,
        initials: "MA",
        name: "Minh Anh",
        lastMessage: "Chiều nay mình trao đổi phần giao diện...",
        time: "10:42",
        unreadCount: 2,
        online: true,
        variant: "primary",
    },
    {
        id: 2,
        name: "Nhóm Frontend Đồ Án",
        senderPrefix: "Minh Anh:",
        lastMessage: "Hẹn gặp ở thư viện 2h...",
        time: "Th 3",
        isGroup: true,
        variant: "primary",
    }
];

function ConversationList() {
    const {t} = useTranslation("conversation");
    const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "groups">("all");
    const [selectedId, setSelectedId] = useState<number>(1);

    return (
        <aside className="conversation-list" aria-label="Danh sách hội thoại">
            <div className="conversation-list__top">
                <div className="conversation-list__header">
                    <h2>{t("conversation.title.messages")}</h2>
                    <button type="button" className="conversation-list__compose-btn"
                            aria-label="Tạo cuộc trò chuyện mới">
                        <i className="fa-regular fa-pen-to-square"></i>
                    </button>
                </div>

                <div className="conversation-list__search-box">
                    <img className="conversation-list__search-icon" src="/src/shared/assets/search.svg" alt="Search"/>
                    <input type="search" className="conversation-list__search"
                           aria-label={t("conversation.search.placeholder")}
                           placeholder={t("conversation.search.placeholder")}/>
                </div>

                <div className="conversation-list__filters" role="group" aria-label="Lọc hội thoại">
                    <button type="button"
                            className={`conversation-list__chip ${activeFilter === "all" ? "conversation-list__chip--active" : ""}`}
                            onClick={() => setActiveFilter("all")}>
                        {t("conversation.filter.all")}
                    </button>
                    <button type="button"
                            className={`conversation-list__chip ${activeFilter === "unread" ? "conversation-list__chip--active" : ""}`}
                            onClick={() => setActiveFilter("unread")}>
                        {t("conversation.filter.unread")}
                        <span className="conversation-list__filter-badge">3</span>
                    </button>
                    <button type="button"
                            className={`conversation-list__chip ${activeFilter === "groups" ? "conversation-list__chip--active" : ""}`}
                            onClick={() => setActiveFilter("groups")}>
                        {t("conversation.filter.groups")}
                    </button>
                </div>
            </div>

            <ul className="conversation-list__items">
                {SAMPLE_CONVERSATIONS.map((item) => {
                    const isSelected = item.id === selectedId;
                    const displayTime = item.time === "yesterday" ? t("conversation.time.yesterday") : item.time;

                    return (
                        <li key={item.id}>
                            <button type="button"
                                    className={`conversation-list__item ${isSelected ? "conversation-list__item--active" : ""}`}
                                    onClick={() => setSelectedId(item.id)}>
                                <div
                                    className={`conversation-list__avatar conversation-list__avatar--${item.variant || "default"} ${
                                        item.isGroup ? "conversation-list__avatar--group" : ""}`}>
                                    {item.isGroup ? (<i className="fa-solid fa-user-group"></i>) : (
                                        <span>{item.initials}</span>)}
                                    {item.online && (<span className="conversation-list__online-dot"></span>)}
                                </div>

                                <div className="conversation-list__text">
                                    <span
                                        className={`conversation-list__name ${isSelected || item.unreadCount || item.isGroup ? "conversation-list__name--bold" : ""}`}>
                                        {item.name}
                                    </span>
                                    <span className="conversation-list__last">
                                        {item.senderPrefix && (
                                            <strong className="conversation-list__sender">
                                                {item.senderPrefix}{" "}
                                            </strong>)}
                                        {item.lastMessage}
                                    </span>
                                </div>

                                <div className="conversation-list__meta">
                                    <span
                                        className={`conversation-list__time ${isSelected ? "conversation-list__time--active" : ""}`}>
                                        {displayTime}
                                    </span>
                                    {item.unreadCount && (
                                        <span className="conversation-list__unread-badge">{item.unreadCount}</span>)}
                                </div>
                            </button>
                        </li>
                    );
                })}
            </ul>

            <div className="conversation-list__footer">
                <div className="conversation-list__network">
                    <span className="conversation-list__network-dot"></span>
                    <span>Mạng kết nối: Rất tốt</span>
                </div>
                <span className="conversation-list__version">v1.0.0</span>
            </div>
        </aside>
    );
}

export default ConversationList
