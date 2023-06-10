import { css } from "@emotion/react";
import { ChangeEventHandler, FormEventHandler } from "react";

type Props = {
  onUsernameChange: ChangeEventHandler<HTMLInputElement>;
  onDisplayNameChange: ChangeEventHandler<HTMLInputElement>;
  onPasswordChange: ChangeEventHandler<HTMLInputElement>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  showErrorMessage?: boolean;
  errorMessage?: string;
};

export const RegisterPage = ({
  onUsernameChange,
  onDisplayNameChange,
  onPasswordChange,
  onSubmit,
  showErrorMessage,
  errorMessage,
}: Props) => (
  <form onSubmit={onSubmit}>
    {showErrorMessage && <div css={errorMessageStyle}>{errorMessage}</div>}
    <div>
      <div>Username</div>
      <div>
        <input type="text" onChange={onUsernameChange} />
      </div>
    </div>
    <div>
      <div>Display name</div>
      <div>
        <input type="text" onChange={onDisplayNameChange} />
      </div>
    </div>
    <div>
      <div>Password</div>
      <div>
        <input type="password" onChange={onPasswordChange} />
      </div>
    </div>
    <div>
      <button type="submit">Login</button>
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
