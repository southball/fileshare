import { useQuery } from "urql";
import { SharedFilesPage } from "./SharedFilesPage";
import {
  DownloadFileDocument,
  FileSharesWithMeDocument,
} from "../../graphql/generated/graphql";
import { useCallback } from "react";
import { SiteLayout } from "../../layout/SiteLayout";
import { useUrql } from "../../context/UrqlContext";

export const SharedFilesPageContainer = () => {
  const { urqlClient } = useUrql();
  const [{ data: fileSharesWithMeData, fetching: fileSharesWithMeFetching }] =
    useQuery({
      query: FileSharesWithMeDocument,
    });

  const onDownloadFile = useCallback(
    async (id: number) => {
      const downloadFileData = await urqlClient.query(DownloadFileDocument, {
        id,
      });
      const downloadUrl = downloadFileData.data?.file.downloadUrl;
      if (!downloadUrl) {
        alert("Failed to get download url");
        return;
      }
      window.open(downloadUrl, "_blank");
    },
    [urqlClient]
  );

  return (
    <SiteLayout>
      {fileSharesWithMeFetching ? (
        <div>Loading...</div>
      ) : (
        <SharedFilesPage
          files={
            fileSharesWithMeData?.fileSharesWithMe.map(
              (fileShare) => fileShare.file
            ) ?? []
          }
          onDownloadFile={onDownloadFile}
        />
      )}
    </SiteLayout>
  );
};
