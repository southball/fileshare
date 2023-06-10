import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { css } from "@emotion/react";

export const SiteLayout: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const auth = useAuth();
  const location = useLocation();
  console.log(location);
  return (
    <>
      <div css={linkGroupsStyle}>
        <div css={linkGroupStyle}>
          <div css={linkGroupLinkStyle(location.pathname === "/")}>
            <Link to="/">Home</Link>
          </div>
          {auth.user && (
            <>
              <div css={linkGroupLinkStyle(location.pathname === "/upload")}>
                <Link to="/upload">Upload</Link>
              </div>
              <div css={linkGroupLinkStyle(location.pathname === "/my-files")}>
                <Link to="/my-files">My Files</Link>
              </div>
              <div
                css={linkGroupLinkStyle(location.pathname === "/shared-files")}
              >
                <Link to="/shared-files">Shared Files</Link>
              </div>
            </>
          )}
        </div>
        <div css={linkGroupStyle}>
          {!auth.user && (
            <>
              <div css={linkGroupLinkStyle(location.pathname === "/login")}>
                <Link to="/login">Login</Link>
              </div>
              <div css={linkGroupLinkStyle(location.pathname === "/register")}>
                <Link to="/register">Register</Link>
              </div>
            </>
          )}
          {auth.user && (
            <>
              <div css={linkGroupLinkStyle(location.pathname === "/my-page")}>
                <Link to="/my-page">My Page</Link>
              </div>
              <div css={linkGroupLinkStyle(location.pathname === "/logout")}>
                <Link to="/logout">Logout</Link>
              </div>
            </>
          )}
        </div>
      </div>
      <div css={contentStyle}>{children}</div>
    </>
  );
};

const linkGroupsStyle = css`
  padding: 0 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const linkGroupStyle = css`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

const linkGroupLinkStyle = (isActive: boolean) => css`
  & > a {
    text-decoration: ${isActive ? "underline" : "none"};
  }
`;

const contentStyle = css`
  padding: 0 16px;
  max-width: 960px;
  margin: auto;
`;
