import {
  RouteObject,
  RouterProvider,
  createMemoryRouter,
} from "react-router-dom";
import { IndexPageContainer } from "./pages/index/IndexPageContainer";
import { UploadPageContainer } from "./pages/upload/UploadPageContainer";
import { MyFilesPageContainer } from "./pages/myFiles/MyFilesPageContainer";
import { LogoutPageContainer } from "./pages/logout/LogoutPageContainer";
import { LoginPageContainer } from "./pages/login/LoginPageContainer";
import { RegisterPageContainer } from "./pages/register/RegisterPageContainer";
import { MyPageContainer } from "./pages/myPage/MyPageContainer";

export const Router = () => {
  const routes: RouteObject[] = [
    {
      path: "/",
      element: <IndexPageContainer />,
    },
    {
      path: "/upload",
      element: <UploadPageContainer />,
    },
    {
      path: "/my-files",
      element: <MyFilesPageContainer />,
    },
    {
      path: "/login",
      element: <LoginPageContainer />,
    },
    {
      path: "/logout",
      element: <LogoutPageContainer />,
    },
    {
      path: "/register",
      element: <RegisterPageContainer />,
    },
    {
      path: "/my-page",
      element: <MyPageContainer />,
    },
  ];

  const router = createMemoryRouter(routes);

  return <RouterProvider router={router} />;
};
