import { css } from "@emotion/react";
import { format as formatDate } from "date-fns";

type Props = {
  files: { id: number; name: string; createdAt: string }[];
  onDownloadFile: (fileId: number) => void;
  onShareFile: (fileId: number) => void;
};

export const MyFilesPage = ({ files, onDownloadFile, onShareFile }: Props) => {
  return (
    <div css={filesStyle}>
      <h1>My Files</h1>
      {!files.length && "No files uploaded yet."}
      {files.map((file) => (
        <div css={fileStyle}>
          <span>
            {file.name} (
            {formatDate(new Date(file.createdAt), "yyyy/MM/dd HH:mm")})
          </span>
          <button css={textButtonStyle} onClick={() => onShareFile(file.id)}>
            Share
          </button>
          <button css={textButtonStyle} onClick={() => onDownloadFile(file.id)}>
            Download
          </button>
        </div>
      ))}
    </div>
  );
};

const filesStyle = css``;

const fileStyle = css`
  & > *:not(:last-child) {
    margin-right: 4px;
  }
`;

const textButtonStyle = css`
  outline: none;
  border: none;
  display: inline;
  background-color: transparent;
  padding: 0;
  margin: 0;
  cursor: pointer;
  text-decoration: underline;
`;
