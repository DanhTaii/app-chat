import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./ConversationList.scss";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import chatSocket from "@/shared/services/socket/socketService";
import {getUserList, checkUserOnline, checkUserExist, createRoom, joinRoom} from "@/features/chat/conversation/api/conversationApi";
import type { ApiConversationItem, RoomModalMode } from "@/features/chat/conversation/types/conversation";
import {setConversations, selectConversation, setUserOnlineStatus, addConversation} from "@/features/chat/conversation/store/conversationSlice";
import groupIcon from "@/shared/assets/group.svg";
import RoomModal from "@/features/chat/conversation/components/room-modal/RoomModal.tsx";

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

type ConversationFilter = "all" | "direct" | "groups";

const CONVERSATION_FILTERS: readonly ConversationFilter[] = ["all", "direct", "groups"];

function mapApiToConversationItem(
    item: ApiConversationItem,
    onlineUsers: Record<string, boolean>,
    typeLabels: { direct: string; group: string }
): ConversationItem {
    const isDirect = item.type === 0;
    return {
        id: `${item.type}-${item.name}`,
        name: item.name,
        type: item.type,
        initials: getInitials(item.name),
        lastMessage: item.type === 1 ? typeLabels.group : typeLabels.direct,
        time: formatActionTime(item.actionTime),
        online: isDirect ? Boolean(onlineUsers[item.name]) : false,
        isGroup: item.type === 1,
        variant: "primary",
    };
}

