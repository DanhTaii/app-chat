import "./login-page.scss";
import Button from "../../../shared/components/button";
import Input from "../../../shared/components/Input";
import {useTranslation} from "react-i18next";

// Wireframe trang đăng nhập
function LoginPage() {
    const {t} = useTranslation("auth")
    return (
        <div className="login-page">
            <section className="login-card" aria-labelledby="login-title">
                <h1 id="login-title">{t("auth.title.login")}</h1>
                <p className="login-card__hint">
                {t("auth.description.login")}
                </p>

                <form className="login-form" onSubmit={(e) => e.preventDefault()}>
                    <label htmlFor="identifier">{t("auth.label.identifier")}</label>
                    <Input
                        id="identifier"
                        name="identifier"
                        type="text"
                        autoComplete="username"
                        placeholder="name@example.edu.vn"
                    />

                    <label htmlFor="password">{t("auth.label.password")}</label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        placeholder={t("auth.placeholder.identifier")}
                    />

                    <label className="login-form__remember">
                        <Input type="checkbox" name="remember"/>
                    {t("auth.label.remember")}
                    </label>

                    <Button type="submit">
                    {t("auth.title.login")}
                    </Button>
                </form>
            </section>
        </div>
    );
}

export default LoginPage;
