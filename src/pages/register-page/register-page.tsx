import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Header } from "../../components/header";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { registerUser } from "../../store/action";
import { AppRoute } from "../../const";

function RegisterPage() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, error } = useAppSelector((state) => ({
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
  }));

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState<"normal" | "pro">("normal");
  const [validationError, setValidationError] = useState<string | null>(null);

  console.log("RegisterPage render - isAuthenticated:", isAuthenticated);

  // If already authenticated, redirect to main page
  if (isAuthenticated) {
    return <Navigate to={AppRoute.Main} replace />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("RegisterPage: Register form submitted", {
      username,
      email,
      userType,
    });

    // Client-side validation
    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters long");
      return;
    }

    if (username.length < 2 || username.length > 50) {
      setValidationError("Username must be between 2 and 50 characters long");
      return;
    }

    // Check if username contains only allowed characters (letters, numbers, spaces)
    const usernameRegex = /^[A-Za-zА-Яа-я0-9\s]+$/;
    if (!usernameRegex.test(username)) {
      setValidationError(
        "Username can only contain letters, numbers, and spaces"
      );
      return;
    }

    setValidationError(null);

    try {
      await dispatch(registerUser(username, email, password, userType));
      console.log("RegisterPage: Registration successful");
    } catch (error) {
      console.error("RegisterPage: Registration failed:", error);
    }
  };

  return (
    <div className="page page--gray page--login">
      <Header />

      <main className="page__main page__main--login">
        <div className="page__login-container container">
          <section className="login">
            <h1 className="login__title">Register</h1>
            <form className="login__form form" onSubmit={handleSubmit}>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">Username</label>
                <input
                  className="login__input form__input"
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
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
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">Confirm Password</label>
                <input
                  className="login__input form__input"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">User Type</label>
                <select
                  className="login__input form__input"
                  name="userType"
                  value={userType}
                  onChange={(e) =>
                    setUserType(e.target.value as "normal" | "pro")
                  }
                  required
                >
                  <option value="normal">Normal User</option>
                  <option value="pro">Pro User</option>
                </select>
              </div>
              <button
                className="login__submit form__submit button"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Register"}
              </button>

              {(error || validationError) && (
                <div className="login__error">
                  Error: {validationError || error}
                </div>
              )}
            </form>

            <div className="login__alternative">
              <p className="login__alternative-text">
                Already have an account?{" "}
                <Link to={AppRoute.Login} className="login__alternative-link">
                  Sign in here
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

export { RegisterPage };
