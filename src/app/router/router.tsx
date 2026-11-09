import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { ROUTES } from "./routes";
import LoginPage from "../../features/auth/pages/login-page";
import RegisterPage from "../../features/auth/pages/register-page";
import ChatPage from "../../features/chat/pages/chat-page";
import NotFoundPage from "../../shared/pages/not-found";
import ComponentsPage from "../../features/auth/pages/components-page";
import ErrorPage from "../../shared/pages/error-page";

export const router = createBrowserRouter([
  {
    path: ROUTES.ROOT,
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.LOGIN} replace />,
      },
      {
        path: ROUTES.LOGIN,
        element: <LoginPage />,
      },
      {
        path: ROUTES.REGISTER,
        element: <RegisterPage />,
      },
      {
        path: ROUTES.CHAT,
        element: <ChatPage />,
      },
      {
        path: ROUTES.COMPONENTS,
        element: <ComponentsPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
