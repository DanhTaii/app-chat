import {createBrowserRouter, Navigate} from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import {ROUTES} from "./routes";
import LoginPage from "../../features/auth/pages/login-page";
import RegisterPage from "../../features/auth/pages/register-page";
import ChatPage from "../../features/chat/pages/chat-page";
import NotFoundPage from "../../shared/pages/not-found";
import ErrorPage from "../../shared/pages/error-page";

import {useAppSelector} from "../store/hooks";
import VideoCall from "@/features/chat/video-call/components/VideoCall.tsx";


export const router = createBrowserRouter([
    {
        path: ROUTES.ROOT,
        element: <MainLayout/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                index: true,
                element: <Navigate to={ROUTES.LOGIN} replace/>,
            },
            {
                path: ROUTES.LOGIN,
                element: <LoginCheckingPage/>,
            },
            {
                path: ROUTES.REGISTER,
                element: <RegisterPage/>,
            },
            {
                path: ROUTES.CHAT,
                element: <ReloginCheckingPage/>,
            },
            {
                path: ROUTES.VIDEO_CALL,
                element: <VideoCall/>,
            },
            {
                path: "*",
                element: <NotFoundPage/>,
            },
        ],
    },
]);

function ReloginCheckingPage() {
    const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
    return isLoggedIn ? <ChatPage/> : <Navigate to={ROUTES.LOGIN} replace/>;
}

function LoginCheckingPage() {
    const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
    return isLoggedIn ? <Navigate to={ROUTES.CHAT} replace/> : <LoginPage/>;
}
