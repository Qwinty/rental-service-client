import { Link } from "react-router-dom";
import { Logo } from "../logo/logo";
import { UserNav } from "../user-nav";
import { AppRoute } from "../../const";

interface HeaderProps {
  showUserNav?: boolean;
  isLogoActive?: boolean;
}

function Header({ showUserNav = false, isLogoActive = false }: HeaderProps) {
  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <div className="header__left">
            <Logo isActive={isLogoActive} />
            <Link
              to={AppRoute.ApiTest}
              style={{
                marginLeft: "20px",
                color: "#4481c3",
                textDecoration: "none",
                fontSize: "14px",
                padding: "5px 10px",
                border: "1px solid #4481c3",
                borderRadius: "4px",
              }}
            >
              🔧 Test API
            </Link>
          </div>
          {showUserNav && <UserNav />}
        </div>
      </div>
    </header>
  );
}

export { Header };
