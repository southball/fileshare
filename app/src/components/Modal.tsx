import { css } from "@emotion/react";
import React, { MouseEventHandler } from "react";

type Props = {
  isDisplayed: boolean;
  children?: React.ReactNode;
  onOverlayClicked?: MouseEventHandler<HTMLDivElement>;
};

export const Modal = ({ isDisplayed, children, onOverlayClicked }: Props) => {
  return isDisplayed ? (
    <div css={modalContainerStyle} onClick={onOverlayClicked}>
      <div css={modalStyle} onClick={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>
  ) : null;
};

const modalContainerStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const modalStyle = css`
  margin: 16px;
  max-width: 960px;
  background-color: white;
  padding: 8px;
  border-radius: 4px;
`;
