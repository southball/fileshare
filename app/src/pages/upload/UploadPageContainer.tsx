import { useDropzone } from "react-dropzone";
import { SiteLayout } from "../../layout/SiteLayout";
import { UploadPage } from "./UploadPage";
import { ComponentProps, useCallback, useState } from "react";
import { useMutation } from "urql";
import {
  CreateFileDocument,
  UploadTargetDocument,
} from "../../graphql/generated/graphql";

export const UploadPageContainer = () => {
  const [, uploadTargetMutation] = useMutation(UploadTargetDocument);
  const [, createFileMutation] = useMutation(CreateFileDocument);

  const [uploadLogs, setUploadLogs] = useState<
    ComponentProps<typeof UploadPage>["uploadLogs"]
  >([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      try {
        const uploadTarget = (await uploadTargetMutation({})).data
          ?.uploadTarget;
        if (!uploadTarget) {
          throw new Error("Failed to create upload target");
        }
        await fetch(uploadTarget.url, {
          method: "PUT",
          body: file,
        });
        await createFileMutation({
          input: {
            name: file.name,
            uuid: uploadTarget.uuid,
            isPublic: false,
          },
        });
        setUploadLogs([
          { timestamp: new Date(), message: `${file.name} uploaded.` },
          ...uploadLogs,
        ]);
      } catch (err) {
        setUploadLogs([
          { timestamp: new Date(), message: `${file.name} failed to upload.` },
          ...uploadLogs,
        ]);
      }
    },
    [uploadLogs, createFileMutation, uploadTargetMutation]
  );

  const { getRootProps, getInputProps, isDragActive, isFocused } = useDropzone({
    onDrop,
    multiple: false,
  });

  return (
    <SiteLayout>
      <UploadPage
        uploadAreaInputProps={getInputProps()}
        uploadAreaRootProps={getRootProps()}
        uploadLogs={uploadLogs}
        isUploadAreaHighlighted={isDragActive || isFocused}
      />
    </SiteLayout>
  );
};
