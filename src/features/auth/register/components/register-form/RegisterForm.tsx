import AuthButton from "../../../components/AuthButton";
import AuthInput from "../../../components/AuthInput";
import { ROUTES } from "../../../../../app/router/routes";
import { useRegister } from "../../hooks/useRegister";
import PasswordInput from "../../../components/PasswordInput";
import AuthFooter from "../../../components/AuthFooter";

function RegisterForm() {
  const {
    username,
    setUsername,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    message,
    error,
    usernameValid,
    passwordValid,
    passwordsMatch,
    formValid,
    handleSubmit,
  } = useRegister();

  return (
    <>
        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          {error && <p className="auth-error" role="alert">{error}</p>}
          {message && <p className="auth-success" role="status">{message}</p>}
          <AuthInput
            id="register-username"
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
            name="password"
            label="Mật khẩu"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            placeholder="Nhập mật khẩu"
            valid={passwordValid}
            emptyMessage="Mật khẩu cần có ít nhất 6 ký tự."
            validMessage="Độ dài mật khẩu hợp lệ."
            invalidMessage={`Cần thêm ${6 - password.length} ký tự nữa.`}
          />
          <PasswordInput
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            value={confirmPassword}
            onChange={setConfirmPassword}
            autoComplete="new-password"
            placeholder="Nhập lại mật khẩu"
            valid={passwordsMatch}
            emptyMessage="Vui lòng nhập lại mật khẩu."
            validMessage="Mật khẩu khớp."
            invalidMessage="Mật khẩu không khớp."
          />

          <AuthButton
            disabled={!formValid}
            loading={loading}
            loadingText="Đang đăng ký..."
          >
            Đăng ký tài khoản
          </AuthButton>
        </form>

        <AuthFooter text="Đã có tài khoản?" linkText="Đăng nhập" to={ROUTES.LOGIN} />
    </>
  );
}

export default RegisterForm;
