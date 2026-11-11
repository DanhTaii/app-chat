import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../../shared/components/Button";
import Input from "../../../shared/components/Input";
import { ROUTES } from "../../../app/router/routes";
import brandIcon from "../../../shared/assets/logo.png";
import {
  isValidPassword,
  isValidUsername,
} from "../../../shared/utils/validators";
import "./login-page.scss";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const usernameValid = isValidUsername(username);
  const passwordValid = isValidPassword(password);
  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;
  const formValid = usernameValid && passwordValid && passwordsMatch;

  return (
    <div className="login-page">
      <div className="auth-panel">
        <header className="auth-heading">
          <img className="auth-brand-icon" src={brandIcon} alt="" />
          <h3 id="register-title" className="register-title">Đăng ký</h3>
        </header>
        <section className="login-card" aria-labelledby="register-title">

        <form
          className="login-form"
          onSubmit={(event) => event.preventDefault()}
        >
          <label>
            <label className="input-title">Tên người dùng</label>
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

          <label className="login-form__password-label">
            <label className="input-title">Mật khẩu</label>
            <span className="login-form__password-field">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
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
          </label>

          <label className="login-form__password-label">
            <label className="input-title">Xác nhận mật khẩu</label>
            <span className="login-form__password-field">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                aria-invalid={confirmPassword.length > 0 && !passwordsMatch}
                placeholder="Nhập lại mật khẩu"
                required
              />
              <button className="login-form__password-toggle" type="button" onClick={() => setShowConfirmPassword((shown) => !shown)} aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"} aria-pressed={showConfirmPassword}>
                {showConfirmPassword ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.2A10.8 10.8 0 0 1 12 5c5 0 8.5 4.5 9.5 7-.4 1-1.2 2.1-2.3 3.2M6.2 6.2C3.9 7.7 2.8 9.7 2.5 12c1 2.5 4.5 7 9.5 7 1.3 0 2.5-.3 3.6-.8" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                )}
              </button>
            </span>
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

        <p className="register-login-link">
          Đã có tài khoản? <Link to={ROUTES.LOGIN}>Đăng nhập</Link>
        </p>
        </section>
      </div>
    </div>
  );
}

export default RegisterPage;