function ConversationList() {
    const {t} = useTranslation("conversation");
    const [activeFilter, setActiveFilter] = useState<ConversationFilter>("all");
    const dispatch = useAppDispatch();
    const apiConversations = useAppSelector((state) => state.conversation.conversations);
    const selectedConversation = useAppSelector((state) => state.conversation.selectedConversation);
    const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
    const username = useAppSelector((state) => state.auth.user?.username);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const onlineUsers = useAppSelector((state) => state.conversation.onlineUsers);
    const [isRoomModalOpen, setIsRoomModalOpen] = useState<boolean>(false);
    const [searchCheckStatus, setSearchCheckStatus] = useState<"idle" | "checking" | "user_found" | "room_found" | "not_found">("idle");
    const [quickRoomLoading, setQuickRoomLoading] = useState<"join" | "create" | null>(null);
    const [quickRoomError, setQuickRoomError] = useState<string | null>(null);

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

    const typeLabels = {
        direct: t("conversation.itemType.direct"),
        group: t("conversation.itemType.group"),
    };

    const conversationItems = apiConversations.map((item) =>
        mapApiToConversationItem(item, onlineUsers, typeLabels)
    );

    const normalizedKeyword = searchKeyword.trim().toLowerCase();
    const trimmedKeyword = searchKeyword.trim();

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

    useEffect(() => {
        setQuickRoomError(null);
        setQuickRoomLoading(null);

        if (!isLoggedIn || !trimmedKeyword || filteredConversations.length > 0) {
            setSearchCheckStatus("idle");
            return;
        }

        let isCancelled = false;
        setSearchCheckStatus("checking");

        const timerId = window.setTimeout(async () => {
            try {
                const isSelf = Boolean(username && trimmedKeyword.toLowerCase() === username.toLowerCase());
                const userExists = isSelf ? false : await checkUserExist(trimmedKeyword);
                if (isCancelled) return;
                if (userExists) {
                    setSearchCheckStatus("user_found");
                    return;
                }

                try {
                    await joinRoom(trimmedKeyword);
                    await chatSocket.request("OUT_ROOM", { name: trimmedKeyword }).catch(() => {});
                    if (isCancelled) return;
                    setSearchCheckStatus("room_found");
                } catch {
                    if (isCancelled) return;
                    setSearchCheckStatus("not_found");
                }
            } catch {
                if (isCancelled) return;
                setSearchCheckStatus("not_found");
            }
        }, 350);

        return () => {
            isCancelled = true;
            window.clearTimeout(timerId);
        };
    }, [isLoggedIn, trimmedKeyword, filteredConversations.length, username]);

    const handleSelectSearchedUser = () => {
        if (!trimmedKeyword) return;
        dispatch(
            addConversation({
                name: trimmedKeyword,
                type: 0,
            })
        );
        setSearchKeyword("");
        if (activeFilter === "groups") {
            setActiveFilter("all");
        }
        void checkUserOnline(trimmedKeyword)
            .then((online) => {
                dispatch(setUserOnlineStatus({ name: trimmedKeyword, online }));
            })
            .catch(() => {});
    };

    const handleQuickRoomAction = async (mode: "join" | "create") => {
        if (!trimmedKeyword || quickRoomLoading) return;
        try {
            setQuickRoomLoading(mode);
            setQuickRoomError(null);
            await handleRoomSubmit(trimmedKeyword, mode);
        } catch (err) {
            const rawMessage = err instanceof Error ? err.message : "";
            setQuickRoomError(formatRoomModalError(rawMessage, mode));
        } finally {
            setQuickRoomLoading(null);
        }
    };

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

    const handleRoomSubmit = async (targetName: string, mode: RoomModalMode) => {
        if (mode === "direct") {
            if (username && targetName.toLowerCase() === username.toLowerCase()) {
                throw new Error("SELF_CHAT");
            }
            const exists = await checkUserExist(targetName);
            if (!exists) {
                throw new Error("USER_NOT_FOUND");
            }
            dispatch(
                addConversation({
                    name: targetName,
                    type: 0,
                })
            );
            setSearchKeyword("");
            if (activeFilter === "groups") {
                setActiveFilter("all");
            }
            void checkUserOnline(targetName)
                .then((online) => {
                    dispatch(setUserOnlineStatus({ name: targetName, online }));
                })
                .catch(() => {});
            return;
        }

        const roomData =
            mode === "join" ? await joinRoom(targetName) : await createRoom(targetName);
        const finalRoomName = roomData.name || targetName;
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

    const formatRoomModalError = (rawMessage: string, mode: RoomModalMode) => {
        if (mode === "direct") {
            if (rawMessage === "SELF_CHAT") {
                return t("conversation.roomModal.errorSelfChat");
            }
            if (rawMessage === "USER_NOT_FOUND") {
                return t("conversation.roomModal.errorUserNotFound");
            }
            return rawMessage || t("conversation.roomModal.errorDirectDefault");
        }

        const normalized = rawMessage.toLowerCase();
        if (mode === "create" && normalized.includes("exist")) {
            return t("conversation.roomModal.errorExist");
        }
        if (mode === "join" && (normalized.includes("not found") || normalized.includes("not exist"))) {
            return t("conversation.roomModal.errorNotFound");
        }
        return (
            rawMessage || t(mode === "join" ? "conversation.roomModal.errorJoinDefault" : "conversation.roomModal.errorCreateDefault")
        );
    };


    return (
        <aside className="conversation-list" aria-label="Danh sách hội thoại">
            <div className="conversation-list__top">
                <div className="conversation-list__header">
                    <h2>{username ? t("conversation.title.greeting", { username }) : t("conversation.title.messages")}</h2>
                    <button type="button" className="conversation-list__compose-btn"
                            onClick={() => setIsRoomModalOpen(true)}
                            disabled={!isLoggedIn}
                            aria-label={t("conversation.actions.openRoomModal")}
                            title={t("conversation.actions.openRoomModal")}>
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
                    {CONVERSATION_FILTERS.map((filterKey) => (
                        <button key={filterKey} type="button" className={`conversation-list__chip ${activeFilter === filterKey ? "conversation-list__chip--active" : ""}`}
                            onClick={() => setActiveFilter(filterKey)}>
                            {t(`conversation.filter.${filterKey}`)}
                        </button>
                    ))}
                </div>
            </div>

            <ul className="conversation-list__items">
                {!isLoggedIn && (<li style={{padding: "16px", textAlign: "center", color: "var(--color-danger, red)"}}>Đăng nhập trước.</li>)}

                {isLoggedIn && loading && (<li style={{padding: "16px", textAlign: "center", color: "var(--color-secondary-text)"}}>Đang tải danh sách...</li>)}

                {isLoggedIn && !loading && error && (<li style={{padding: "16px", textAlign: "center", color: "var(--color-danger, red)"}}>Lỗi: {error}</li>)}

                {isLoggedIn && !loading && !error && conversationItems.length === 0 && !trimmedKeyword
                    && (<li style={{padding: "16px", textAlign: "center", color: "var(--color-secondary-text)"}}>Không có cuộc trò chuyện nào.</li>)}

                {isLoggedIn && !loading && !error && trimmedKeyword !== "" && filteredConversations.length === 0 && searchCheckStatus === "checking" && (
                    <li style={{ padding: "16px", textAlign: "center", color: "var(--color-secondary-text)" }}>
                        {t("conversation.roomModal.checkingUser")}
                    </li>
                )}

                {isLoggedIn && !loading && !error && trimmedKeyword !== "" && filteredConversations.length === 0 && searchCheckStatus === "user_found" && (
                    <li>
                        <div className="conversation-list__item conversation-list__item--quick-room">
                            <div className="conversation-list__avatar conversation-list__avatar--primary">
                                <span>{getInitials(trimmedKeyword)}</span>
                            </div>
                            <div className="conversation-list__text">
                                <span className="conversation-list__name conversation-list__name--bold">{trimmedKeyword}</span>
                                <span className="conversation-list__last">{typeLabels.direct}</span>
                            </div>
                            <div className="conversation-list__quick-actions">
                                <button type="button" className="conversation-list__quick-btn conversation-list__quick-btn--primary" onClick={handleSelectSearchedUser}>
                                    {t("conversation.roomModal.directSubmit")}
                                </button>
                            </div>
                        </div>
                    </li>
                )}

                {isLoggedIn && !loading && !error && trimmedKeyword !== "" && filteredConversations.length === 0 && (searchCheckStatus === "room_found" || searchCheckStatus === "not_found") && (
                    <li>
                        <div className="conversation-list__item conversation-list__item--quick-room">
                            <div className="conversation-list__avatar conversation-list__avatar--group">
                                <img className="conversation-list__avatar-icon" src={groupIcon} alt={trimmedKeyword} />
                            </div>
                            <div className="conversation-list__text">
                                <span className="conversation-list__name conversation-list__name--bold">{trimmedKeyword}</span>
                                <span className={quickRoomError ? "conversation-list__last conversation-list__last--error" : "conversation-list__last"}>
                                    {quickRoomError || typeLabels.group}
                                </span>
                            </div>
                            <div className="conversation-list__quick-actions">
                                {searchCheckStatus === "room_found" ? (
                                    <button type="button" className="conversation-list__quick-btn conversation-list__quick-btn--outline"
                                            onClick={() => void handleQuickRoomAction("join")} disabled={quickRoomLoading !== null}>
                                        {quickRoomLoading === "join" ? t("conversation.roomModal.joining") : t("conversation.roomModal.joinSubmit")}
                                    </button>
                                ) : (
                                    <button type="button" className="conversation-list__quick-btn conversation-list__quick-btn--primary"
                                            onClick={() => void handleQuickRoomAction("create")} disabled={quickRoomLoading !== null}>
                                        {quickRoomLoading === "create" ? t("conversation.roomModal.creating") : t("conversation.roomModal.createSubmit")}
                                    </button>
                                )}
                            </div>
                        </div>
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
            <RoomModal
                isOpen={isRoomModalOpen}
                title={t("conversation.roomModal.title")}
                tabDirectText={t("conversation.roomModal.tabDirect")}
                tabGroupText={t("conversation.roomModal.tabGroup")}
                directLabel={t("conversation.roomModal.directLabel")}
                directPlaceholder={t("conversation.roomModal.directPlaceholder")}
                directSubmitText={t("conversation.roomModal.directSubmit")}
                checkingUserText={t("conversation.roomModal.checkingUser")}
                directEmptyErrorText={t("conversation.roomModal.errorDirectEmpty")}
                label={t("conversation.roomModal.label")}
                placeholder={t("conversation.roomModal.placeholder")}
                cancelText={t("conversation.roomModal.cancel")}
                joinText={t("conversation.roomModal.joinSubmit")}
                joiningText={t("conversation.roomModal.joining")}
                createText={t("conversation.roomModal.createSubmit")}
                creatingText={t("conversation.roomModal.creating")}
                emptyErrorText={t("conversation.roomModal.errorEmpty")}
                onClose={() => setIsRoomModalOpen(false)}
                onSubmit={handleRoomSubmit}
                formatError={formatRoomModalError}
            />
        </aside>
    );
}

export default ConversationList
