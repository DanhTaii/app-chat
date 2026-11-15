import type { ReactNode } from "react";
import AuthHeader from "./auth-header/AuthHeader";

interface AuthLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

function AuthLayout({ title, description, children }: AuthLayoutProps) {
  return (
    <div className="auth-page">
      <div className="auth-panel">
        <AuthHeader title={title} description={description} />
        <section className="auth-card" aria-labelledby="auth-title">
          {children}
        </section>
      </div>
    </div>
  );
}

export default AuthLayout;
