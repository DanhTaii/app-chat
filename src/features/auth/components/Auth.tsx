import { useState, type FormEvent } from "react";

function Auth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <section>
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Tên đăng nhập
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label>
          Mật khẩu
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        <button type="submit" disabled>
          Đăng nhập
        </button>
      </form>
    </section>
  );
}

export default Auth;
