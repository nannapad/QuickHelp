import React from "react";
import "./css/Profile.css";

const Profile = () => {
  return (
    <main className="profile-page">
      <div className="profile-inner">
        <header className="profile-header">
          <div className="profile-user">
            <div className="profile-avatar">YS</div>
            <div>
              <h1 className="profile-name">Your Name</h1>
              <div className="profile-meta">
                <span>Creator</span>
                <span className="profile-dot">•</span>
                <span>Joined Aug 2024</span>
              </div>
            </div>
          </div>
          <button
            className="profile-btn ghost"
            onClick={() => alert("Mock: switch account")}
          >
            Switch account
          </button>
        </header>

        <div className="profile-grid">
          {/* Left: editable info */}
          <section className="profile-card">
            <h2 className="profile-card-title">Basic info</h2>
            <p className="profile-card-sub">
              ข้อมูลที่ใช้แสดงในคู่มือและคอมเมนต์ต่าง ๆ
            </p>

            <div className="profile-field">
              <label>Display name</label>
              <input type="text" placeholder="Your Name" />
            </div>

            <div className="profile-field">
              <label>Job title</label>
              <input type="text" placeholder="Product Designer" />
            </div>

            <div className="profile-field">
              <label>Department</label>
              <input type="text" placeholder="Design / IT / HR / Marketing" />
            </div>

            <div className="profile-field">
              <label>Short bio</label>
              <textarea
                rows={3}
                placeholder="เขียนแนะนำตัวสั้น ๆ เช่น งานที่ทำ ความถนัด หรือคู่มือที่มักเขียน"
              />
            </div>

            <div className="profile-field">
              <label>Skills / topics</label>
              <input
                type="text"
                placeholder="เช่น VS Code, Onboarding, Brand guideline"
              />
              <p className="profile-hint">
                ใช้เพื่อช่วยให้ทีมรู้ว่าคุณถนัดเขียนคู่มือด้านไหน
              </p>
            </div>

            <div className="profile-actions">
              <button
                className="profile-btn primary"
                onClick={() => alert("Mock: saved profile")}
              >
                Save profile
              </button>
              <button className="profile-btn ghost">Reset</button>
            </div>
          </section>

          {/* Right: summary / readonly */}
          <section className="profile-card">
            <h2 className="profile-card-title">Profile summary</h2>
            <p className="profile-card-sub">
              สรุปภาพรวมการใช้งาน QuickHelp ของคุณ
            </p>

            <div className="profile-statRow">
              <div>
                <div className="profile-stat-label">Manuals created</div>
                <div className="profile-stat-value">12</div>
              </div>
              <div>
                <div className="profile-stat-label">Comments given</div>
                <div className="profile-stat-value">37</div>
              </div>
            </div>

            <div className="profile-statRow">
              <div>
                <div className="profile-stat-label">Most active category</div>
                <div className="profile-stat-value">IT / Tools</div>
              </div>
            </div>

            <div className="profile-divider" />

            <div className="profile-tagsTitle">Recent tags</div>
            <div className="profile-tagsRow">
              <span className="profile-tagChip">vs-code</span>
              <span className="profile-tagChip">onboarding</span>
              <span className="profile-tagChip">checklist</span>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Profile;
