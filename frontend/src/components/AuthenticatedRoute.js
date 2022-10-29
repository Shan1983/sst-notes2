import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppContext } from "../data/context";

const AuthenticatedRoute = ({ children }) => {
  const { pathname, search } = useLocation();
  const { isAuthenticated } = useAppContext();

  if (!isAuthenticated)
    return <Navigate to={`/login?redirect=${pathname}${search}`} />;

  return children;
};

export default AuthenticatedRoute;
