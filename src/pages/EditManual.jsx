import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "../utils/translations";
import { useAlertModal } from "../hooks/useAlertModal";
import AlertModal from "../components/AlertModal";
import { addNotification } from "../utils/notifications";
import { notifyBookmarkedUsers } from "../utils/manualInteractions";
import { getAllUsers } from "../data/UserData";
import manuals from "../data/ManualData";
import "./css/EditManual.css";

const EditManual = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const editId = id || searchParams.get("edit");
  const { modalState, showAlert, hideAlert } = useAlertModal();

  const [isLoading, setIsLoading] = useState(true);
  const [manual, setManual] = useState(null);

  // Form states - matching CreateManual exactly
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

  // Load manual data on component mount
  useEffect(() => {
    const loadManual = () => {
      try {
        // Check if user is authenticated and has creator/admin role
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
        } // Find the manual to edit from both static and custom manuals
        // Check custom manuals FIRST so edited versions override static ones
        const customManuals = JSON.parse(
          localStorage.getItem("customManuals") || "[]"
        );
        // Filter out static manuals that have been customized (prevent duplicates)
        const customIds = new Set(customManuals.map((m) => m.id));
        const staticManuals = manuals.filter((m) => !customIds.has(m.id));
        const allManuals = [...customManuals, ...staticManuals];

        // Handle both string and number IDs
        const manualToEdit = allManuals.find((m) => {
          return String(m.id) === String(editId) || m.id === parseInt(editId);
        });
        if (!manualToEdit) {
          showAlert(t("editManual.notFound") || "Manual not found!", "error");
          setTimeout(() => navigate("/creator-dashboard"), 1500);
          return;
        }

        // Check if user has permission to edit this manual
        const userFullName = `${currentUser.firstName} ${currentUser.lastName}`;
        if (
          currentUser.role !== "admin" &&
          manualToEdit.author !== userFullName &&
          manualToEdit.author !== currentUser.username
        ) {
          showAlert(
            t("editManual.noPermission") ||
              "You don't have permission to edit this manual!",
            "error"
          );
          setTimeout(() => navigate("/creator-dashboard"), 1500);
          return;
          return;
        } // Pre-populate form with manual data
        setManual(manualToEdit);
        setTitle(manualToEdit.title || "");
        setDesc(manualToEdit.description || "");
        setCategory(manualToEdit.category || "IT");
        setTags(manualToEdit.tags || []);

        console.log("✅ Manual loaded successfully:", {
          id: manualToEdit.id,
          title: manualToEdit.title,
          status: manualToEdit.status,
          hasBlocks: !!manualToEdit.blocks,
          hasSections: !!manualToEdit.sections,
        });

        // Set existing thumbnail if available
        if (manualToEdit.thumbnail) {
          setThumbnailUrl(manualToEdit.thumbnail);
          // Extract filename from URL if possible
          const urlParts = manualToEdit.thumbnail.split("/");
          setThumbName(urlParts[urlParts.length - 1]);
        } // Extract version from meta if available
        let extractedVersion = "1.0";
        if (manualToEdit.version) {
          extractedVersion = manualToEdit.version;
        } else if (manualToEdit.meta) {
          const versionMatch = manualToEdit.meta.match(/v(\d+\.\d+)/);
          if (versionMatch) {
            extractedVersion = versionMatch[1];
          }
        }
        setVersion(extractedVersion);

        // Initialize blocks
        let initialBlocks = [];

        // 1. If manual has 'blocks' (new format), use them
        if (manualToEdit.blocks && manualToEdit.blocks.length > 0) {
          initialBlocks = manualToEdit.blocks;
        }
        // 2. If manual has 'sections' (old format), convert to blocks
        else if (manualToEdit.sections && manualToEdit.sections.length > 0) {
          let blockIdCounter = 1;
          initialBlocks = manualToEdit.sections.flatMap((section) => [
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
        }
        // 3. Fallback for empty manual
        else {
          initialBlocks = [
            {
              id: 1,
              type: "text",
              value: manualToEdit.description || "",
              showToolbar: false,
            },
          ];
        }
        setBlocks(initialBlocks);
      } catch (error) {
        console.error("Error loading manual:", error);
        navigate("/creator-dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    loadManual();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId]);
  // Functions matching CreateManual exactly
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

    console.log("💾 Saving as draft...", { editId, title });

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
    const updatedManual = {
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
      fileInfo: manualFileName || manual.fileInfo, // Preserve or update file info
      status: "draft", // Save as draft
    };
    try {
      const customManuals = JSON.parse(
        localStorage.getItem("customManuals") || "[]"
      );
      const customIndex = customManuals.findIndex(
        (m) => String(m.id) === String(editId) || m.id === parseInt(editId)
      );

      if (customIndex !== -1) {
        customManuals[customIndex] = updatedManual;
      } else {
        customManuals.push(updatedManual);
      }
      localStorage.setItem("customManuals", JSON.stringify(customManuals));

      console.log("Manual saved as draft:", updatedManual); // Dispatch custom event to notify other components
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

    console.log("📝 Updating manual...", {
      editId,
      title,
      status: manual?.status,
    });

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
    } // Determine status based on user role and current manual status
    let newStatus;
    if (currentUser?.role === "admin") {
      // Admin: keep manual published (or preserve existing status)
      newStatus =
        manual.status === "draft" ? "published" : manual.status || "published";
    } else if (currentUser?.role === "creator") {
      // Creator: if editing a published manual, set to pending for re-approval
      // If editing a draft or pending, keep current status
      if (manual.status === "published") {
        newStatus = "pending";
      } else {
        newStatus = manual.status || "pending";
      }
    } else {
      // Fallback: preserve status
      newStatus = manual.status || "published";
    } // Preserve original author when admin edits creator's manual
    const originalAuthor = manual.author || authorName;

    // Helper function to normalize version strings
    const normalizeVersion = (v) => {
      return (
        String(v || "")
          .trim()
          .replace(/^v/i, "") || "1.0"
      );
    };

    // Track old version for notification purposes
    const oldVersion = normalizeVersion(manual.version);
    const newVersion = normalizeVersion(version);

    // Build version history
    const existingVersions = manual.versions || [oldVersion];
    let newVersions = [...existingVersions];
    if (!existingVersions.includes(newVersion)) {
      newVersions.push(newVersion);
    }

    const updatedManual = {
      ...manual,
      title,
      description: desc,
      category,
      version: newVersion,
      versions: newVersions,
      meta: `${category} • v${newVersion}`,
      tags,
      author: originalAuthor, // Keep original author
      updatedBy: currentUser
        ? `${currentUser.firstName} ${currentUser.lastName}`
        : undefined,
      updatedAt: new Date().toISOString().split("T")[0],
      difficulty: manual.difficulty || "Beginner",
      estimatedTime: manual.estimatedTime || "10 min",
      thumbnail: thumbnailUrl || manual.thumbnail,
      blocks,
      fileInfo: manualFileName || manual.fileInfo, // Preserve or update file info
      status: newStatus,
    };

    try {
      // Only save to customManuals (don't modify static manuals array)
      const existingManuals = JSON.parse(
        localStorage.getItem("customManuals") || "[]"
      );
      const customIndex = existingManuals.findIndex(
        (m) => String(m.id) === String(editId) || m.id === parseInt(editId)
      );

      if (customIndex !== -1) {
        // Update existing entry
        existingManuals[customIndex] = updatedManual;
      } else {
        // Add new entry (editing a static manual for first time)
        existingManuals.push(updatedManual);
      }
      localStorage.setItem("customManuals", JSON.stringify(existingManuals));
      console.log("Manual updated:", updatedManual);

      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event("manualUpdated"));

      // Notify users who bookmarked this manual (only if version changed)
      if (oldVersion !== newVersion) {
        console.log(
          `Version changed from ${oldVersion} to ${newVersion}, notifying bookmarked users`
        );
        notifyBookmarkedUsers(editId, title);
      } else {
        console.log(
          `Version unchanged (${oldVersion}), skipping bookmark notifications`
        );
      } // Notify admins if creator changed status from published to pending
      if (
        currentUser?.role === "creator" &&
        manual.status === "published" &&
        newStatus === "pending"
      ) {
        const allUsers = getAllUsers();
        const admins = allUsers.filter((u) => u.role === "admin");
        admins.forEach((admin) => {
          addNotification({
            userId: String(admin.id),
            message: `Manual "${title}" by ${originalAuthor} updated and needs re-approval`,
            type: "info",
            link: "/admin-dashboard",
          });
        });
      }

      if (currentUser?.role === "admin") {
        showAlert(
          "Manual updated successfully! Redirecting to manual page...",
          "success"
        );
        setTimeout(() => {
          navigate(`/manual/${editId}`);
        }, 1000);
      } else {
        showAlert(
          "Manual updated successfully! Redirecting to dashboard...",
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

  if (isLoading) {
    return (
      <div className="root">
        <div className="page">
          <div className="loading-state">
            <h2>{t("editManual.loading") || "Loading manual..."}</h2>
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
            <h2>{t("editManual.notFound") || "Manual not found"}</h2>
            <button onClick={() => navigate("/creator-dashboard")}>
              {t("editManual.backToDashboard") || "Back to Dashboard"}
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
        </section>{" "}
        {/* RIGHT: META PANEL */}
        <aside className="meta-panel">
          <div className="meta-card">
            <div className="meta-title">{t("editManual.manualDetails")}</div>
            <div className="meta-caption">
              {t("editManual.manualDetailsCaption")}
            </div>
            {/* Thumbnail */}
            <div className="meta-field-label">
              {t("editManual.thumbnailLabel")}
            </div>
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
                : manual?.fileInfo
                ? `📎 ${
                    typeof manual.fileInfo === "object"
                      ? manual.fileInfo.name
                      : manual.fileInfo
                  }`
                : "📎 Upload manual file"}
            </label>{" "}
            {(manualFileName || manual?.fileInfo) && (
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  marginTop: "4px",
                }}
              >
                {(() => {
                  const fileInfo = manualFileName || manual.fileInfo;
                  if (typeof fileInfo === "object") {
                    return `${(fileInfo.size / 1024).toFixed(1)} KB • ${
                      fileInfo.type || "Unknown type"
                    }`;
                  }
                  return "File uploaded";
                })()}
              </div>
            )}
            <p className="meta-note">
              เนื้อหาในหน้านี้เป็นเพียงเกริ่นนำและตัวอย่างบางส่วน
              ผู้ใช้สามารถกดดาวน์โหลดไฟล์ด้านบนเพื่ออ่านคู่มือฉบับเต็มได้
            </p>{" "}
            <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
              <button
                type="button"
                className="draft-btn"
                onClick={handleSaveDraft}
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
                💾 {t("editManual.saveAsDraft") || "Save as Draft"}
              </button>
              <button
                type="button"
                className="publish-btn"
                onClick={handleSubmit}
                style={{ flex: 1 }}
              >
                {t("editManual.updateManual") || "Update Manual"}
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

export default EditManual;
