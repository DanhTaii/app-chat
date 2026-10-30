import { createBrowserRouter, Navigate } from 'react-router'
import MainLayout from '../shared/components/layout/main-layout'
import { ROUTES } from '../shared/constants/routes'
import LoginPage from '../features/auth/pages/login-page'
import ChatPage from '../features/chat/pages/chat-page'
import NotFoundPage from '../features/auth/pages/not-found-page'

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: ROUTES.ROOT, element: <Navigate to={ROUTES.LOGIN} replace /> },
      { path: ROUTES.LOGIN, element: <LoginPage /> },
      { path: ROUTES.CHAT, element: <ChatPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
