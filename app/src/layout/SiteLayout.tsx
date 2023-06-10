import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { css } from "@emotion/react";

export const SiteLayout: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const auth = useAuth();
  return (
    <>
      <div css={linkGroupsStyle}>
        <div css={linkGroupStyle}>
          <div css={linkGroupLinkStyle}>
            <Link to="/">Home</Link>
          </div>
          {auth.user && (
            <>
              <div css={linkGroupLinkStyle}>
                <Link to="/upload">Upload</Link>
              </div>
              <div css={linkGroupLinkStyle}>
                <Link to="/my-files">My Files</Link>
              </div>
            </>
          )}
        </div>
        <div css={linkGroupStyle}>
          {!auth.user && (
            <>
              <div css={linkGroupLinkStyle}>
                <Link to="/login">Login</Link>
              </div>
              <div css={linkGroupLinkStyle}>
                <Link to="/register">Register</Link>
              </div>
            </>
          )}
          {auth.user && (
            <>
              <div css={linkGroupLinkStyle}>
                <Link to="/my-page">My Page</Link>
              </div>
              <div css={linkGroupLinkStyle}>
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

const linkGroupLinkStyle = css`
  text-decoration: underline;
`;

const contentStyle = css`
  padding: 0 16px;
  max-width: 960px;
  margin: auto;
`;
