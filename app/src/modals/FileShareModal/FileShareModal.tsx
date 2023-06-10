import { MouseEventHandler } from "react";
import { Modal } from "../../components/Modal";
import { IoMdClose } from "react-icons/io";
import { css } from "@emotion/react";

type Props = {
  isDisplayed: boolean;
  users: { id: number; displayName: string; username: string }[];
  selectedUser: number | null;
  onOverlayClicked: MouseEventHandler<HTMLDivElement>;
  onSelectUser: (id: number | null) => void;
  onSubmit: MouseEventHandler<HTMLButtonElement>;
  onCancel: MouseEventHandler<HTMLButtonElement>;
  onClose: () => void;
};

export const FileShareModal = ({
  isDisplayed,
  onOverlayClicked,
  selectedUser,
  onSelectUser,
  users,
  onSubmit,
  onCancel,
  onClose,
}: Props) => {
  return (
    <Modal isDisplayed={isDisplayed} onOverlayClicked={onOverlayClicked}>
      <div css={modalSectionsStyle}>
        <div css={[modalSectionStyle, modalSectionCloseStyle]}>
          <div css={modalCloseButtonStyle} onClick={onClose}>
            <IoMdClose />
          </div>
        </div>
        <div css={modalSectionStyle}>
          <h1>File Share</h1>
        </div>
        <div css={modalSectionStyle}>
          <select
            onChange={(event) =>
              onSelectUser(
                event.target.value ? Number(event.target.value) : null
              )
            }
            value={selectedUser?.toString() || ""}
          >
            <option value="">Please select user</option>
            {users.map((user) => (
              <option value={user.id} key={user.id}>
                {user.displayName} ({user.username})
              </option>
            ))}
          </select>
        </div>
        <div css={[modalSectionStyle, modalSectionFooterStyle]}>
          <div css={modalFooterButtonsStyle}>
            <button onClick={onSubmit}>Share</button>
            <button onClick={onCancel}>Cancel</button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const modalSectionsStyle = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const modalCloseButtonStyle = css`
  cursor: pointer;
`;

const modalSectionStyle = css`
  display: flex;
  flex-direction: row;
`;

const modalSectionCloseStyle = css`
  justify-content: flex-end;
`;

const modalSectionFooterStyle = css`
  justify-content: flex-end;
`;

const modalFooterButtonsStyle = css`
  display: flex;
  gap: 8px;
`;
