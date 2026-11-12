import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../shared/components/button";
import Input from "../../../shared/components/Input";
import { ROUTES } from "../../../app/router/routes";
import { useAppDispatch } from "../../../app/store/hooks";
import chatSocket, { type SocketResponse } from "../../../shared/services/socket/socketService";
import { loginSuccess } from "../slices/authSlice";
import { login } from "../services/authApi";
import { saveSession } from "../services/authSession";
import brandIcon from "../../../shared/assets/logo.png";
import {
  isValidPassword,
  isValidUsername,
  validateAuth,
} from "../../../shared/utils/validators";

function Auth() {

  // 2 ô input
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

      const result = await login({user: username, pass: password});
      console.log("Phản hồi login:", result);

      setResponse(result);

      if (result.status === "success") {
        const reLoginCode = result.data?.RE_LOGIN_CODE ?? null;
        if (reLoginCode) saveSession(username, reLoginCode);
        dispatch(loginSuccess({username, reLoginCode}));
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
    <div className="auth-panel">
      <header className="auth-heading">
        <img className="auth-brand-icon" src={brandIcon} alt="" />
        <h3 id="login-title">Đăng nhập</h3>
      </header>
      <section className="login-card" aria-labelledby="login-title">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-form__field">
          <label className="input-title" htmlFor="login-username">Tên người dùng</label>
          <Input
            type="text"
            id="login-username"
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
        </div>
        <div className="login-form__field login-form__password-label">
          <label className="input-title" htmlFor="login-password">Mật khẩu</label>
          <span className="login-form__password-field">
            <Input
              type={showPassword ? "text" : "password"}
              id="login-password"
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              aria-invalid={password.length > 0 && !passwordValid}
              placeholder="Nhập mật khẩu"
              required
            />
            <button className="login-form__password-toggle" type="button" onClick={() => setShowPassword((shown) => !shown)} aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"} aria-pressed={showPassword}>
              {showPassword ? (
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.2A10.8 10.8 0 0 1 12 5c5 0 8.5 4.5 9.5 7-.4 1-1.2 2.1-2.3 3.2M6.2 6.2C3.9 7.7 2.8 9.7 2.5 12c1 2.5 4.5 7 9.5 7 1.3 0 2.5-.3 3.6-.8" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" /><circle cx="12" cy="12" r="3" /></svg>
              )}
            </button>
          </span>
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
        </div>
        <label className="login-form__remember">
          <Input type="checkbox" name="remember" />
          <span>Ghi nhớ đăng nhập</span>
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
    </div>
  );
}

export default Auth;
