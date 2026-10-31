import "./login-page.scss";
import Button from "../../../shared/components/ui/Button";
import Input from "../../../shared/components/ui/Input";

// Wireframe trang đăng nhập
function LoginPage() {
  return (
    <div className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <h1 id="login-title">Đăng nhập</h1>
        <p className="login-card__hint">
          Vui lòng nhập thông tin tài khoản của bạn.
        </p>

        <form className="login-form" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="identifier">Email hoặc tên người dùng</label>
          <Input
            id="identifier"
            name="identifier"
            type="text"
            autoComplete="username"
            placeholder="name@example.edu.vn"
          />

          <label htmlFor="password">Mật khẩu</label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Nhập mật khẩu"
          />

          <label className="login-form__remember">
            <Input type="checkbox" name="remember" />
            Ghi nhớ đăng nhập
          </label>

          <Button type="submit">Đăng nhập</Button>
        </form>
      </section>
    </div>
  );
}

export default LoginPage;
