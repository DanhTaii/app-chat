// import brandIcon from "../../../../shared/assets/logo.png";

type AuthHeaderProps = {
  title: string;
  description: string;
};

function AuthHeader({ title, description }: AuthHeaderProps) {
  return (
    <header className="auth-heading">
      {/* <img className="auth-brand-icon" src={brandIcon} alt="" /> */}
      <h1 id="auth-title">{title}</h1>
      <p className="auth-description">{description}</p>
    </header>
  );
}

export default AuthHeader;
