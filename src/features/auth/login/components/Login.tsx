import AuthLayout from "../../components/AuthLayout";
import LoginForm from "./login-form/LoginForm";

function Login() {
  return (
    <AuthLayout
      title="Đăng nhập"
      description="Vui lòng nhập thông tin tài khoản"
    >
      <LoginForm />
    </AuthLayout>
  );
}

export default Login;
