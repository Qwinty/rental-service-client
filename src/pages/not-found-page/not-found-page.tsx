import { Header } from "../../components/header";
import { Link } from "react-router-dom";
import { AppRoute } from "../../const";

function NotFoundPage() {
  return (
    <div className="page page--gray page--login">
      <Header />

      <main className="page__main page__main--login">
        <div className="page__login-container container">
          <section className="login">
            <h1 className="login__title">404. Page not found</h1>
            <Link
              to={AppRoute.Main}
              style={{ textDecoration: "underline", color: "#4481c3" }}
            >
              Go back to main page
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}

export { NotFoundPage };
