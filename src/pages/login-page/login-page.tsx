import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Header } from "../../components/header";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { loginUser } from "../../store/action";
import { AppRoute } from "../../const";

function LoginPage() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, error } = useAppSelector((state) => ({
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
  }));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  console.log("LoginPage render - isAuthenticated:", isAuthenticated);

  // If already authenticated, redirect to main page
  if (isAuthenticated) {
    return <Navigate to={AppRoute.Main} replace />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("LoginPage: Login form submitted", { email, password });

    try {
      await dispatch(loginUser(email, password));
      console.log("LoginPage: Login successful");
    } catch (error) {
      console.error("LoginPage: Login failed:", error);
    }
  };

  return (
    <div className="page page--gray page--login">
      <Header />

      <main className="page__main page__main--login">
        <div className="page__login-container container">
          <section className="login">
            <h1 className="login__title">Sign in</h1>
            <form className="login__form form" onSubmit={handleSubmit}>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">E-mail</label>
                <input
                  className="login__input form__input"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">Password</label>
                <input
                  className="login__input form__input"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                className="login__submit form__submit button"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
              {error && <div className="login__error">Error: {error}</div>}
            </form>

            <div className="login__test-credentials">
              <h3>Test Login Credentials:</h3>
              <p>
                <strong>Email:</strong> testuser@email.com
              </p>
              <p>
                <strong>Password:</strong> testuser1
              </p>
              <p className="login__alternative-text">
                Don&apos;t have an account?{" "}
                <Link
                  to={AppRoute.Register}
                  className="login__alternative-link"
                >
                  Register here
                </Link>
              </p>
            </div>
          </section>
          <section className="locations locations--login locations--current">
            <div className="locations__item">
              <a className="locations__item-link" href="#">
                <span>Amsterdam</span>
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export { LoginPage };
