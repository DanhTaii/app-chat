import AuthButton from "../../../components/AuthButton";
import AuthInput from "../../../components/AuthInput";
import { ROUTES } from "../../../../../app/router/routes";
import PasswordInput from "../../../components/PasswordInput";
import AuthFooter from "../../../components/AuthFooter";
import { useAuth } from "../../hooks/useAuth";

function LoginForm() {
  const {
    username,
    setUsername,
    password,
    setPassword,
    loading,
    response,
    error,
    usernameValid,
    passwordValid,
    formValid,
    handleSubmit,
  } = useAuth();

  return (
    <>
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <p className="auth-error" role="alert">{error}</p>}
        <AuthInput
          id="login-username"
          name="username"
          label="Tên người dùng"
          value={username}
          onChange={setUsername}
          placeholder="Nhập username (a-z, 0-9, _)"
          autoComplete="username"
          valid={usernameValid}
          emptyMessage="Tên người dùng gồm chữ, số và dấu gạch dưới."
          validMessage="Tên người dùng hợp lệ."
          invalidMessage="Chỉ được dùng chữ, số và dấu gạch dưới."
        />
        <PasswordInput
          id="login-password"
          name="password"
          label="Mật khẩu"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          placeholder="Nhập mật khẩu"
          valid={passwordValid}
          emptyMessage="Mật khẩu cần có ít nhất 6 ký tự."
          validMessage="Độ dài mật khẩu hợp lệ."
          invalidMessage={`Cần thêm ${6 - password.length} ký tự nữa.`}
        />


        <AuthButton
          disabled={!formValid}
          loading={loading}
          loadingText="Đang đăng nhập..."
        >
          Đăng nhập
        </AuthButton>
      </form>

      {response?.status === "success" && (
        <section aria-live="polite">
          <h2>{response.status === "success" ? "Đăng nhập thành công" : "Kết quả đăng nhập"}</h2>
          {response.mes && <p>{response.mes}</p>}
          <pre>{JSON.stringify(response.data)}</pre>
        </section>
      )}
      <AuthFooter text="Chưa có tài khoản?" linkText="Tạo tài khoản" to={ROUTES.REGISTER} />
    </>
  );
}

export default LoginForm;
