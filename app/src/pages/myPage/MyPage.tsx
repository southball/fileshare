import { css } from "@emotion/react";
import { ChangeEventHandler, FormEventHandler } from "react";

type Props = {
  defaultDisplayName?: string;
  onDisplayNameChange: ChangeEventHandler<HTMLInputElement>;
  onPasswordChange: ChangeEventHandler<HTMLInputElement>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  showErrorMessage?: boolean;
  errorMessage?: string;
};

export const MyPage = ({
  defaultDisplayName,
  onDisplayNameChange,
  onPasswordChange,
  onSubmit,
  showErrorMessage,
  errorMessage,
}: Props) => (
  <form onSubmit={onSubmit}>
    {showErrorMessage && <div css={errorMessageStyle}>{errorMessage}</div>}
    <div>
      <div>Display name</div>
      <div>
        <input
          type="text"
          onChange={onDisplayNameChange}
          defaultValue={defaultDisplayName}
        />
      </div>
    </div>
    <div>
      <div>Password</div>
      <div>
        <input
          type="password"
          onChange={onPasswordChange}
          placeholder="Enter new password to change"
        />
      </div>
    </div>
    <div>
      <button type="submit">Save</button>
    </div>
  </form>
);

const errorMessageStyle = css`
  padding: 4px 8px;
  border: 1px solid #f5c2c7;
  border-radius: 4px;
  color: #842029;
  background-color: #f8d7da;
`;
