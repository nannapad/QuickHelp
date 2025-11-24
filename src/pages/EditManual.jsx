import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "../utils/translations";
import manuals from "../data/ManualData";
import styles from "./css/CreateManual.module.css";

const EditManual = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const editId = id || searchParams.get("edit");

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
        }

        // Find the manual to edit
        const manualToEdit = manuals.find((m) => m.id === parseInt(editId));
        if (!manualToEdit) {
          alert(t("editManual.notFound") || "Manual not found!");
          navigate("/creator-dashboard");
          return;
        }

        // Check if user has permission to edit this manual
        const userFullName = `${currentUser.firstName} ${currentUser.lastName}`;
        if (
          currentUser.role !== "admin" &&
          manualToEdit.author !== userFullName &&
          manualToEdit.author !== currentUser.username
        ) {
          alert(
            t("editManual.noPermission") ||
              "You don't have permission to edit this manual!"
          );
          navigate("/creator-dashboard");
          return;
        } // Pre-populate form with manual data
        setManual(manualToEdit);
        setTitle(manualToEdit.title || "");
        setDesc(manualToEdit.description || "");
        setCategory(manualToEdit.category || "IT");
        setTags(manualToEdit.tags || []);

        // Set existing thumbnail if available
        if (manualToEdit.thumbnail) {
          setThumbnailUrl(manualToEdit.thumbnail);
          // Extract filename from URL if possible
          const urlParts = manualToEdit.thumbnail.split("/");
          setThumbName(urlParts[urlParts.length - 1]);
        }

        // Extract version from meta if available
        let extractedVersion = "1.0";
        if (manualToEdit.meta) {
          const versionMatch = manualToEdit.meta.match(/v(\d+\.\d+)/);
          if (versionMatch) {
            extractedVersion = versionMatch[1];
          }
        } else if (manualToEdit.version) {
          extractedVersion = manualToEdit.version;
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
  }, [editId, navigate, t]);

  // Functions matching CreateManual exactly
  const addBlock = (type = "text") => {
    setBlocks((prev) => [
      ...prev,
      {
        id: prev.length ? prev[prev.length - 1].id + 1 : 1,
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

  const handleImageUpload = (id, file) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBlocks((prev) =>
        prev.map((b) =>
          b.id === id
            ? { ...b, imageFile: file, imageUrl: imageUrl, value: file.name }
            : b
        )
      );
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

      // Create URL for preview
      const imageUrl = URL.createObjectURL(file);
      setThumbnailUrl(imageUrl);
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

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("Please enter a manual title");
      return;
    }

    // Get current user info
    let authorName = "Anonymous";
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (userData) {
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
      thumbnail: thumbnailUrl || manual.thumbnail, // Keep existing or use new thumbnail
      blocks, // Save blocks directly
    };

    // Save to LocalStorage
    try {
      // Update in ManualData (static data)
      const manualIndex = manuals.findIndex((m) => m.id === parseInt(editId));
      if (manualIndex !== -1) {
        manuals[manualIndex] = updatedManual;
      }

      // Also save custom manuals
      const existingManuals = JSON.parse(
        localStorage.getItem("customManuals") || "[]"
      );
      const customIndex = existingManuals.findIndex(
        (m) => m.id === parseInt(editId)
      );

      if (customIndex !== -1) {
        existingManuals[customIndex] = updatedManual;
      } else {
        existingManuals.push(updatedManual);
      }

      localStorage.setItem("customManuals", JSON.stringify(existingManuals));

      console.log("Manual updated:", updatedManual);
      alert("Manual updated successfully! Redirecting to dashboard...");

      // Redirect
      setTimeout(() => {
        window.location.href = "/creator-dashboard";
      }, 1000);
    } catch (error) {
      console.error("Error saving manual:", error);
      alert("Failed to save manual");
    }
  };

  const getBlockTextareaClass = (block) => {
    const base = styles["block-input"];
    if (block.type === "heading") {
      return `${base} ${styles["block-heading"]}`;
    }
    if (block.type === "quote") {
      return `${base} ${styles["block-quote"]}`;
    }
    if (block.type === "code") {
      return `${base} ${styles["block-code"]}`;
    }
    return base;
  };

  const renderImageBlock = (block) => {
    return (
      <div className={styles["image-block"]}>
        {block.imageUrl || block.imageFile ? (
          <div className={styles["image-preview"]}>
            <img
              src={block.imageUrl}
              alt="Preview"
              className={styles["image-preview-img"]}
            />
            <div className={styles["image-controls"]}>
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
                className={styles["image-url-input"]}
              />
              <label className={styles["image-upload-btn"]}>
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
          <div className={styles["image-placeholder"]}>
            <div className={styles["image-upload-area"]}>
              <label className={styles["image-upload-label"]}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageUpload(block.id, e.target.files[0])
                  }
                  style={{ display: "none" }}
                />
                <div className={styles["upload-icon"]}>📷</div>
                <div>{t("createManual.uploadImage")}</div>
              </label>
              <div className={styles["or-divider"]}>{t("common.or")}</div>
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
                className={styles["image-url-input"]}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={styles.root}>
        <div className={styles.page}>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <h2>{t("editManual.loading") || "Loading manual..."}</h2>
          </div>
        </div>
      </div>
    );
  }

  if (!manual) {
    return (
      <div className={styles.root}>
        <div className={styles.page}>
          <div style={{ textAlign: "center", padding: "2rem" }}>
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
    <div className={styles.root}>
      <div className={styles.page}>
        {/* LEFT: EDITOR PANEL */}
        <section className={styles["editor-panel"]}>
          <input
            className={styles["editor-title"]}
            placeholder={t("createManual.titlePlaceholder")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className={styles["editor-desc"]}
            rows={2}
            placeholder={t("createManual.contentPlaceholder")}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />

          <div className={styles["editor-divider"]}></div>

          <div className={styles.blocks}>
            {blocks.map((block) => (
              <div
                key={block.id}
                className={`${styles.block} ${
                  block.showToolbar ? styles["block-show-toolbar"] : ""
                }`}
              >
                {/* plus button */}
                <button
                  type="button"
                  className={styles["block-plus"]}
                  onClick={() => toggleToolbar(block.id)}
                >
                  +
                </button>

                {/* toolbar */}
                <div className={styles["block-toolbar"]}>
                  <button
                    type="button"
                    className={`${styles["toolbar-btn"]} ${
                      block.type === "text" ? styles["toolbar-btn-active"] : ""
                    }`}
                    onClick={() => changeBlockType(block.id, "text")}
                  >
                    T
                  </button>
                  <button
                    type="button"
                    className={`${styles["toolbar-btn"]} ${
                      block.type === "heading"
                        ? styles["toolbar-btn-active"]
                        : ""
                    }`}
                    onClick={() => changeBlockType(block.id, "heading")}
                  >
                    H
                  </button>
                  <button
                    type="button"
                    className={`${styles["toolbar-btn"]} ${
                      block.type === "quote" ? styles["toolbar-btn-active"] : ""
                    }`}
                    onClick={() => changeBlockType(block.id, "quote")}
                  >
                    ❝
                  </button>
                  <button
                    type="button"
                    className={`${styles["toolbar-btn"]} ${
                      block.type === "code" ? styles["toolbar-btn-active"] : ""
                    }`}
                    onClick={() => changeBlockType(block.id, "code")}
                  >
                    {"{ }"}
                  </button>
                  <button
                    type="button"
                    className={`${styles["toolbar-btn"]} ${
                      block.type === "image" ? styles["toolbar-btn-active"] : ""
                    }`}
                    onClick={() => changeBlockType(block.id, "image")}
                  >
                    🖼️
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
            className={styles["btn-add-block"]}
            onClick={() => addBlock("text")}
          >
            + {t("createManual.addBlock")}
          </button>
        </section>

        {/* RIGHT: META PANEL */}
        <aside className={styles["meta-panel"]}>
          <div className={styles["meta-card"]}>
            <div className={styles["meta-title"]}>Manual details</div>
            <div className={styles["meta-caption"]}>
              กำหนดหมวดใหญ่ แท็ก และไฟล์คู่มือจริง
            </div>{" "}
            {/* Thumbnail */}
            <div className={styles["meta-field-label"]}>Thumbnail</div>
            {thumbnailUrl && (
              <div className={styles["thumbnail-preview"]}>
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
            <label className={styles["thumb-box"]}>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleThumbnailChange}
              />
              {thumbName ? thumbName : "Click to upload thumbnail"}
            </label>
            {/* Category */}
            <div className={styles["meta-field-label"]}>
              Category (หมวดใหญ่)
            </div>
            <select
              className={styles["meta-select"]}
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
            <div className={styles["meta-field-label"]}>Tags</div>
            <input
              className={styles["meta-input"]}
              placeholder="Type tag and press Enter"
              onKeyDown={handleTagInput}
              style={{ marginBottom: "8px" }}
            />
            <div className={styles["tag-box"]}>
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className={styles["tag-pill"]}
                  onClick={() => removeTag(tag)}
                  style={{ cursor: "pointer" }}
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
            <div className={styles["meta-row"]}>
              <div>
                <div className={styles["meta-field-label"]}>Version</div>
                <input
                  className={styles["meta-input"]}
                  placeholder="เช่น 1.0 หรือ 2.1"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                />
              </div>
              <div>
                <div className={styles["meta-field-label"]}>Language</div>
                <select
                  className={styles["meta-select"]}
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option>TH</option>
                  <option>EN</option>
                </select>
              </div>
            </div>
            {/* Manual file upload */}
            <div
              className={styles["meta-field-label"]}
              style={{ marginTop: 10 }}
            >
              Manual file (PDF / DOCX / ZIP)
            </div>
            <label className={styles["file-btn"]}>
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
            <p className={styles["meta-note"]}>
              เนื้อหาในหน้านี้เป็นเพียงเกริ่นนำและตัวอย่างบางส่วน
              ผู้ใช้สามารถกดดาวน์โหลดไฟล์ด้านบนเพื่ออ่านคู่มือฉบับเต็มได้
            </p>
            <button
              type="button"
              className={styles["publish-btn"]}
              onClick={handleSubmit}
            >
              Update Manual
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default EditManual;
