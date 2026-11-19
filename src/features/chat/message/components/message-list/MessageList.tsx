import './MessageList.scss'
import {useTranslation} from "react-i18next";
import type {Message} from "@/features/chat/message/types.ts";
import {useEffect, useRef} from "react";
import {useMessage} from "@/features/chat/message/hooks/useMessage.ts";
import type {UploadedMedia} from "@/features/chat/message/types.ts";
import MessageMedia from "@/features/chat/message/components/message-media/MessageMedia.tsx";

type MessageGroup = {
    isSender: boolean,
    senderName: string
    messages: Message[]
}

function getCloudinaryMedia(message: string): UploadedMedia | null {
    try {
        const mediaUrl = new URL(message);
        const segments = mediaUrl.pathname.split("/").filter(Boolean);

        if (mediaUrl.hostname !== "res.cloudinary.com" || segments[2] !== "upload") {
            return null;
        }

        const kind = segments[1];
        if (kind !== "image" && kind !== "video") return null;

        const name = segments.at(-1) || `noname.pic`;
        const format = name.includes(".") ? name.split(".").pop() || "" : "";
        return {url: mediaUrl.toString(), kind, name, format};
    } catch {
        return null;
    }
}

// @ts-ignore
export default function MessageList({receiverName, user, conversationType}: {
    receiverName: string;
    user: {username: string} | null;
    conversationType: number;
}) {
    // 1 là room chat |
    // 0 là people chat

    const {conversations} = useMessage(receiverName, 1, conversationType);
    const listMsg = conversations.messages ?? []

    // ============== XỬ LÝ DANH SÁCH TIN NHẮN NHẬN TỪ API ==============
    const groupedMessages: MessageGroup[] = [];
    // ĐẢO NGƯỢC LẠI DO DANH SÁCH TIN NHẮN LÀ MỚI Ở TRÊN ĐẦU CÒN CŨ Ở DƯỚI
    [...listMsg].reverse().forEach((msg) => {
        let isSender = msg.name === user?.username;
        let senderName = msg.name;
        let lastGroup = groupedMessages[groupedMessages.length - 1]

        if (lastGroup && lastGroup.senderName === senderName) {
            lastGroup.messages.push(msg);
        } else {
            groupedMessages.push({
                isSender: isSender,
                senderName: senderName,
                messages: [msg]
            });
        }
    })

    // console.log("MSG LISTTTTT group: ",groupedMessages);

    // ============== XỬ LÝ ĐA NGÔN NGỮ ==============
    const {t} = useTranslation("message");

    // XỬ LÝ TỰ ĐỘNG CUỘN XUỐNG DƯỚI
    const listRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const list = listRef.current;

        if (list && listMsg.length > 0) {
            list.scrollTop = list.scrollHeight;
        }
    }, [listMsg]);

    return (
        <div ref={listRef} className={"message-list"}>
            <div className={"time-separator"}>
                <i className="fa-solid fa-calendar"></i>
                {t("message.separator.time.today")}, 24/10
            </div>

            {
                groupedMessages.map((group, index) => (
                        <div key={index} className={group.isSender ? "sender-msg__block" : "receiver-msg__block"}>
                            {/*HIỂN THIJ ẢNH NẾU NHƯ KHÔNG PHẢI LÀ NGƯỜI NHẬN*/}
                            {
                                !group.isSender && (
                                    <div className={"receiver-msg__avatar"}>
                                        <img className={"img-avatar"} src="/src/shared/assets/avatar.webp"/>
                                    </div>
                                )
                            }

                            <ul className={group.isSender ? "sender-msg__list-content" : "receiver-msg__list-content"}>
                                {
                                    conversationType === 1 && (
                                        <li className={"receiver-msg__name"}>
                                            <div className={"receiver-msg__name"}>
                                                {group.messages[0].name}
                                            </div>
                                        </li>
                                    )
                                }
                                {
                                    group.messages.map((msg, index) => {
                                        const media = getCloudinaryMedia(msg.mes);
                                        return (
                                            <li key={index} className={media ? "message-media-message" : undefined}>
                                                {media ? (<MessageMedia media={media}/>) : (
                                                    <div className={group.isSender ? "sender-msg__content" : "receiver-msg__content"}>
                                                        {msg.mes}
                                                    </div>
                                                )}
                                                {index === group.messages.length - 1 && (
                                                    <div className="msg-time">12:00</div>
                                                )}
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                        </div>
                    )
                )
            }
        </div>
    )
}
