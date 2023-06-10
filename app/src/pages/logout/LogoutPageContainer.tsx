import { useEffect } from "react";
import { SiteLayout } from "../../layout/SiteLayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const LogoutPageContainer = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    void (async () => {
      await auth.logout();
      navigate("/");
    })();
  });

  return <SiteLayout />;
};
