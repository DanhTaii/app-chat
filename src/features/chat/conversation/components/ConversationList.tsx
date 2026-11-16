import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./ConversationList.scss";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import {getUserList, checkUserOnline, createRoom} from "@/features/chat/conversation/api/conversationApi";
import type { ApiConversationItem } from "@/features/chat/conversation/types/conversation";
import {setConversations, selectConversation, setUserOnlineStatus, addConversation} from "@/features/chat/conversation/store/conversationSlice";
import groupIcon from "@/shared/assets/group.svg";
import CreateRoomModal from "./create-room-modal/CreateRoomModal";

interface ConversationItem {
    id: string;
    initials?: string;
    name: string;
    type: 0 | 1;
    senderPrefix?: string;
    lastMessage: string;
    time: string;
    unreadCount?: number;
    online?: boolean;
    isGroup?: boolean;
    variant?: "primary" | "default" | "pink";
}

// const SAMPLE_CONVERSATIONS: ConversationItem[] = [
//     {
//         id: 1,
//         initials: "MA",
//         name: "Minh Anh",
//         lastMessage: "Chiều nay mình trao đổi phần giao diện...",
//         time: "10:42",
//         unreadCount: 2,
//         online: true,
//         variant: "primary",
//     },
//     {
//         id: 2,
//         name: "Nhóm Frontend Đồ Án",
//         senderPrefix: "Minh Anh:",
//         lastMessage: "Hẹn gặp ở thư viện 2h...",
//         time: "Th 3",
//         isGroup: true,
//         variant: "primary",
//     }
// ];

