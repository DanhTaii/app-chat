import AuthHeader from "../../components/auth-header/AuthHeader";
import RegisterForm from "../components/register-form/RegisterForm";
import "../../login/pages/login-page.scss";

function RegisterPage() {
  return (
    <div className="login-page">
      <div className="auth-panel">
        <AuthHeader>
          <h3 id="register-title" className="register-title">Đăng ký</h3>
        </AuthHeader>
        <section className="login-card" aria-labelledby="register-title">

          <RegisterForm />
        </section>
      </div>
    </div>
  );
}

export default RegisterPage;
