import { FormEvent, useCallback, useState } from "react";
import { SiteLayout } from "../../layout/SiteLayout";
import { MyPage } from "./MyPage";
import { useAuth } from "../../context/AuthContext";

export const MyPageContainer = () => {
  const auth = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      const response = await fetch("/auth/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName: displayName || null,
          password: password || null,
        }),
      });
      if (response.ok) {
        await auth.refetch();
      } else {
        setErrorMessage(await response.text());
      }
    },
    [displayName, password, auth]
  );

  return (
    <SiteLayout>
      <MyPage
        onSubmit={onSubmit}
        defaultDisplayName={auth.user?.displayName || ""}
        onDisplayNameChange={(event) => setDisplayName(event.target.value)}
        onPasswordChange={(event) => setPassword(event.target.value)}
        showErrorMessage={!!errorMessage}
        errorMessage={errorMessage}
      />
    </SiteLayout>
  );
};
