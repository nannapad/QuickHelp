import { Modal, Button } from "react-bootstrap";
import "./css/AlertModal.css";

const AlertModal = ({
  show,
  onHide,
  title,
  message,
  variant = "info",
  onConfirm,
  confirmText,
  cancelText,
}) => {
  const isConfirmDialog = !!onConfirm;

  const getIcon = () => {
    switch (variant) {
      case "success":
        return "✓";
      case "danger":
      case "error":
        return "⚠";
      case "warning":
        return "⚠";
      case "info":
      default:
        return "ℹ";
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      className="alert-modal"
      backdrop={isConfirmDialog ? "static" : true}
    >
      <Modal.Header
        closeButton
        className={`alert-modal-header alert-modal-${variant}`}
      >
        <Modal.Title className="alert-modal-title">
          <span className="alert-modal-icon">{getIcon()}</span>
          {title ||
            (variant === "success"
              ? "Success"
              : variant === "error" || variant === "danger"
              ? "Error"
              : variant === "warning"
              ? "Warning"
              : "Information")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="alert-modal-body">{message}</Modal.Body>
      <Modal.Footer className="alert-modal-footer">
        {isConfirmDialog ? (
          <>
            <Button
              variant="secondary"
              onClick={onHide}
              className="alert-modal-btn-cancel"
            >
              {cancelText || "Cancel"}
            </Button>
            <Button
              variant={
                variant === "danger" || variant === "error"
                  ? "danger"
                  : "primary"
              }
              onClick={handleConfirm}
              className="alert-modal-btn-confirm"
            >
              {confirmText || "Confirm"}
            </Button>
          </>
        ) : (
          <Button
            variant={
              variant === "danger" || variant === "error" ? "danger" : "primary"
            }
            onClick={onHide}
            className="alert-modal-btn-ok"
          >
            OK
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default AlertModal;
