import { useAuth } from "../../context/AuthContext";
import { SiteLayout } from "../../layout/SiteLayout";
import { IndexPage } from "./IndexPage";

export const IndexPageContainer = () => {
  const auth = useAuth();

  const message = auth.user?.username
    ? `Hello ${auth.user.displayName}`
    : "Hello guest";

  return (
    <SiteLayout>
      <IndexPage message={message} />
    </SiteLayout>
  );
};
