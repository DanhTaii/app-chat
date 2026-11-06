import type { ButtonHTMLAttributes } from "react";
import "./button.scss";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "link";
};

function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return <button className={`btn-${variant} ${className}`.trim()} {...props} />;
}

export default Button;
