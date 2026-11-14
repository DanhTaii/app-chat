import AuthHeader from "../../components/auth-header/AuthHeader";
import RegisterForm from "./register-form/RegisterForm";

function Register() {
  return (
    <div className="auth-panel">
        <AuthHeader>
          <h3 id="register-title" className="register-title">Đăng ký</h3>
        </AuthHeader>
        <section className="login-card" aria-labelledby="register-title">
          <RegisterForm />
        </section>
    </div>
  );
}

export default Register;
