import { useState, type FormEvent } from "react";
import Button from "../../../shared/components/Button";
import Input from "../../../shared/components/Input";
import {
  isValidPassword,
  isValidUsername,
  validateAuth,
} from "../../../shared/utils/validators";

function Auth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const authError = validateAuth(username, password);
  const usernameValid = isValidUsername(username);
  const passwordValid = isValidPassword(password);
  const formValid = authError.length === 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formValid) return;
  };

  return (
    <section className="login-card">
      <h1>Đăng nhập</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <label>
          Tên người dùng
          <Input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            aria-invalid={username.length > 0 && !usernameValid}
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
                : "Cảnh báo: Chỉ có chữ, số, và gạch dưới mới được phép"}
          </span>
        </label>
        <label>
          Mật khẩu
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            aria-invalid={password.length > 0 && !passwordValid}
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
          disabled={!formValid}
        >
          Đăng nhập
        </Button>
      </form>
    </section>
  );
}

export default Auth;
