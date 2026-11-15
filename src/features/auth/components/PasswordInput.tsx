import { useState, type ChangeEvent } from "react";
import Input from "../../../shared/components/Input";

interface PasswordInputProps {
  id?: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  placeholder: string;
  valid: boolean;
  emptyMessage: string;
  validMessage: string;
  invalidMessage: string;
}

function PasswordInput({
  id,
  name,
  label,
  value,
  onChange,
  autoComplete,
  placeholder,
  valid,
  emptyMessage,
  validMessage,
  invalidMessage,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id ?? name;
  const message = value.length === 0 ? emptyMessage : valid ? validMessage : invalidMessage;

  return (
    <div className="auth-form__field">
      <label className="auth-input__title" htmlFor={inputId}>{label}</label>
      <span className="auth-form__password-field">
        <Input
          type={showPassword ? "text" : "password"}
          id={inputId}
          name={name}
          value={value}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
          autoComplete={autoComplete}
          aria-invalid={value.length > 0 && !valid}
          placeholder={placeholder}
          required
        />
        <button
          className="auth-form__password-toggle"
          type="button"
          onClick={() => setShowPassword((shown) => !shown)}
          aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          aria-pressed={showPassword}
        >
          {showPassword ? (
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.2A10.8 10.8 0 0 1 12 5c5 0 8.5 4.5 9.5 7-.4 1-1.2 2.1-2.3 3.2M6.2 6.2C3.9 7.7 2.8 9.7 2.5 12c1 2.5 4.5 7 9.5 7 1.3 0 2.5-.3 3.6-.8" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" /><circle cx="12" cy="12" r="3" /></svg>
          )}
        </button>
      </span>
      <span className={`auth-form__status ${valid ? "is-valid" : "is-invalid"}`} role="status">
        {message}
      </span>
    </div>
  );
}

export default PasswordInput;
