// src/pages/ManualDetail.jsx
import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./css/ManualDetail.module.css";

import manuals from "../data/ManualData";
import commentsData from "../data/CommentData";

const ManualDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const manual = useMemo(() => {
    if (!manuals || manuals.length === 0) return null;
    return manuals.find((m) => String(m.id) === String(id)) || manuals[0];
  }, [id]);

  const relatedManuals = useMemo(() => {
    if (!manuals || !manual) return [];
    return manuals
      .filter(
        (m) =>
          m.id !== manual.id &&
          (m.category === manual.category ||
            m.tags?.some((t) => manual.tags?.includes(t)))
      )
      .slice(0, 3);
  }, [manual]);

  const comments = useMemo(() => {
    if (!commentsData || !manual) return [];
    return commentsData.filter(
      (c) => String(c.manualId) === String(manual.id)
    );
  }, [manual]);


  if (!manual) {
    return (
      <main className={styles.manualPage}>
        <div className={styles.manualPageInner}>
          <p>Manual not found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.manualPage}>
      <div className={styles.manualPageInner}>

        {/* BREADCRUMB */}
        <div className={styles.breadcrumbRow}>
          <button
            className={styles.backLink}
            type="button"
            onClick={() => navigate(-1)}
          >
            ← กลับไปหน้าก่อนหน้า
          </button>

          <div className={styles.breadcrumb}>
            {manual.breadcrumb || manual.category}
            {manual.subCategory ? ` • ${manual.subCategory}` : ""}
          </div>
        </div>

        <div className={styles.grid}>
          {/* LEFT CONTENT */}
          <article className={styles.left}>
            <header className={styles.header}>
              <h1 className={styles.title}>{manual.title}</h1>

              <div className={styles.metaTop}>
                <span>
                  โดย <strong>{manual.author || "it.suda"}</strong>
                </span>
                {manual.updatedAt && (
                  <>
                    <span className={styles.dot}>•</span>
                    <span>อัปเดตล่าสุด {manual.updatedAt}</span>
                  </>
                )}
                {manual.readingTime && (
                  <>
                    <span className={styles.dot}>•</span>
                    <span>ประมาณการอ่าน {manual.readingTime}</span>
                  </>
                )}
              </div>
            </header>

            {/* HERO */}
            <div className={styles.hero}>
              <div className={styles.heroFooter}>
                <div className={styles.heroMeta}>
                  {manual.category}
                  {manual.subCategory && (
                    <>
                      <span className={styles.heroDot}>•</span>
                      <span>{manual.subCategory}</span>
                    </>
                  )}
                </div>

                <div className={styles.heroTitle}>
                  {manual.previewTitle || manual.title}
                </div>
                <div className={styles.heroBadge}>Manual preview</div>
              </div>
            </div>

            {/* NOTE */}
            <div className={styles.noteBar}>
              <span className={styles.noteIcon}>ℹ</span>
              <span className={styles.noteText}>
                เนื้อหาส่วนนี้เป็นภาพรวมจากคู่มือฉบับเต็ม — 
                สามารถกด <strong>Download manual</strong> ด้านขวา
                เพื่อดูรายละเอียดทั้งหมดได้
              </span>
            </div>

            {/* CONTENT */}
            <section className={styles.section}>
              <p className={styles.text}>
                {manual.intro ||
                  "คู่มือนี้สรุปขั้นตอนการติดตั้งและตั้งค่าเครื่องมือสำหรับทีมของคุณแบบย่อ เน้นสิ่งที่ต้องทำจริงในโปรเจค"}
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>สารบัญ</h2>
              <ul className={styles.tocList}>
                <li>1. ติดตั้ง VS Code</li>
                <li>2. การตั้งค่าครั้งแรก</li>
                <li>3. แนะนำ Workspace ของทีม</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>1. ติดตั้ง VS Code</h2>
              <p className={styles.text}>
                สำหรับผู้ใช้ Windows แนะนำให้ดาวน์โหลดจาก Microsoft โดยตรง…
              </p>
            </section>
          </article>

          {/* RIGHT SIDEBAR */}
          <aside className={styles.right}>

            {/* DOWNLOAD */}
            <section className={styles.card}>
              <h3 className={styles.cardTitle}>Download manual</h3>
              <p className={styles.cardDesc}>
                ดาวน์โหลดไฟล์คู่มือฉบับเต็มสำหรับเก็บไว้ใช้งาน หรือส่งต่อให้ทีม
              </p>

              <button 
                type="button" 
                className={`${styles.btn} ${styles.primary} ${styles.full}`}
              >
                ↓ Download manual (PDF)
              </button>

              <p className={styles.fileInfo}>
                ไฟล์: {manual.fileName || "VSCode-Setup-v1.3.pdf"}<br/>
                ขนาด: {manual.fileSize || "2.4 MB"} • {manual.pageCount || "18"} หน้า
              </p>
            </section>

            {/* MANUAL INFO */}
            <section className={styles.card}>
              <h3 className={styles.cardTitle}>Manual info</h3>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Category</span>
                <span className={styles.infoValue}>{manual.category}</span>
              </div>

              {manual.subCategory && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Sub</span>
                  <span className={styles.infoValue}>{manual.subCategory}</span>
                </div>
              )}

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Version</span>
                <span className={styles.infoValue}>{manual.version}</span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Language</span>
                <span className={styles.infoValue}>
                  {manual.language?.toUpperCase()}
                </span>
              </div>
            </section>

            {/* TAGS */}
            <section className={styles.card}>
              <h3 className={styles.cardTitle}>Tags</h3>

              <div className={styles.tagsRow}>
                {(manual.tags || []).map((tag) => (
                  <span key={tag} className={styles.tagChip}>{tag}</span>
                ))}

                {(manual.tags?.length === 0) && (
                  <p className={styles.empty}>ยังไม่มีแท็ก</p>
                )}
              </div>
            </section>

            {/* RELATED */}
            <section className={styles.card}>
              <h3 className={styles.cardTitle}>Related manuals</h3>
              <p className={styles.cardDescSmall}>
                คู่มือที่ใกล้เคียง / อยู่หมวดเดียวกัน
              </p>

              {relatedManuals.length === 0 && (
                <div className={styles.empty}>ไม่มีคู่มืออื่นในหมวดนี้</div>
              )}

              {relatedManuals.map((m) => (
                <button 
                  key={m.id}
                  className={styles.relatedItem}
                  onClick={() => navigate(`/manual/${m.id}`)}
                >
                  <div className={styles.relatedTitle}>{m.title}</div>
                  <div className={styles.relatedMeta}>
                    {m.category} • v{m.version}
                  </div>
                </button>
              ))}
            </section>

            {/* COMMENTS */}
            <section className={styles.card}>
              <h3 className={styles.cardTitle}>Comments</h3>

              <textarea
                className={styles.commentInput}
                rows={3}
                placeholder="เขียนความคิดเห็น..."
              />

              <button 
                className={`${styles.btn} ${styles.primary} ${styles.full}`}
              >
                ส่งความคิดเห็น
              </button>

              <div className={styles.commentList}>
                {comments.map((c) => (
                  <div key={c.id} className={styles.commentRow}>
                    <div className={styles.commentAvatar}>
                      {c.author?.[0]?.toUpperCase()}
                    </div>

                    <div className={styles.commentContent}>
                      <div className={styles.commentHeader}>
                        <span className={styles.commentAuthor}>{c.author}</span>
                        <span className={styles.commentTime}>{c.createdAt}</span>
                      </div>
                      <p className={styles.commentText}>{c.text}</p>
                    </div>
                  </div>
                ))}

                {comments.length === 0 && (
                  <div className={styles.empty}>ยังไม่มีความคิดเห็น</div>
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default ManualDetail;