function getInitials(name: string): string {
    const trimmedName = name.trim();
    if (!trimmedName) return "?";
    const parts = trimmedName.split(/\s+/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return trimmedName.slice(0, 2).toUpperCase();
}

function formatActionTime(actionTime: string): string {
    if (!actionTime) return "";
    const parts = actionTime.split(" ");
    if (parts.length === 2) {
        return parts[1].slice(0, 5);
    }
    return actionTime;
}

async function syncDirectUsersOnline(
    conversations: ApiConversationItem[],
    onStatusUpdate: (name: string, online: boolean) => void,
    isCancelled: () => boolean
) {
    const directUsers = conversations.filter((item) => item.type === 0);
    for (const item of directUsers) {
        if (isCancelled()) break;
        try {
            const online = await checkUserOnline(item.name);
            if (isCancelled()) break;
            onStatusUpdate(item.name, online);
        } catch {
            // bỏ qua user lỗi để tiep tục kiem tra
        }
    }
}

function mapApiToConversationItem(item: ApiConversationItem, onlineUsers: Record<string, boolean>): ConversationItem {
    const isDirect = item.type === 0;
    return {
        id: `${item.type}-${item.name}`,
        name: item.name,
        type: item.type,
        initials: getInitials(item.name),
        lastMessage: item.type === 1 ? "Nhóm trò chuyện" : "Trò chuyện cá nhân",
        time: formatActionTime(item.actionTime),
        online: isDirect ? Boolean(onlineUsers[item.name]) : false,
        isGroup: item.type === 1,
        variant: "primary",
    };
}

function ConversationList() {
    const {t} = useTranslation("conversation");
    const [activeFilter, setActiveFilter] = useState<"all" | "direct" | "groups">("all");
    const dispatch = useAppDispatch();
    const apiConversations = useAppSelector((state) => state.conversation.conversations);
    const selectedConversation = useAppSelector((state) => state.conversation.selectedConversation);
    const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
    const username = useAppSelector((state) => state.auth.user?.username);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const onlineUsers = useAppSelector((state) => state.conversation.onlineUsers);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

    useEffect(() => {
        if (!isLoggedIn) {
            return;
        }

        let isMounted = true;
        const fetchUserList = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getUserList();
                if (!isMounted) return;
                // đẩy data lên store
                dispatch(setConversations(data));
                // truyền { name, type } mặc định item đầu lên Redux
                if (data.length > 0) {
                    dispatch(selectConversation({name: data[0].name, type: data[0].type}));
                }
                setLoading(false);
                await syncDirectUsersOnline(
                    data,
                    (name, online) => dispatch(setUserOnlineStatus({ name, online })),
                    () => !isMounted
                );
            } catch (err) {
                if (!isMounted) return;
                setError(err instanceof Error ? err.message : "Không thể tải danh sách hội thoại");
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };
        fetchUserList();
        return () => {
            isMounted = false;
        };
    }, [dispatch, isLoggedIn]);

    useEffect(() => {
        if (!isLoggedIn || apiConversations.length === 0) {
            return;
        }
        let isMounted = true;
        let isChecking = false;
        const intervalId = window.setInterval(async () => {
            if (isChecking) return;
            isChecking = true;
            try {
                await syncDirectUsersOnline(
                    apiConversations,
                    (name, online) => dispatch(setUserOnlineStatus({ name, online })),
                    () => !isMounted
                );
            } finally {
                isChecking = false;
            }
        }, 30000);
        return () => {
            isMounted = false;
            window.clearInterval(intervalId);
        };
    }, [apiConversations, dispatch, isLoggedIn]);

    const conversationItems = apiConversations.map((item) =>
        mapApiToConversationItem(item, onlineUsers)
    );

    const normalizedKeyword = searchKeyword.trim().toLowerCase();

    const filteredConversations = conversationItems.filter((item) => {
        const matchesFilter =
            activeFilter === "all" ||
            (activeFilter === "groups" && item.type === 1) ||
            (activeFilter === "direct" && item.type === 0);

        const matchesSearch =
            normalizedKeyword === "" ||
            item.name.toLowerCase().includes(normalizedKeyword);

        return matchesFilter && matchesSearch;
    });

    // xử lý click
    const handleSelectConversation = async (conversation: ConversationItem) => {
        dispatch(
            selectConversation({
                name: conversation.name,
                type: conversation.type,
            })
        );
        setSearchKeyword("");
        if (conversation.type === 0) {
            try {
                const online = await checkUserOnline(conversation.name);
                dispatch(setUserOnlineStatus({ name: conversation.name, online }));
            } catch {}
        }
    };

    const handleCreateRoom = async (roomName: string) => {
        const createdRoom = await createRoom(roomName);
        const finalRoomName = createdRoom.name || roomName;

        dispatch(
            addConversation({
                name: finalRoomName,
                type: 1,
            })
        );

        setSearchKeyword("");
        if (activeFilter === "direct") {
            setActiveFilter("all");
        }
    };


    return (
        <aside className="conversation-list" aria-label="Danh sách hội thoại">
            <div className="conversation-list__top">
                <div className="conversation-list__header">
                    <h2>{username ? t("conversation.title.greeting", { username }) : t("conversation.title.messages")}</h2>
                    <button type="button" className="conversation-list__compose-btn" onClick={() => setIsCreateModalOpen(true)} aria-label="Tạo cuộc trò chuyện mới">
                        <i className="fa-regular fa-pen-to-square"></i>
                    </button>
                </div>

                <div className="conversation-list__search-box">
                    <img className="conversation-list__search-icon" src="/src/shared/assets/search.svg" alt="Search"/>
                    <input type="search" className="conversation-list__search" aria-label={t("conversation.search.placeholder")}
                        placeholder={t("conversation.search.placeholder")} value={searchKeyword}
                        onChange={(event) => setSearchKeyword(event.target.value)}/>
                </div>

                <div className="conversation-list__filters" role="group" aria-label="Lọc hội thoại">
                    <button type="button"
                            className={`conversation-list__chip ${activeFilter === "all" ? "conversation-list__chip--active" : ""}`}
                            onClick={() => setActiveFilter("all")}>
                        {t("conversation.filter.all")}
                    </button>
                    <button type="button"
                            className={`conversation-list__chip ${activeFilter === "direct" ? "conversation-list__chip--active" : ""}`}
                            onClick={() => setActiveFilter("direct")}>
                        {t("conversation.filter.direct")}
                    </button>
                    <button type="button"
                            className={`conversation-list__chip ${activeFilter === "groups" ? "conversation-list__chip--active" : ""}`}
                            onClick={() => setActiveFilter("groups")}>
                        {t("conversation.filter.groups")}
                    </button>
                </div>
            </div>

            <ul className="conversation-list__items">
                {!isLoggedIn && (<li style={{padding: "16px", textAlign: "center", color: "var(--color-danger, red)"}}>Đăng nhập trước.</li>)}

                {isLoggedIn && loading && (<li style={{padding: "16px", textAlign: "center", color: "var(--color-secondary-text)"}}>Đang tải danh sách...</li>)}

                {isLoggedIn && !loading && error && (<li style={{padding: "16px", textAlign: "center", color: "var(--color-danger, red)"}}>Lỗi: {error}</li>)}

                {isLoggedIn && !loading && !error && conversationItems.length === 0
                    && (<li style={{padding: "16px", textAlign: "center", color: "var(--color-secondary-text)"}}>Không có cuộc trò chuyện nào.</li>)}

                {isLoggedIn && !loading && !error && conversationItems.length > 0 && filteredConversations.length === 0 && (
                    <li style={{ padding: "16px", textAlign: "center", color: "var(--color-secondary-text)" }}>
                        Không tìm thấy cuộc trò chuyện phù hợp.
                    </li>
                )}

                {isLoggedIn && !loading && !error && filteredConversations.map((item) => {
                        const isSelected =
                            selectedConversation?.name === item.name &&
                            selectedConversation?.type === item.type;

                        return (
                            <li key={item.id}>
                                <button type="button" className={`conversation-list__item ${isSelected ? "conversation-list__item--active" : ""}`} onClick={() => handleSelectConversation(item)}>
                                    <div className={`conversation-list__avatar ${item.isGroup ? "conversation-list__avatar--group" : `conversation-list__avatar--${item.variant || "primary"}`}`}>
                                        {item.isGroup ? (<img className="conversation-list__avatar-icon" src={groupIcon} alt={item.name} />) : (<span>{item.initials}</span>)}
                                        {item.online && <span className="conversation-list__online-dot"></span>}
                                    </div>

                                    <div className="conversation-list__text">
                                      <span className={`conversation-list__name ${isSelected || item.unreadCount || item.isGroup ? "conversation-list__name--bold" : ""}`}>
                                        {item.name}
                                      </span>
                                      <span className="conversation-list__last">
                                        {item.senderPrefix && (<strong className="conversation-list__sender">{item.senderPrefix}{" "}</strong>)}
                                        {item.lastMessage}
                                      </span>
                                    </div>

                                    <div className="conversation-list__meta">
                                      <span className={`conversation-list__time ${isSelected ? "conversation-list__time--active" : ""}`}>
                                        {item.time}
                                      </span>
                                       {item.unreadCount && (
                                            <span className="conversation-list__unread-badge">
                                              {item.unreadCount}
                                            </span>)}
                                    </div>
                                </button>
                            </li>
                        );
                    })}
            </ul>
            <CreateRoomModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onCreateRoom={handleCreateRoom}/>
        </aside>
    );
}

export default ConversationList
