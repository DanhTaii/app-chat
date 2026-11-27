import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { useAppDispatch } from "./store/hooks";
import { router } from "./router/router";
import chatSocket from "../shared/services/socket/socketService";
import { reLogin } from "../features/auth/session/api/sessionApi";
import {checkAndGetSession,clearSession,saveSession} from "../features/auth/session/services/authSession";
import { loginSuccess } from "../features/auth/store/authSlice";
import type { User } from "../features/auth/types";

let restoreSessionRequest: Promise<User | null> | null = null;

// ham nay de khoi phuc session khi relogin
function restoreSession() {

    // ko co yeu cau
    if (restoreSessionRequest === null) {

        // tao moi promise
        restoreSessionRequest = (async () => {

            // check va lay session to local storage
            const session = checkAndGetSession();

            // ko co session thi thoi
            if (!session) {
                return null;
            }

            // Kiểm tra xem là có trong đường dẫn VideoCall không?
            // Nếu như đang ở trong đó thì sẽ dừng hàm và trả veef lun thông tin trong session
            // do lúc mở tab mới nó thực hiện chạy toàn bộ code ở dưới như vậy thì web socket sẽ renew lại
            if (window.location.pathname.startsWith("/video-call/")) {
                return {
                    username: session.username,
                    reLoginCode: session.reLoginCode,
                };
            }

            // co thi connect websocket
            try {
                await chatSocket.connect();

                // send request relogin 
                const result = await reLogin({
                    user: session.username,
                    code: session.reLoginCode
                });

                // neu failed thi stop o day
                if (result.status !== "success") {
                    throw new Error("RE_LOGIN thất bại");
                }

                // ok thi move on
                // lay code relogin mới
                let reLoginCode = session.reLoginCode;
                if (result.data && result.data.RE_LOGIN_CODE) {
                  reLoginCode = result.data.RE_LOGIN_CODE;
                }

                // luu session moi
                saveSession(session.username, reLoginCode);

                // return user infor
                return {
                    username: session.username,
                    reLoginCode: reLoginCode
                };

            } catch (error) {

                console.error("Restore session error:", error);
                clearSession();

                chatSocket.disconnect();

                return null;
            }

        })();
    }

    return restoreSessionRequest;
}

function App() {
    const dispatch = useAppDispatch();

    // kiem tra restore session xong chua moi chuyen route page
    const [ready, setReady] = useState(false);

    useEffect(() => {

        let active = true;

        restoreSession().then((user) => {

            if (!active) {
                return;
            }

            // restore r thi cap nhat redux
            if (user) {
                dispatch(loginSuccess(user));
            }

            setReady(true);
        });

        return () => {
            active = false;
        };

    }, [dispatch]);

    if (!ready) {
        return null;
    }

    return <RouterProvider router={router} />;
}

export default App;
