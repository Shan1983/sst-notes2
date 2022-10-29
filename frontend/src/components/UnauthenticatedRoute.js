import React from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../data/context";

const queryString = (name, url = window.location.href) => {
  const parsedName = name.replace(/[[]]/g, "\\$&");
  const regex = new RegExp(`[?&]${parsedName}(=([^&#]*)|&|#|$)`, "i");
  const results = regex.exec(url);

  if (!results || !results[2]) {
    return false;
  }

  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

const UnauthenticatedRoute = (props) => {
  const { isAuthenticated } = useAppContext();
  const { children } = props;
  const redirect = queryString("redirect");

  if (isAuthenticated) return <Navigate to={redirect || "/"} />;

  return React.cloneElement(children, props);
};

export default UnauthenticatedRoute;
