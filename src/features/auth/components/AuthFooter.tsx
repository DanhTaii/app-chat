import { Link } from "react-router-dom";

interface AuthFooterProps {
  text: string;
  linkText: string;
  to: string;
}

function AuthFooter({ text, linkText, to }: AuthFooterProps) {
  return (
    <p className="auth-footer">
      {text} <Link to={to}>{linkText}</Link>
    </p>
  );
}

export default AuthFooter;
