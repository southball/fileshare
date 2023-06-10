import { FormEvent, useCallback, useState } from "react";
import { SiteLayout } from "../../layout/SiteLayout";
import { useNavigate } from "react-router-dom";
import { RegisterPage } from "./RegisterPage";

export const RegisterPageContainer = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      const response = await fetch("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, displayName, password }),
      });
      if (response.ok) {
        navigate("/login");
      } else {
        setErrorMessage(await response.text());
      }
    },
    [username, displayName, password, navigate]
  );

  return (
    <SiteLayout>
      <RegisterPage
        onSubmit={onSubmit}
        onUsernameChange={(event) => setUsername(event.target.value)}
        onDisplayNameChange={(event) => setDisplayName(event.target.value)}
        onPasswordChange={(event) => setPassword(event.target.value)}
        showErrorMessage={!!errorMessage}
        errorMessage={errorMessage}
      />
    </SiteLayout>
  );
};
