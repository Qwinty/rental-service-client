function NotFoundPage() {
  return (
    <div className="page page--gray page--login">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <a className="header__logo-link" href="/">
                <img
                  className="header__logo"
                  src="img/logo.svg"
                  alt="Rent service logo"
                  width="81"
                  height="41"
                />
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="page__main page__main--login">
        <div className="page__login-container container">
          <section className="login">
            <h1 className="login__title">404. Page not found</h1>
            <a
              href="main.html"
              style={{ textDecoration: "underline", color: "#4481c3" }}
            >
              Go back to main page
            </a>
          </section>
        </div>
      </main>
    </div>
  );
}

export { NotFoundPage };
