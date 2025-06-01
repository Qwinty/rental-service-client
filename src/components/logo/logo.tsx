import { Link } from "react-router-dom";
import { AppRoute } from "../../const";

interface LogoProps {
  isActive?: boolean;
}

function Logo({ isActive = false }: LogoProps) {
  const logoClass = isActive
    ? "header__logo header__logo--active"
    : "header__logo";

  return (
    <Link className={logoClass} to={AppRoute.Main}>
      <img
        className="header__logo"
        src="/img/logo.svg"
        alt="Rent service logo"
        width="81"
        height="41"
      />
    </Link>
  );
}

export { Logo };
