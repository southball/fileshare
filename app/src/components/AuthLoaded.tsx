import React from "react";
import { useAuth } from "../context/AuthContext";

export const AuthLoaded: React.FC<{ children?: React.ReactNode }> = (props) => {
  const auth = useAuth();

  if (auth.isInitialLoading) {
    return <>Loading...</>;
  }

  return <>{props.children}</>;
};
