import { Link } from "react-router-dom";
import { Logo } from "../logo/logo";
import { UserNav } from "../user-nav";
import { AppRoute } from "../../const";
import { useAppSelector } from "../../hooks";

interface HeaderProps {
  showUserNav?: boolean;
  isLogoActive?: boolean;
}

function Header({ showUserNav = false, isLogoActive = false }: HeaderProps) {
  const { isAuthenticated, user, favoriteOffers } = useAppSelector((state) => ({
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    favoriteOffers: state.favoriteOffers,
  }));

  console.log(
    "Header: Header render - isAuthenticated:",
    isAuthenticated,
    "user:",
    user
  );

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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              🔧 Test API
            </Link>
          </div>
          {showUserNav && (
            <>
              {isAuthenticated && user ? (
                <UserNav
                  userEmail={user.email}
                  favoriteCount={favoriteOffers.length}
                />
              ) : (
                <nav className="header__nav">
                  <ul className="header__nav-list">
                    <li className="header__nav-item">
                      <Link
                        className="header__nav-link"
                        to={AppRoute.Register}
                        style={{ marginRight: "15px" }}
                      >
                        <span className="header__signin">Register</span>
                      </Link>
                    </li>
                    <li className="header__nav-item">
                      <Link
                        className="header__nav-link header__signin-button"
                        to={AppRoute.Login}
                      >
                        <span className="header__signin">Sign in</span>
                      </Link>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export { Header };
