import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../../app/router/routes";
import { useAppDispatch } from "../../../../app/store/hooks";
import chatSocket, { type SocketResponse } from "../../../../shared/services/socket/socketService";
import {
  isValidPassword,
  isValidUsername,
  validateAuth,
} from "../../../../shared/utils/validators";
import { loginSuccess } from "../../store/authSlice";
import { login } from "../api/loginApi";
import { saveSession } from "../../session/services/authSession";

export function useAuth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<SocketResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const authError = validateAuth(username, password);
  const usernameValid = isValidUsername(username);
  const passwordValid = isValidPassword(password);
  const formValid = authError.length === 0;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formValid || loading) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      console.log("Nut bat");

      await chatSocket.connect();
      console.log("websocket ket noi");

      const result = await login({user: username, pass: password});
      console.log("ket qua login: ", result);

      setResponse(result);

      if (result.status === "success") {
        const reLoginCode = result.data?.RE_LOGIN_CODE ?? null;
        if (reLoginCode) saveSession(username, reLoginCode);
        dispatch(loginSuccess({username, reLoginCode}));
        navigate(ROUTES.CHAT);
      } else {
        setError(result.mes || "Loi");
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "ko vao dc.",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    loading,
    response,
    error,
    usernameValid,
    passwordValid,
    formValid,
    handleSubmit,
  };
}
