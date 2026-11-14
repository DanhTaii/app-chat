import { useState, type FormEvent } from "react";
import {
  isValidPassword,
  isValidUsername,
} from "../../../../shared/utils/validators";
import chatSocket from "../../../../shared/services/socket/socketService";
import { register } from "../api/registerApi";

export function useRegister() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const usernameValid = isValidUsername(username);
  const passwordValid = isValidPassword(password);
  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;
  const formValid = usernameValid && passwordValid && passwordsMatch;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formValid || loading) return;

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      await chatSocket.connect();
      const response = await register({ user: username, pass: password });
      setMessage(response.data || "Tạo tài khoản đc!");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Đăng ký fail rùi");
    } finally {
      setLoading(false);
    }
  };
  return {
    username,
    setUsername,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    loading,
    message,
    error,
    usernameValid,
    passwordValid,
    passwordsMatch,
    formValid,
    handleSubmit,
  };
}
