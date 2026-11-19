import type { ReactNode } from "react";
import Button from "../../../shared/components/Button";

interface AuthButtonProps {
  children: ReactNode;
  loadingText: string;
  loading: boolean;
  disabled: boolean;
}

function AuthButton({ children, loadingText, loading, disabled }: AuthButtonProps) {
  return (
    <Button
      variant="primary"
      className="btn"
      type="submit"
      disabled={disabled || loading}
    >
      {loading ? loadingText : children}
    </Button>
  );
}

export default AuthButton;
