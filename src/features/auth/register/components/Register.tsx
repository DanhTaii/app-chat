import AuthLayout from "../../components/AuthLayout";
import RegisterForm from "./register-form/RegisterForm";

function Register() {
  return (
    <AuthLayout
      title="Đăng ký"
      description="Tạo tài khoản mới để bắt đầu"
    >
      <RegisterForm />
    </AuthLayout>
  );
}

export default Register;
