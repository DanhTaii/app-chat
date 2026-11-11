import './MessageList.scss'
import {useTranslation} from "react-i18next";
import type {Message} from "@/features/chat/message/types.ts";
import {useEffect, useRef} from "react";

type MessageGroup = {
    isSender: boolean,
    messages: Message[]
}

// @ts-ignore
export default function MessageList({listMsg, user}) {
    // ============== XỬ LÝ DANH SÁCH TIN NHẮN NHẬN TỪ API ==============
    const groupedMessages: MessageGroup[] = [];
    // ĐẢO NGƯỢC LẠI DO DANH SÁCH TIN NHẮN LÀ MỚI Ở TRÊN ĐẦU CÒN CŨ Ở DƯỚI
    [...listMsg].reverse().forEach((msg) => {
        let isSender = msg.name === user?.username;
        let lastGroup = groupedMessages[groupedMessages.length - 1]
        // console.log(lastGroup)

        if (lastGroup && lastGroup.isSender === isSender) {
            lastGroup.messages.push(msg);
        } else {
            groupedMessages.push({
                isSender: isSender,
                messages: [msg]
            });
        }
    })

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
                                {/*{*/}
                                {/*    !group.isSender && (*/}
                                {/*        <li className={"receiver-msg__name"}>*/}
                                {/*            <div className={"receiver-msg__name"}>*/}
                                {/*                {group.messages[0].name}*/}
                                {/*            </div>*/}
                                {/*        </li>*/}
                                {/*    )*/}
                                {/*}*/}
                                {
                                    group.messages.map((msg, index) => (
                                        <li key={msg.id}>
                                            <div className={
                                                     group.isSender ? "sender-msg__content" : "receiver-msg__content"
                                                 }>
                                                {msg.mes}
                                            </div>
                                            {
                                                index === group.messages.length - 1 && (
                                                    <div className="msg-time">
                                                        12:00
                                                    </div>
                                                )
                                            }
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    )
                )
            }
        </div>
    )
}