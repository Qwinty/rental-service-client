import { Navigate } from "react-router-dom";
import type { ReactElement } from "react";
import { AppRoute, AuthorizationStatus } from "../../const";

interface PrivateRouteProps {
  authorizationStatus: string;
  children: ReactElement;
}

function PrivateRoute({ authorizationStatus, children }: PrivateRouteProps) {
  return authorizationStatus === AuthorizationStatus.Auth ? (
    children
  ) : (
    <Navigate to={AppRoute.Login} />
  );
}

export { PrivateRoute };
