
import AuthHeader from "../../components/auth-header/AuthHeader";
import LoginForm from "./login-form/LoginForm";

function Auth() {
  return (
    <div className="auth-panel">
      <AuthHeader>
        <h3 id="login-title">Đăng nhập</h3>
      </AuthHeader>
      <section className="login-card" aria-labelledby="login-title">
        <LoginForm />
      </section>
    </div>
  );
}

export default Auth;
