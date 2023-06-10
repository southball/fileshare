import { useCallback, useState } from "react";

export const useFileShareModal = () => {
  const [isDisplayed, setIsDisplayed] = useState(false);
  const [fileId, setFileId] = useState(0);

  const onClose = useCallback(() => {
    setIsDisplayed(false);
  }, []);

  const openModal = useCallback((fileId: number) => {
    setFileId(fileId);
    setIsDisplayed(true);
  }, []);

  return {
    openModal,
    modal: { isDisplayed, fileId, onClose },
  };
};
