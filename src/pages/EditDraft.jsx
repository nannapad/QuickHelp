import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "../utils/translations";
import { useAlertModal } from "../hooks/useAlertModal";
import AlertModal from "../components/AlertModal";
import manuals from "../data/ManualData";
import "./css/EditManual.css";

const EditDraft = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const editId = id || searchParams.get("edit");
  const { modalState, showAlert, hideAlert } = useAlertModal();

  const [isLoading, setIsLoading] = useState(true);
  const [manual, setManual] = useState(null);

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

  // Load draft manual data
  useEffect(() => {
    const loadDraft = () => {
      try {
        const userData = localStorage.getItem("userData");
        const authToken = localStorage.getItem("authToken");

        if (!userData || !authToken) {
          navigate("/login");
          return;
        }

        const currentUser = JSON.parse(userData);

        if (currentUser.role !== "creator" && currentUser.role !== "admin") {
          navigate("/");
          return;
        }

        if (!editId) {
          navigate("/creator-dashboard");
          return;
        }

        const customManuals = JSON.parse(
          localStorage.getItem("customManuals") || "[]"
        );
        const allManuals = [...customManuals, ...manuals];

        const draftToEdit = allManuals.find((m) => {
          return String(m.id) === String(editId) || m.id === parseInt(editId);
        });

        if (!draftToEdit) {
          showAlert(t("editDraft.notFound") || "Draft not found!", "error");
          setTimeout(() => navigate("/creator-dashboard"), 1500);
          return;
        }

        // Check if it's actually a draft
        if (draftToEdit.status !== "draft") {
          // Redirect to regular edit page if not a draft
          navigate(`/edit-manual/${editId}`);
          return;
        }

        // Check permission
        const userFullName = `${currentUser.firstName} ${currentUser.lastName}`;
        if (
          currentUser.role !== "admin" &&
          draftToEdit.author !== userFullName &&
          draftToEdit.author !== currentUser.username
        ) {
          showAlert(
            t("editDraft.noPermission") ||
              "You don't have permission to edit this draft!",
            "error"
          );
          setTimeout(() => navigate("/creator-dashboard"), 1500);
          return;
        }

        // Pre-populate form
        setManual(draftToEdit);
        setTitle(draftToEdit.title || "");
        setDesc(draftToEdit.description || "");
        setCategory(draftToEdit.category || "IT");
        setTags(draftToEdit.tags || []);

        if (draftToEdit.thumbnail) {
          setThumbnailUrl(draftToEdit.thumbnail);
          const urlParts = draftToEdit.thumbnail.split("/");
          setThumbName(urlParts[urlParts.length - 1]);
        }

        let extractedVersion = "1.0";
        if (draftToEdit.meta) {
          const versionMatch = draftToEdit.meta.match(/v(\d+\.\d+)/);
          if (versionMatch) {
            extractedVersion = versionMatch[1];
          }
        } else if (draftToEdit.version) {
          extractedVersion = draftToEdit.version;
        }
        setVersion(extractedVersion);

        // Initialize blocks
        let initialBlocks = [];
        if (draftToEdit.blocks && draftToEdit.blocks.length > 0) {
          initialBlocks = draftToEdit.blocks;
        } else if (draftToEdit.sections && draftToEdit.sections.length > 0) {
          let blockIdCounter = 1;
          initialBlocks = draftToEdit.sections.flatMap((section) => [
            {
              id: blockIdCounter++,
              type: "heading",
              value: section.title,
              showToolbar: false,
            },
            {
              id: blockIdCounter++,
              type: "text",
              value: section.content,
              showToolbar: false,
            },
          ]);
        } else {
          initialBlocks = [
            {
              id: 1,
              type: "text",
              value: draftToEdit.description || "",
              showToolbar: false,
            },
          ];
        }
        setBlocks(initialBlocks);
      } catch (error) {
        console.error("Error loading draft:", error);
        navigate("/creator-dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    loadDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId]);

  // Block management functions
  const addBlock = (type = "text") => {
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
    if (blocks.length <= 1) {
      showAlert(
        t("editDraft.minBlockWarning") ||
          "You must have at least one block in your manual.",
        "warning"
      );
      return;
    }
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const handleImageUpload = (id, file) => {
    if (file) {
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

      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleManualFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setManualFileName(e.target.files[0].name);
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

  // Update draft (save changes without publishing)
  const handleUpdateDraft = () => {
    if (!title.trim()) {
      showAlert(
        t("editDraft.titleRequired") || "Please enter a manual title",
        "warning"
      );
      return;
    }

    let authorName = "Anonymous";
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (userData) {
        authorName = `${userData.firstName} ${userData.lastName}`;
      }
    } catch (e) {
      console.error("Error getting user data", e);
    }

    const updatedDraft = {
      ...manual,
      title,
      description: desc,
      category,
      meta: `${category} • ${version || "v1.0"}`,
      tags,
      author: authorName,
      updatedAt: new Date().toISOString().split("T")[0],
      difficulty: manual.difficulty || "Beginner",
      estimatedTime: manual.estimatedTime || "10 min",
      thumbnail: thumbnailUrl || manual.thumbnail,
      blocks,
      status: "draft", // Keep as draft
    };

    try {
      const customManuals = JSON.parse(
        localStorage.getItem("customManuals") || "[]"
      );
      const customIndex = customManuals.findIndex(
        (m) => String(m.id) === String(editId) || m.id === parseInt(editId)
      );

      if (customIndex !== -1) {
        customManuals[customIndex] = updatedDraft;
      } else {
        customManuals.push(updatedDraft);
      }

      localStorage.setItem("customManuals", JSON.stringify(customManuals));
      window.dispatchEvent(new Event("manualUpdated"));

      showAlert(
        t("editDraft.draftUpdated") ||
          "Draft updated successfully! Redirecting to dashboard...",
        "success"
      );
      setTimeout(() => {
        navigate("/creator-dashboard");
      }, 1000);
    } catch (error) {
      console.error("Error updating draft:", error);
      showAlert(
        t("editDraft.updateError") || "Failed to update draft",
        "error"
      );
    }
  };

  // Publish draft (change status to pending)
  const handlePublishDraft = () => {
    if (!title.trim()) {
      showAlert(
        t("editDraft.titleRequired") || "Please enter a manual title",
        "warning"
      );
      return;
    }

    let authorName = "Anonymous";
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (userData) {
        authorName = `${userData.firstName} ${userData.lastName}`;
      }
    } catch (e) {
      console.error("Error getting user data", e);
    }

    const publishedManual = {
      ...manual,
      title,
      description: desc,
      category,
      meta: `${category} • ${version || "v1.0"}`,
      tags,
      author: authorName,
      updatedAt: new Date().toISOString().split("T")[0],
      difficulty: manual.difficulty || "Beginner",
      estimatedTime: manual.estimatedTime || "10 min",
      thumbnail: thumbnailUrl || manual.thumbnail,
      blocks,
      status: "pending", // Change to pending for admin approval
    };

    try {
      const customManuals = JSON.parse(
        localStorage.getItem("customManuals") || "[]"
      );
      const customIndex = customManuals.findIndex(
        (m) => String(m.id) === String(editId) || m.id === parseInt(editId)
      );

      if (customIndex !== -1) {
        customManuals[customIndex] = publishedManual;
      } else {
        customManuals.push(publishedManual);
      }

      localStorage.setItem("customManuals", JSON.stringify(customManuals));
      window.dispatchEvent(new Event("manualUpdated"));

      showAlert(
        t("editDraft.publishSuccess") ||
          "Draft published successfully! Waiting for admin approval...",
        "success"
      );
      setTimeout(() => {
        navigate("/creator-dashboard");
      }, 1000);
    } catch (error) {
      console.error("Error publishing draft:", error);
      showAlert(
        t("editDraft.publishError") || "Failed to publish draft",
        "error"
      );
    }
  };

  const getBlockTextareaClass = (block) => {
    let classes = "block-input";
    if (block.type === "heading") classes += " block-heading";
    else if (block.type === "quote") classes += " block-quote";
    else if (block.type === "code") classes += " block-code";
    return classes;
  };

  const renderImageBlock = (block) => {
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
                e.target.style.display = "none";
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

  if (isLoading) {
    return (
      <div className="root">
        <div className="page">
          <div className="loading-state">
            <h2>{t("editDraft.loading") || "Loading draft..."}</h2>
          </div>
        </div>
      </div>
    );
  }

  if (!manual) {
    return (
      <div className="root">
        <div className="page">
          <div className="error-state">
            <h2>{t("editDraft.notFound") || "Draft not found"}</h2>
            <button onClick={() => navigate("/creator-dashboard")}>
              {t("editDraft.backToDashboard") || "Back to Dashboard"}
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                <button
                  type="button"
                  className="block-plus"
                  onClick={() => toggleToolbar(block.id)}
                >
                  +
                </button>

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
                  </button>
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
            <div className="meta-title">
              {t("editDraft.draftDetails") || "Draft Details"}
            </div>
            <div className="meta-caption">
              {t("editDraft.draftCaption") ||
                "Configure your draft before publishing"}
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
                ? `📎 ${manualFileName}`
                : "📎 Upload manual file"}
            </label>

            <p className="meta-note">
              เนื้อหาในหน้านี้เป็นเพียงเกริ่นนำและตัวอย่างบางส่วน
              ผู้ใช้สามารถกดดาวน์โหลดไฟล์ด้านบนเพื่ออ่านคู่มือฉบับเต็มได้
            </p>

            {/* Action Buttons for Draft */}
            <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
              <button
                type="button"
                className="draft-btn"
                onClick={handleUpdateDraft}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: "var(--text)",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                💾 {t("editDraft.updateDraft") || "Update Draft"}
              </button>
              <button
                type="button"
                className="publish-btn"
                onClick={handlePublishDraft}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  color: "#ffffff",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                }}
              >
                📤 {t("editDraft.publishDraft") || "Publish"}
              </button>
            </div>
          </div>
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

export default EditDraft;
