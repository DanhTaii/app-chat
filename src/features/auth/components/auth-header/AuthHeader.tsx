import type { ReactNode } from "react";
import brandIcon from "../../../../shared/assets/logo.png";

type AuthHeaderProps = {
  children: ReactNode;
};

function AuthHeader({ children }: AuthHeaderProps) {
  return (
    <header className="auth-heading">
      <img className="auth-brand-icon" src={brandIcon} alt="" />
      {children}
    </header>
  );
}

export default AuthHeader;
