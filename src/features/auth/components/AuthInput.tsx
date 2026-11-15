import type { ChangeEvent } from "react";
import Input from "../../../shared/components/Input";

interface AuthInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoComplete: string;
  valid: boolean;
  emptyMessage: string;
  validMessage: string;
  invalidMessage: string;
}

function AuthInput({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  valid,
  emptyMessage,
  validMessage,
  invalidMessage,
}: AuthInputProps) {
  const message = value.length === 0 ? emptyMessage : valid ? validMessage : invalidMessage;

  return (
    <div className="auth-form__field">
      <label className="auth-input__title" htmlFor={id}>{label}</label>
      <Input
        type="text"
        id={id}
        name={name}
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        autoComplete={autoComplete}
        aria-invalid={value.length > 0 && !valid}
        placeholder={placeholder}
        required
      />
      <span className={`auth-form__status ${valid ? "is-valid" : "is-invalid"}`} role="status">
        {message}
      </span>
    </div>
  );
}

export default AuthInput;
