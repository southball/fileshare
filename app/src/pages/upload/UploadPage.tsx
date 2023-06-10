import { css } from "@emotion/react";
import { ComponentProps } from "react";
import { format as formatDate } from "date-fns";

type Props = {
  uploadAreaRootProps: ComponentProps<"div">;
  uploadAreaInputProps: ComponentProps<"input">;
  uploadLogs: { timestamp: Date; message: string }[];
  isUploadAreaHighlighted: boolean;
};

export const UploadPage = ({
  uploadAreaInputProps,
  uploadAreaRootProps,
  uploadLogs,
  isUploadAreaHighlighted,
}: Props) => {
  return (
    <div>
      <h1>Upload File</h1>
      <div
        css={uploadAreaStyle(isUploadAreaHighlighted)}
        {...uploadAreaRootProps}
      >
        <input {...uploadAreaInputProps} />
        Click or drag file to this area to upload
      </div>
      <div>
        {uploadLogs.map((log) => (
          <div>
            {formatDate(log.timestamp, "yyyy/MM/dd HH:mm")} - {log.message}
          </div>
        ))}
      </div>
    </div>
  );
};

const uploadAreaStyle = (highlighted: boolean) => css`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-style: dashed;
  border-color: ${highlighted ? "#2196f3" : "#eeeeee"};
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
`;
