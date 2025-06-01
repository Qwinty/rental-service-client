interface UserNavProps {
  userEmail?: string;
  favoriteCount?: number;
}

function UserNav({
  userEmail = "Myemail@gmail.com",
  favoriteCount = 3,
}: UserNavProps) {
  return (
    <nav className="header__nav">
      <ul className="header__nav-list">
        <li className="header__nav-item user">
          <a className="header__nav-link header__nav-link--profile" href="#">
            <div className="header__avatar-wrapper user__avatar-wrapper"></div>
            <span className="header__user-name user__name">{userEmail}</span>
            <span className="header__favorite-count">{favoriteCount}</span>
          </a>
        </li>
        <li className="header__nav-item">
          <a className="header__nav-link" href="#">
            <span className="header__signout">Sign out</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}

export { UserNav };
