import { css } from "@emotion/react";
import { format as formatDate } from "date-fns";

type Props = {
  files: { id: number; name: string; createdAt: string }[];
  onDownloadFile: (fileId: number) => void;
};

export const MyFilesPage = ({ files, onDownloadFile }: Props) => {
  return (
    <div css={filesStyle}>
      {!files.length && "No files uploaded yet."}
      {files.map((file) => (
        <div css={fileStyle} onClick={() => onDownloadFile(file.id)}>
          {file.name} (
          {formatDate(new Date(file.createdAt), "yyyy/MM/dd HH:mm")})
        </div>
      ))}
    </div>
  );
};

const filesStyle = css``;

const fileStyle = css`
  cursor: pointer;
  text-decoration: underline;
`;
