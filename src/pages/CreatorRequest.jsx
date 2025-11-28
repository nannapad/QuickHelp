import React, { useState, useEffect } from "react";
import "./css/CreatorRequest.css";
import { useTranslation } from "../utils/translations";
import { addRequest, getRequestByUserId } from "../data/CreatorRequests";
import { useAlertModal } from "../hooks/useAlertModal";
import AlertModal from "../components/AlertModal";
import { addNotification } from "../utils/notifications";
import { getAllUsers } from "../data/UserData";

const CreatorRequest = () => {
  const { t } = useTranslation();
  const [currentUser, setCurrentUser] = useState(null);
  const [request, setRequest] = useState(null);
  const [formData, setFormData] = useState({
    team: "",
    reason: "",
    types: "",
  });
  const { modalState, showAlert, hideAlert } = useAlertModal();

  // Load current user and their request status
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);

        // Check if user has an existing request
        const existingRequest = getRequestByUserId(user.id);
        setRequest(existingRequest);
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    }
  }, []);

  const hasPendingRequest = request && request.status === "pending";
  const requestStatus = request ? request.status : null;
  const reviewedNote = request ? request.note : null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!currentUser) {
      showAlert(
        "Please login to submit a creator request",
        "warning",
        "Login Required"
      );
      return;
    }

    if (hasPendingRequest) {
      showAlert(
        t("creatorRequest.alreadySubmitted") ||
          "You already have a pending request",
        "info",
        "Request Already Submitted"
      );
      return;
    }
    try {
      const newRequest = addRequest({
        userId: currentUser.id,
        username: currentUser.username,
        team: formData.team,
        reason: formData.reason,
        types: formData.types
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });

      setRequest(newRequest); // Notify all admins about new creator request
      const allUsers = getAllUsers();
      const admins = allUsers.filter((u) => u.role === "admin");
      admins.forEach((admin) => {
        addNotification({
          userId: String(admin.id),
          message: `New creator request from ${currentUser.username} (${currentUser.firstName} ${currentUser.lastName})`,
          type: "info",
          link: "/admin-dashboard",
        });
      });

      showAlert(
        t("creatorRequest.submitted") || "Request submitted successfully!",
        "success",
        "Request Submitted"
      );

      // Clear form
      setFormData({ team: "", reason: "", types: "" });
    } catch (error) {
      console.error("Error submitting request:", error);
      showAlert(
        "Failed to submit request. Please try again.",
        "error",
        "Submission Failed"
      );
    }
  };

  return (
    <main className="creq-page">
      <div className="creq-inner">
        {" "}
        <header className="creq-header">
          <div>
            <h1 className="creq-title">{t("creatorRequest.title")}</h1>
            <p className="creq-sub">{t("creatorRequest.subtitle")}</p>
          </div>
          <span className={`creq-statusChip creq-${requestStatus}`}>
            {requestStatus === "pending" &&
              t("creatorRequest.statuses.pending")}
            {requestStatus === "approved" &&
              t("creatorRequest.statuses.approved")}
            {requestStatus === "rejected" &&
              t("creatorRequest.statuses.rejected")}
          </span>
        </header>
        <div className="creq-grid">
          {" "}
          {/* Left: form / guideline */}
          <section className="creq-card">
            <h2 className="creq-cardTitle">
              {t("creatorRequest.reasonContext")}
            </h2>
            <p className="creq-cardSub">{t("creatorRequest.reasonDesc")}</p>

            <form className="creq-form" onSubmit={handleSubmit}>
              {" "}
              <div className="creq-field">
                <label>{t("creatorRequest.team")}</label>
                <input
                  type="text"
                  name="team"
                  placeholder={t("creatorRequest.teamPlaceholder")}
                  value={formData.team}
                  onChange={handleInputChange}
                  disabled={hasPendingRequest}
                />
              </div>
              <div className="creq-field">
                <label>{t("creatorRequest.reason")}</label>
                <textarea
                  rows={4}
                  name="reason"
                  placeholder={t("creatorRequest.reasonPlaceholder")}
                  value={formData.reason}
                  onChange={handleInputChange}
                  disabled={hasPendingRequest}
                />
              </div>
              <div className="creq-field">
                <label>{t("creatorRequest.manualTypes")}</label>
                <input
                  type="text"
                  name="types"
                  placeholder={t("creatorRequest.typesPlaceholder")}
                  value={formData.types}
                  onChange={handleInputChange}
                  disabled={hasPendingRequest}
                />
              </div>
              <label className="creq-checkRow">
                <input type="checkbox" defaultChecked />
                <span>{t("creatorRequest.agreement")}</span>
              </label>
              <button
                type="submit"
                className="creq-btn primary"
                disabled={hasPendingRequest}
              >
                {hasPendingRequest
                  ? t("creatorRequest.pending")
                  : t("creatorRequest.submit")}
              </button>
            </form>
          </section>{" "}
          {/* Right: status + timeline */}
          <section className="creq-card">
            <h2 className="creq-cardTitle">
              {t("creatorRequest.requestStatus")}
            </h2>
            <p className="creq-cardSub">{t("creatorRequest.statusDesc")}</p>{" "}
            <div className="creq-statusBox">
              <div className="creq-statusRow">
                <span className="creq-statusLabel">
                  {t("creatorRequest.currentStatus")}
                </span>
                {requestStatus ? (
                  <span className={`creq-statusPill creq-${requestStatus}`}>
                    {requestStatus === "pending" &&
                      t("creatorRequest.statuses.pending")}
                    {requestStatus === "approved" &&
                      t("creatorRequest.statuses.approved")}
                    {requestStatus === "rejected" &&
                      t("creatorRequest.statuses.rejected")}
                  </span>
                ) : (
                  <span className="creq-statusPill creq-none">
                    No request submitted
                  </span>
                )}
              </div>
              <p className="creq-statusNote">
                {reviewedNote || t("creatorRequest.timeline.reviewNote")}
              </p>
            </div>{" "}
            <div className="creq-timeline">
              <div className={`creq-tlItem ${request ? "done" : ""}`}>
                <div className="creq-tlDot" />
                <div>
                  <div className="creq-tlTitle">
                    {t("creatorRequest.timeline.submitted")}
                  </div>
                  <div className="creq-tlSub">
                    {request
                      ? new Date(request.createdAt).toLocaleString()
                      : "Not yet submitted"}
                  </div>
                </div>
              </div>

              <div
                className={`creq-tlItem ${
                  requestStatus && requestStatus !== "pending"
                    ? "done"
                    : requestStatus === "pending"
                    ? "active"
                    : ""
                }`}
              >
                <div className="creq-tlDot" />
                <div>
                  <div className="creq-tlTitle">
                    {t("creatorRequest.timeline.underReview")}
                  </div>
                  <div className="creq-tlSub">
                    {t("creatorRequest.timeline.byAdmin")}
                  </div>
                </div>
              </div>

              <div
                className={`creq-tlItem ${
                  requestStatus === "approved" ? "done" : ""
                }`}
              >
                <div className="creq-tlDot" />
                <div>
                  <div className="creq-tlTitle">
                    {t("creatorRequest.timeline.approved")}
                  </div>
                  <div className="creq-tlSub">
                    {requestStatus === "approved" && request?.reviewedAt
                      ? new Date(request.reviewedAt).toLocaleString()
                      : t("creatorRequest.timeline.effectNote")}
                  </div>
                </div>
              </div>
            </div>
            <div className="creq-helpBox">
              <div className="creq-helpTitle">
                {t("creatorRequest.needHelp")}
              </div>
              <div className="creq-helpText">
                {t("creatorRequest.helpText")}
              </div>
            </div>{" "}
          </section>
        </div>
      </div>

      <AlertModal
        show={modalState.show}
        onHide={hideAlert}
        title={modalState.title}
        message={modalState.message}
        variant={modalState.variant}
        onConfirm={modalState.onConfirm}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
      />
    </main>
  );
};

export default CreatorRequest;
