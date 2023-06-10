import { useQuery } from "urql";
import { FileShareModal } from "./FileShareModal";
import {
  CreateFileShareDocument,
  GetUsersDocument,
} from "../../graphql/generated/graphql";
import { useCallback, useState } from "react";
import { useMutationWithError } from "../../utils/useMutationWithError";

type Props = {
  isDisplayed: boolean;
  fileId: number;
  onClose: () => void;
};

export const FileShareModalContainer = ({
  isDisplayed,
  fileId,
  onClose,
}: Props) => {
  const [{ data: getUsersData }] = useQuery({ query: GetUsersDocument });
  const users = getUsersData?.users ?? [];

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const [, createFileShare] = useMutationWithError(CreateFileShareDocument);

  const onSubmit = useCallback(async () => {
    if (selectedUserId) {
      await createFileShare({
        input: {
          fileId,
          userId: selectedUserId,
        },
      });
      onClose();
    }
  }, [fileId, selectedUserId, onClose, createFileShare]);

  return (
    <FileShareModal
      isDisplayed={isDisplayed}
      users={users}
      selectedUser={selectedUserId}
      onSelectUser={setSelectedUserId}
      onClose={onClose}
      onOverlayClicked={onClose}
      onCancel={() => onClose()}
      onSubmit={onSubmit}
    />
  );
};
