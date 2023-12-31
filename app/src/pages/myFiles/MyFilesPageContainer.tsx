import { useQuery } from "urql";
import { MyFilesPage } from "./MyFilesPage";
import {
  DownloadFileDocument,
  MyFilesDocument,
} from "../../graphql/generated/graphql";
import { useCallback } from "react";
import { SiteLayout } from "../../layout/SiteLayout";
import { useUrql } from "../../context/UrqlContext";
import { useFileShareModal } from "../../modals/FileShareModal/useFileShareModal";
import { FileShareModalContainer } from "../../modals/FileShareModal/FileShareModalContainer";

export const MyFilesPageContainer = () => {
  const { urqlClient } = useUrql();
  const [{ data: myFilesData, fetching: myFilesFetching }] = useQuery({
    query: MyFilesDocument,
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

  const { openModal, modal } = useFileShareModal();

  return (
    <SiteLayout>
      {myFilesFetching ? (
        <div>Loading...</div>
      ) : (
        <MyFilesPage
          files={myFilesData?.myFiles ?? []}
          onDownloadFile={onDownloadFile}
          onShareFile={(fileId) => openModal(fileId)}
        />
      )}
      <FileShareModalContainer {...modal} />
    </SiteLayout>
  );
};
