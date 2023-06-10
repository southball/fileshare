import { FormEvent, useCallback, useState } from "react";
import { SiteLayout } from "../../layout/SiteLayout";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LoginPage } from "./LoginPage";

export const LoginPageContainer = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isWrongUsernameOrPassword, setIsWrongUsernameOrPassword] =
    useState(false);

  const onSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      if (await auth.login(username, password)) {
        setIsWrongUsernameOrPassword(false);
        navigate("/");
      } else {
        setIsWrongUsernameOrPassword(true);
      }
    },
    [username, password, auth, navigate]
  );

  return (
    <SiteLayout>
      <LoginPage
        onSubmit={onSubmit}
        onUsernameChange={(event) => setUsername(event.target.value)}
        onPasswordChange={(event) => setPassword(event.target.value)}
        showErrorMessage={isWrongUsernameOrPassword}
        errorMessage="Wrong username or password"
      />
    </SiteLayout>
  );
};
