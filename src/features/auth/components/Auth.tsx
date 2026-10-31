import { useAppDispatch, useAppSelector } from "../../../app/store/hooks";
import { loginSuccess, logout } from "../slices/authSlice";

function Auth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  return (
    <section>
      <h2>Login demo</h2>
      <p>Trạng thái: {isLoggedIn ? "Đăng nhập" : "Đăng xuất"}</p>
      <p>Ai đây: {user ? user.name : "Chưa đăng nhập"}</p>

      <button
        type="button"
        onClick={() => dispatch(loginSuccess({ id: 1, name: "Tên" }))}
      >
        Đăng nhập???
      </button>
      <button type="button" onClick={() => dispatch(logout())}>
        Đăng xuất!!!
      </button>
    </section>
  );
}

export default Auth;
