import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../shared/components/Button";
import Input from "../../../shared/components/Input";
import { ROUTES } from "../../../app/router/routes";
import { useAppDispatch } from "../../../app/store/hooks";
import chatSocket, { type SocketResponse } from "../../../shared/services/socket/socketService";
import { loginSuccess } from "../slices/authSlice";
import {
  isValidPassword,
  isValidUsername,
  validateAuth,
} from "../../../shared/utils/validators";

function Auth() {

  // 2 ô input
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // loading
  const [loading, setLoading] = useState(false);

  // response 
  const [response, setResponse] = useState<SocketResponse | null>(null);

  // lỗi
  const [error, setError] = useState<string | null>(null);

  // check ô input
  const authError = validateAuth(username, password);
  const usernameValid = isValidUsername(username);
  const passwordValid = isValidPassword(password);
  const formValid = authError.length === 0;

  // hàm dispatch
  const dispatch = useAppDispatch();
  const navigate = useNavigate();


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formValid || loading) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      console.log("Nút bật");

      await chatSocket.connect();
      console.log("websocket kết nối");

      const result = await chatSocket.request("LOGIN", {
        user: username,
        pass: password,
      });
      console.log("Phản hồi login:", result);

      setResponse(result);

      if (result.status === "success") {
        dispatch(loginSuccess({ username }));
        navigate(ROUTES.CHAT);
      } else {
        setError(result.mes || "Lỗi");
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "ko vào đc.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-card" aria-labelledby="login-title">
      <h1 id="login-title">Đăng nhập</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <label>
          Tên người dùng
          <Input
            type="text"
            name="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            aria-invalid={username.length > 0 && !usernameValid}
            placeholder="Nhập username (a-z, 0-9, _)"
            required
          />
          <span
            className={`login-form__status ${usernameValid ? "is-valid" : "is-invalid"}`}
            role="status"
          >
            {username.length === 0
              ? "Tên người dùng bao gồm chữ, số, và gạch dưới."
              : usernameValid
                ? "Tên người dùng hợp lệ."
                : "Cảnh báo: Chỉ có chữ, số, và gạch dưới mới được phép."}
          </span>
        </label>
        <label>
          Mật khẩu
          <Input
            type="password"
            name="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            aria-invalid={password.length > 0 && !passwordValid}
            placeholder="Nhập mật khẩu"
            required
          />
          <span
            className={`login-form__status ${passwordValid ? "is-valid" : "is-invalid"}`}
            role="status"
          >
            {password.length === 0
              ? "Mật khẩu phải có ít nhất 6 ký tự."
              : passwordValid
                ? "Độ dài mật khẩu hợp lệ."
                : `Thêm ${6 - password.length} ký tự nữa.`}
          </span>
        </label>
        <Button
          variant="primary"
          className="login-form__submit"
          type="submit"
          disabled={!formValid || loading}
        >
          {loading ? "Đang đăng nhập…" : "Đăng nhập"}
        </Button>
      </form>

      {error && <p role="alert">{error}</p>}
      {response && (
        <section aria-live="polite">
          <h2>{response.status === "success" ? "Đăng nhập thành công" : "Kết quả đăng nhập"}</h2>
          {response.mes && <p>{response.mes}</p>}
          <pre>{JSON.stringify(response.data)}</pre>
        </section>
      )}
    </section>
  );
}

export default Auth;
