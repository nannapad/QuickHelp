import { useState, useCallback } from "react";

export const useAlertModal = () => {
  const [modalState, setModalState] = useState({
    show: false,
    title: "",
    message: "",
    variant: "info",
    onConfirm: null,
    confirmText: "",
    cancelText: "",
  });

  const showAlert = useCallback((message, variant = "info", title = "") => {
    setModalState({
      show: true,
      title,
      message,
      variant,
      onConfirm: null,
      confirmText: "",
      cancelText: "",
    });
  }, []);

  const showConfirm = useCallback(
    (
      message,
      onConfirm,
      variant = "warning",
      title = "",
      confirmText = "Confirm",
      cancelText = "Cancel"
    ) => {
      setModalState({
        show: true,
        title,
        message,
        variant,
        onConfirm,
        confirmText,
        cancelText,
      });
    },
    []
  );

  const hideAlert = useCallback(() => {
    setModalState((prev) => ({ ...prev, show: false }));
  }, []);

  return {
    modalState,
    showAlert,
    showConfirm,
    hideAlert,
  };
};
