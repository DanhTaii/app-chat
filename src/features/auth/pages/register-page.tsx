import { Link } from "react-router-dom";
import Button from "../../../shared/components/Button";
import Input from "../../../shared/components/Input";
import { ROUTES } from "../../../app/router/routes";
import "./login-page.scss";

function RegisterPage() {
  return (
    <div className="login-page">
      <section className="login-card" aria-labelledby="register-title">
        <h1 id="register-title">Đăng ký</h1>

        <form className="login-form">
          <label>
            Tên người dùng
            <Input
              type="text"
              name="username"
              autoComplete="username"
              placeholder="Nhập username (a-z, 0-9, _)"
            />
          </label>

          <label>
            Mật khẩu
            <Input
              type="password"
              name="password"
              autoComplete="new-password"
              placeholder="Nhập mật khẩu"
            />
          </label>

          <label>
            Xác nhận mật khẩu
            <Input
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Nhập lại mật khẩu"
            />
          </label>

          <Button
            variant="primary"
            className="login-form__submit"
            type="button"
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
