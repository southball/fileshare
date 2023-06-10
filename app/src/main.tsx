import "./style.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./context/AuthContext.tsx";
import { Router } from "./Router.tsx";
import { AuthLoaded } from "./components/AuthLoaded.tsx";
import { UrqlProvider } from "./context/UrqlContext.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <UrqlProvider>
      <AuthProvider>
        <AuthLoaded>
          <Router />
        </AuthLoaded>
      </AuthProvider>
    </UrqlProvider>
  </React.StrictMode>
);
