import { Logo } from "../logo/logo";
import { UserNav } from "../user-nav";

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
          </div>
          {showUserNav && <UserNav />}
        </div>
      </div>
    </header>
  );
}

export { Header };
