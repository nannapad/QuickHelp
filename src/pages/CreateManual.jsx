import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../utils/translations";
import { useAlertModal } from "../hooks/useAlertModal";
import AlertModal from "../components/AlertModal";
import { addNotification } from "../utils/notifications";
import { getAllUsers } from "../data/UserData";
import "./css/CreateManual.css";

const CreateManual = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { modalState, showAlert, hideAlert } = useAlertModal();

  // Form states
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [blocks, setBlocks] = useState([
    { id: 1, type: "text", value: "", showToolbar: false },
  ]);
  const [thumbName, setThumbName] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [manualFileName, setManualFileName] = useState(null);
  const [category, setCategory] = useState("IT");
  const [version, setVersion] = useState("");
  const [language, setLanguage] = useState("EN");
  const [tags, setTags] = useState([]);

  const addBlock = (type = "text") => {
    // Generate a unique ID based on current timestamp + random number
    const newId = Date.now() + Math.floor(Math.random() * 1000);

    setBlocks((prev) => [
      ...prev,
      {
        id: newId,
        type,
        value: "",
        imageFile: null,
        imageUrl: "",
        showToolbar: false,
      },
    ]);
  };

  const toggleToolbar = (id) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, showToolbar: !b.showToolbar } : b))
    );
  };

  const changeBlockType = (id, type) => {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, type, value: type === "image" ? "" : b.value } : b
      )
    );
  };
  const changeBlockValue = (id, value) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, value } : b)));
  };
  const deleteBlock = (id) => {
    // Don't allow deleting if only one block remains
    if (blocks.length <= 1) {
      showAlert("You must have at least one block in your manual.", "warning");
      return;
    }
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };
  const handleImageUpload = (id, file) => {
    if (file) {
      // Convert to data URI for persistence instead of blob URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setBlocks((prev) =>
          prev.map((b) =>
            b.id === id
              ? {
                  ...b,
                  imageFile: file,
                  imageUrl: reader.result,
                  value: file.name,
                }
              : b
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (id, url) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, imageUrl: url, value: url } : b))
    );
  };
  const handleThumbnailChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbName(file.name);
      setThumbnailFile(file);

      // Convert to data URI for persistence instead of blob URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleManualFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setManualFileName(file.name);

      // Convert file to data URL for storage
      const reader = new FileReader();
      reader.onloadend = () => {
        // Store file info including data URL
        const fileInfo = {
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl: reader.result,
        };
        // We'll store this in the manual object
        setManualFileName(fileInfo);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagInput = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        e.target.value = "";
      }
    }
  };
  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };
  const handleSaveDraft = () => {
    if (!title.trim()) {
      showAlert("Please enter a manual title", "warning");
      return;
    }

    // Get current user info
    let authorName = "Anonymous";
    let currentUser = null;
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (userData) {
        currentUser = userData;
        authorName = `${userData.firstName} ${userData.lastName}`;
      }
    } catch (e) {
      console.error("Error getting user data", e);
    }

    const normalizedVersion = version?.trim() || "1.0";

    const newManual = {
      id: Date.now(),
      title,
      description: desc,
      category,
      version: normalizedVersion,
      versions: [normalizedVersion],
      meta: `${category} • v${normalizedVersion}`,
      tags,
      views: 0,
      likes: 0,
      downloads: 0,
      author: authorName,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      difficulty: "Beginner",
      estimatedTime: "10 min",
      thumbnail: thumbnailUrl,
      blocks,
      fileInfo: manualFileName, // Store file information
      status: "draft",
    };

    try {
      const existingManuals = JSON.parse(
        localStorage.getItem("customManuals") || "[]"
      );
      const updatedManuals = [...existingManuals, newManual];
      localStorage.setItem("customManuals", JSON.stringify(updatedManuals));

      console.log("Manual saved as draft:", newManual); // Dispatch custom event to notify other components
      window.dispatchEvent(new Event("manualUpdated"));

      showAlert(
        "Manual saved as draft! Redirecting to dashboard...",
        "success"
      );

      setTimeout(() => {
        navigate("/creator-dashboard");
      }, 1000);
    } catch (error) {
      console.error("Error saving manual:", error);
      showAlert("Failed to save manual", "error");
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      showAlert("Please enter a manual title", "warning");
      return;
    }

    // Get current user info
    let authorName = "Anonymous";
    let currentUser = null;
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (userData) {
        currentUser = userData;
        authorName = `${userData.firstName} ${userData.lastName}`;
      }
    } catch (e) {
      console.error("Error getting user data", e);
    } // Determine manual status based on user role
    const manualStatus =
      currentUser?.role === "admin" ? "published" : "pending";

    const normalizedVersion = version?.trim() || "1.0";

    const newManual = {
      id: Date.now(), // Generate a unique ID
      title,
      description: desc,
      category,
      version: normalizedVersion,
      versions: [normalizedVersion],
      meta: `${category} • v${normalizedVersion}`,
      tags,
      views: 0,
      likes: 0,
      downloads: 0,
      author: authorName,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      difficulty: "Beginner", // Default
      estimatedTime: "10 min", // Default
      thumbnail: thumbnailUrl, // Add thumbnail URL
      blocks, // Save blocks directly
      fileInfo: manualFileName, // Store file information
      status: manualStatus, // Set status based on user role
    };

    // Save to LocalStorage
    try {
      const existingManuals = JSON.parse(
        localStorage.getItem("customManuals") || "[]"
      );
      const updatedManuals = [...existingManuals, newManual];
      localStorage.setItem("customManuals", JSON.stringify(updatedManuals));

      console.log("Manual saved:", newManual);

      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event("manualUpdated"));

      // Notify admins if manual is pending
      if (manualStatus === "pending") {
        const allUsers = getAllUsers();
        const admins = allUsers.filter((u) => u.role === "admin");
        admins.forEach((admin) => {
          addNotification({
            userId: admin.id,
            message: `New manual pending approval: "${title}" by ${authorName}`,
            type: "info",
            link: "/admin-dashboard",
          });
        });
      }

      // Role-based navigation
      if (currentUser?.role === "admin") {
        showAlert(
          "Manual published successfully! Redirecting to manual page...",
          "success"
        );
        setTimeout(() => {
          navigate(`/manual/${newManual.id}`);
        }, 1000);
      } else {
        showAlert(
          "Manual created successfully and submitted for approval! Redirecting to dashboard...",
          "success"
        );
        setTimeout(() => {
          navigate("/creator-dashboard");
        }, 1000);
      }
    } catch (error) {
      console.error("Error saving manual:", error);
      showAlert("Failed to save manual", "error");
    }
  };

  const getBlockTextareaClass = (block) => {
    let classes = "block-input";
    if (block.type === "heading") {
      classes += " block-heading";
    } else if (block.type === "quote") {
      classes += " block-quote";
    } else if (block.type === "code") {
      classes += " block-code";
    }
    return classes;
  };
  const renderImageBlock = (block) => {
    // Check if imageUrl is valid (not a stale blob URL)
    const isValidUrl =
      block.imageUrl &&
      (block.imageUrl.startsWith("data:") ||
        block.imageUrl.startsWith("http://") ||
        block.imageUrl.startsWith("https://"));

    return (
      <div className="image-block">
        {isValidUrl ? (
          <div className="image-preview">
            <img
              src={block.imageUrl}
              alt="Preview"
              className="image-preview-img"
              onError={(e) => {
                // Handle broken image gracefully
                e.target.style.display = "none";
                console.warn("Failed to load image:", block.imageUrl);
              }}
            />
            <div className="image-controls">
              <input
                type="text"
                placeholder={t("createManual.blockPlaceholders.image")}
                value={block.value}
                onChange={(e) => {
                  changeBlockValue(block.id, e.target.value);
                  if (e.target.value.startsWith("http")) {
                    handleImageUrlChange(block.id, e.target.value);
                  }
                }}
                className="image-url-input"
              />
              <label className="image-upload-btn">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageUpload(block.id, e.target.files[0])
                  }
                  style={{ display: "none" }}
                />
                {t("createManual.uploadImage")}
              </label>
            </div>
          </div>
        ) : (
          <div className="image-placeholder">
            <div className="image-upload-area">
              <label className="image-upload-label">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageUpload(block.id, e.target.files[0])
                  }
                  style={{ display: "none" }}
                />
                <div className="upload-icon">📷</div>
                <div>{t("createManual.uploadImage")}</div>
              </label>
              <div className="or-divider">{t("common.or")}</div>
              <input
                type="text"
                placeholder={t("createManual.blockPlaceholders.image")}
                value={block.value}
                onChange={(e) => {
                  changeBlockValue(block.id, e.target.value);
                  if (e.target.value.startsWith("http")) {
                    handleImageUrlChange(block.id, e.target.value);
                  }
                }}
                className="image-url-input"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="root">
      <div className="page">
        {/* LEFT: EDITOR PANEL */}
        <section className="editor-panel">
          <input
            className="editor-title"
            placeholder={t("createManual.titlePlaceholder")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="editor-desc"
            rows={2}
            placeholder={t("createManual.contentPlaceholder")}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <div className="editor-divider"></div>
          <div className="blocks">
            {blocks.map((block) => (
              <div
                key={block.id}
                className={`block ${
                  block.showToolbar ? "block-show-toolbar" : ""
                }`}
              >
                {/* plus button */}
                <button
                  type="button"
                  className="block-plus"
                  onClick={() => toggleToolbar(block.id)}
                >
                  +
                </button>

                {/* toolbar */}
                <div className="block-toolbar">
                  <button
                    type="button"
                    className={`toolbar-btn ${
                      block.type === "text" ? "toolbar-btn-active" : ""
                    }`}
                    onClick={() => changeBlockType(block.id, "text")}
                  >
                    T
                  </button>
                  <button
                    type="button"
                    className={`toolbar-btn ${
                      block.type === "heading" ? "toolbar-btn-active" : ""
                    }`}
                    onClick={() => changeBlockType(block.id, "heading")}
                  >
                    H
                  </button>
                  <button
                    type="button"
                    className={`toolbar-btn ${
                      block.type === "quote" ? "toolbar-btn-active" : ""
                    }`}
                    onClick={() => changeBlockType(block.id, "quote")}
                  >
                    ❝
                  </button>
                  <button
                    type="button"
                    className={`toolbar-btn ${
                      block.type === "code" ? "toolbar-btn-active" : ""
                    }`}
                    onClick={() => changeBlockType(block.id, "code")}
                  >
                    {"{ }"}
                  </button>{" "}
                  <button
                    type="button"
                    className={`toolbar-btn ${
                      block.type === "image" ? "toolbar-btn-active" : ""
                    }`}
                    onClick={() => changeBlockType(block.id, "image")}
                  >
                    🖼️
                  </button>
                  <button
                    type="button"
                    className="toolbar-btn toolbar-btn-delete"
                    onClick={() => deleteBlock(block.id)}
                    style={{
                      marginLeft: "auto",
                      color: "#ef4444",
                      borderColor: "#ef4444",
                    }}
                    title="Delete this block"
                  >
                    🗑️
                  </button>
                </div>

                {/* textarea */}
                {block.type === "image" ? (
                  renderImageBlock(block)
                ) : (
                  <textarea
                    className={getBlockTextareaClass(block)}
                    placeholder={
                      block.type === "heading"
                        ? t("createManual.blockPlaceholders.heading")
                        : block.type === "quote"
                        ? t("createManual.blockPlaceholders.quote")
                        : block.type === "code"
                        ? t("createManual.blockPlaceholders.code")
                        : t("createManual.blockPlaceholders.text")
                    }
                    value={block.value}
                    onChange={(e) => changeBlockValue(block.id, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            className="btn-add-block"
            onClick={() => addBlock("text")}
          >
            + {t("createManual.addBlock")}
          </button>
        </section>

        {/* RIGHT: META PANEL */}
        <aside className="meta-panel">
          <div className="meta-card">
            <div className="meta-title">Manual details</div>
            <div className="meta-caption">
              กำหนดหมวดใหญ่ แท็ก และไฟล์คู่มือจริง
            </div>
            {/* Thumbnail */}
            <div className="meta-field-label">Thumbnail</div>
            {thumbnailUrl && (
              <div className="thumbnail-preview">
                <img
                  src={thumbnailUrl}
                  alt="Thumbnail preview"
                  style={{
                    width: "100%",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "8px",
                  }}
                />
              </div>
            )}
            <label className="thumb-box">
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleThumbnailChange}
              />
              {thumbName ? thumbName : "Click to upload thumbnail"}
            </label>
            {/* Category */}
            <div className="meta-field-label">Category (หมวดใหญ่)</div>
            <select
              className="meta-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>IT</option>
              <option>Design</option>
              <option>Marketing</option>
              <option>HR</option>
              <option>Operations</option>
              <option>Customer Support</option>
            </select>
            {/* Tags */}
            <div className="meta-field-label">Tags</div>
            <input
              className="meta-input"
              placeholder="Type tag and press Enter"
              onKeyDown={handleTagInput}
            />
            <div className="tag-box">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="tag-pill"
                  onClick={() => removeTag(tag)}
                  title="Click to remove"
                >
                  {tag} ×
                </span>
              ))}
              {tags.length === 0 && (
                <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                  No tags added yet
                </span>
              )}
            </div>
            {/* Version + Language */}
            <div className="meta-row">
              <div>
                <div className="meta-field-label">Version</div>
                <input
                  className="meta-input"
                  placeholder="เช่น 1.0 หรือ 2.1"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                />
              </div>
              <div>
                <div className="meta-field-label">Language</div>
                <select
                  className="meta-select"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option>TH</option>
                  <option>EN</option>
                </select>
              </div>
            </div>
            {/* Manual file upload */}
            <div className="meta-field-label" style={{ marginTop: 10 }}>
              Manual file (PDF / DOCX / ZIP)
            </div>
            <label className="file-btn">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.zip"
                style={{ display: "none" }}
                onChange={handleManualFileChange}
              />
              {manualFileName
                ? `📎 ${
                    typeof manualFileName === "object"
                      ? manualFileName.name
                      : manualFileName
                  }`
                : "📎 Upload manual file"}
            </label>{" "}
            {manualFileName && typeof manualFileName === "object" && (
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  marginTop: "4px",
                }}
              >
                {(manualFileName.size / 1024).toFixed(1)} KB •{" "}
                {manualFileName.type || "Unknown type"}
              </div>
            )}
            <p className="meta-note">
              เนื้อหาในหน้านี้เป็นเพียงเกริ่นนำและตัวอย่างบางส่วน
              ผู้ใช้สามารถกดดาวน์โหลดไฟล์ด้านบนเพื่ออ่านคู่มือฉบับเต็มได้
            </p>
            <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
              <button
                type="button"
                className="draft-btn"
                onClick={handleSaveDraft}
              >
                💾 Draft
              </button>
              <button
                type="button"
                className="publish-btn"
                onClick={handleSubmit}
                style={{ flex: 1 }}
              >
                Publish
              </button>
            </div>
          </div>{" "}
        </aside>
      </div>

      {/* Alert Modal */}
      <AlertModal
        show={modalState.show}
        onHide={hideAlert}
        title={modalState.title}
        message={modalState.message}
        variant={modalState.variant}
      />
    </div>
  );
};

export default CreateManual;
