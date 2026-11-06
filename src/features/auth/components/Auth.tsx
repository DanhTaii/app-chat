import { useState, type FormEvent } from "react";
import Button from "../../../shared/components/Button";
import Input from "../../../shared/components/Input";

function Auth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <section className="login-card">
      <h1>Đăng nhập</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <label>
          Tên người dùng
          <Input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label>
          Mật khẩu
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        <Button
          variant="primary"
          className="login-form__submit"
          type="submit"
          disabled
        >
          Đăng nhập
        </Button>
      </form>
    </section>
  );
}

export default Auth;
