import React from "react";
import "./css/CreatorDashboard.css";

// ถ้าคุณมี ManualData จริงอยู่แล้วสามารถ import มาตรงนี้ได้
// import manuals from "../data/ManualData";

const mockManuals = [
  {
    id: 1,
    title: "VS Code setup for new developers",
    category: "IT",
    status: "published",
    updatedAt: "2024-11-20",
    views: 482,
  },
  {
    id: 2,
    title: "Onboarding checklist – Developer",
    category: "HR",
    status: "draft",
    updatedAt: "2024-11-18",
    views: 0,
  },
  {
    id: 3,
    title: "Brand asset basic guideline",
    category: "Design",
    status: "published",
    updatedAt: "2024-11-15",
    views: 210,
  },
];

const CreatorDashboard = () => {
  const published = mockManuals.filter((m) => m.status === "published");
  const drafts = mockManuals.filter((m) => m.status === "draft");
  const totalViews = published.reduce((sum, m) => sum + (m.views || 0), 0);

  return (
    <main className="cd-page">
      <div className="cd-inner">
        <header className="cd-header">
          <div>
            <h1 className="cd-title">Creator dashboard</h1>
            <p className="cd-sub">
              สรุปภาพรวมคู่มือที่คุณสร้าง Draft ที่ยังเขียนไม่เสร็จ และกิจกรรมล่าสุด
            </p>
          </div>
          <button
            className="cd-btn primary"
            onClick={() => (window.location.href = "/create")}
          >
            + Create manual
          </button>
        </header>

        {/* Summary cards */}
        <section className="cd-summaryGrid">
          <div className="cd-summaryCard">
            <div className="cd-summaryLabel">Published manuals</div>
            <div className="cd-summaryValue">{published.length}</div>
            <div className="cd-summarySub">
              คู่มือที่เผยแพร่ให้ทุกคนค้นหาได้แล้ว
            </div>
          </div>
          <div className="cd-summaryCard">
            <div className="cd-summaryLabel">Drafts</div>
            <div className="cd-summaryValue">{drafts.length}</div>
            <div className="cd-summarySub">
              คู่มือที่ยังไม่เผยแพร่ สามารถกลับมาเขียนต่อได้
            </div>
          </div>
          <div className="cd-summaryCard">
            <div className="cd-summaryLabel">Total views</div>
            <div className="cd-summaryValue">{totalViews}</div>
            <div className="cd-summarySub">
              ยอดรวมการเปิดอ่านคู่มือที่คุณสร้าง
            </div>
          </div>
        </section>

        <div className="cd-mainGrid">
          {/* My manuals */}
          <section className="cd-card">
            <div className="cd-cardHeader">
              <h2 className="cd-cardTitle">My manuals</h2>
              <span className="cd-cardMeta">{published.length} published</span>
            </div>

            <div className="cd-table">
              <div className="cd-tableHead">
                <span>Title</span>
                <span>Category</span>
                <span>Last updated</span>
                <span>Views</span>
              </div>

              {published.map((m) => (
                <button
                  key={m.id}
                  className="cd-tableRow"
                  onClick={() => (window.location.href = `/manual/${m.id}`)}
                >
                  <span className="cd-tableTitle">{m.title}</span>
                  <span className="cd-tableCategory">{m.category}</span>
                  <span className="cd-tableDate">{m.updatedAt}</span>
                  <span className="cd-tableViews">{m.views}</span>
                </button>
              ))}

              {published.length === 0 && (
                <div className="cd-empty">
                  ยังไม่มีคู่มือที่เผยแพร่
                  ลองสร้างคู่มือแรกของคุณดูไหม?
                </div>
              )}
            </div>
          </section>

          {/* Drafts & Activity */}
          <section className="cd-card">
            <div className="cd-cardHeader">
              <h2 className="cd-cardTitle">Drafts</h2>
              <span className="cd-cardMeta">{drafts.length} draft</span>
            </div>

            <div className="cd-draftList">
              {drafts.map((m) => (
                <div key={m.id} className="cd-draftItem">
                  <div>
                    <div className="cd-draftTitle">{m.title}</div>
                    <div className="cd-draftMeta">
                      {m.category} • last edited {m.updatedAt}
                    </div>
                  </div>
                  <button
                    className="cd-btn ghost"
                    onClick={() =>
                      alert("ต่อกับหน้า edit manual จริงได้เลยภายหลัง")
                    }
                  >
                    Continue
                  </button>
                </div>
              ))}

              {drafts.length === 0 && (
                <div className="cd-empty">
                  ไม่มี Draft ในตอนนี้ เมื่อคุณกด “Save as draft”
                  ระบบจะแสดงรายการไว้ที่นี่
                </div>
              )}
            </div>

            <div className="cd-divider" />

            <div className="cd-cardHeader">
              <h2 className="cd-cardTitle">Recent activity</h2>
            </div>
            <ul className="cd-activityList">
              <li>
                <span className="cd-dot" />
                มีคอมเมนต์ใหม่ใน{" "}
                <strong>VS Code setup for new developers</strong>
              </li>
              <li>
                <span className="cd-dot" />
                คุณอัปเดตเวอร์ชันคู่มือ{" "}
                <strong>Onboarding checklist – Developer</strong>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
};

export default CreatorDashboard;