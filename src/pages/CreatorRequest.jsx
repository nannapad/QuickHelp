import React, { useEffect, useState } from "react";
import "./css/CreatorRequest.css";
import { useTranslation } from "../utils/translations";
import { addNotification } from "../utils/notifications";
import { addRequest, getRequestByUserId } from "../data/CreatorRequests";

const CreatorRequest = () => {
  const { t } = useTranslation();
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [requestStatus, setRequestStatus] = useState("pending"); // pending | approved | rejected
  const [reviewedNote, setReviewedNote] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("userData");
    const currentUser = raw ? JSON.parse(raw) : null;
    if (!currentUser) return;
    const req = getRequestByUserId(currentUser.id);
    if (req) {
      setHasPendingRequest(req.status === "pending");
      setRequestStatus(req.status);
      setReviewedNote(req.note || "");
    } else {
      setHasPendingRequest(false);
      setRequestStatus("pending");
      setReviewedNote("");
    }
    // listen for external changes
    const onChange = () => {
      const r = getRequestByUserId(currentUser.id);
      if (r) {
        setHasPendingRequest(r.status === "pending");
        setRequestStatus(r.status);
        setReviewedNote(r.note || "");
      } else {
        setHasPendingRequest(false);
        setRequestStatus("pending");
        setReviewedNote("");
      }
    };
    window.addEventListener("creatorRequestsChanged", onChange);
    return () => window.removeEventListener("creatorRequestsChanged", onChange);
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      const raw = localStorage.getItem("userData");
      const currentUser = raw ? JSON.parse(raw) : null;
      if (!currentUser) {
        alert(t("creatorRequest.mustLogin") || "Please log in to submit a request.");
        return;
      }

      // For now we read simple form fields by name from DOM (could be refactored)
      const form = e.target;
      const team = form.querySelector('input[placeholder]')?.value || "";
      const reason = form.querySelector('textarea')?.value || "";
      const types = (form.querySelector('input[type="text"]')?.value || "").split(",").map((s) => s.trim()).filter(Boolean);

      // add a persistent request (status pending)
      const req = addRequest({
        userId: currentUser.id,
        username: currentUser.username,
        team,
        reason,
        types,
      });

      // Create a notification for admins/creators
      addNotification({
        title: "New creator request",
        body: `${currentUser.username} submitted a creator request.`,
        toRoles: ["admin"], // notify admins primarily
        data: { type: "creator_request", requestId: req.id, userId: currentUser.id },
      });

      setHasPendingRequest(true);
      setRequestStatus("pending");

      alert(t("creatorRequest.submit"));
    } catch (err) {
      console.error("Failed to submit creator request", err);
      alert(t("creatorRequest.submitFailed") || "Failed to submit request");
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
              <div className="creq-field">
                <label>{t("creatorRequest.team")}</label>
                <input
                  type="text"
                  placeholder={t("creatorRequest.teamPlaceholder")}
                />
              </div>

              <div className="creq-field">
                <label>{t("creatorRequest.reason")}</label>
                <textarea
                  rows={4}
                  placeholder={t("creatorRequest.reasonPlaceholder")}
                />
              </div>

              <div className="creq-field">
                <label>{t("creatorRequest.manualTypes")}</label>
                <input
                  type="text"
                  placeholder={t("creatorRequest.typesPlaceholder")}
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
            <p className="creq-cardSub">{t("creatorRequest.statusDesc")}</p>
            <div className="creq-statusBox">
              <div className="creq-statusRow">
                <span className="creq-statusLabel">
                  {t("creatorRequest.currentStatus")}
                </span>
                <span className={`creq-statusPill creq-${requestStatus}`}>
                  {requestStatus === "pending" &&
                    t("creatorRequest.statuses.pending")}
                  {requestStatus === "approved" &&
                    t("creatorRequest.statuses.approved")}
                  {requestStatus === "rejected" &&
                    t("creatorRequest.statuses.rejected")}
                </span>
              </div>
              <p className="creq-statusNote">
                {t("creatorRequest.timeline.reviewNote")}
              </p>
            </div>{" "}
            <div className="creq-timeline">
              <div className="creq-tlItem done">
                <div className="creq-tlDot" />
                <div>
                  <div className="creq-tlTitle">
                    {t("creatorRequest.timeline.submitted")}
                  </div>
                  <div className="creq-tlSub">2024-11-20, 10:32</div>
                </div>
              </div>

              <div
                className={`creq-tlItem ${
                  requestStatus !== "pending" ? "done" : "active"
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
                    {t("creatorRequest.timeline.effectNote")}
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
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default CreatorRequest;
