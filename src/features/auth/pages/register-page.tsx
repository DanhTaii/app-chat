import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../../shared/components/Button";
import Input from "../../../shared/components/Input";
import { ROUTES } from "../../../app/router/routes";
import {
  isValidPassword,
  isValidUsername,
} from "../../../shared/utils/validators";
import "./login-page.scss";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const usernameValid = isValidUsername(username);
  const passwordValid = isValidPassword(password);
  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;
  const formValid = usernameValid && passwordValid && passwordsMatch;

  return (
    <div className="login-page">
      <section className="login-card" aria-labelledby="register-title">
        <h1 id="register-title">Đăng ký</h1>

        <form
          className="login-form"
          onSubmit={(event) => event.preventDefault()}
        >
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
              autoComplete="new-password"
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

          <label>
            Xác nhận mật khẩu
            <Input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              aria-invalid={confirmPassword.length > 0 && !passwordsMatch}
              placeholder="Nhập lại mật khẩu"
              required
            />
            <span
              className={`login-form__status ${passwordsMatch ? "is-valid" : "is-invalid"}`}
              role="status"
            >
              {confirmPassword.length === 0
                ? "Vui lòng nhập lại mật khẩu."
                : passwordsMatch
                  ? "Mật khẩu khớp."
                  : "Mật khẩu không khớp."}
            </span>
          </label>

          <Button
            variant="primary"
            className="login-form__submit"
            type="submit"
            disabled={!formValid}
          >
            Đăng ký tài khoản
          </Button>
        </form>

        <p>
          Đã có tài khoản <Link to={ROUTES.LOGIN}>Đăng nhập</Link>
        </p>
      </section>
    </div>
  );
}

export default RegisterPage;
