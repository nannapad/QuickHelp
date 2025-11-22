import React from "react";
import "./css/AdminDashboard.css";

// mock data: คุณสามารถแทนที่ด้วย data จริงทีหลังได้
const mockStats = {
  totalUsers: 128,
  creators: 32,
  admins: 3,
  manuals: 240,
  pendingRequests: 4,
};

const mockCreatorRequests = [
  {
    id: 101,
    name: "Mint Ch.",
    department: "Design",
    reason: "ต้องการสร้างคู่มือ Brand assets สำหรับทีมทั้งหมด",
    status: "pending",
    createdAt: "2024-11-20",
  },
  {
    id: 102,
    name: "Beam K.",
    department: "IT",
    reason: "รวมคู่มือ setup เครื่องมือสำหรับ developer ใหม่",
    status: "pending",
    createdAt: "2024-11-21",
  },
];

const mockRecentManuals = [
  {
    id: 1,
    title: "HR onboarding checklist (2025)",
    author: "HR Team",
    category: "HR",
    createdAt: "2024-11-21",
    status: "published",
  },
  {
    id: 2,
    title: "Security guideline – Internal tools",
    author: "IT Sec",
    category: "IT",
    createdAt: "2024-11-19",
    status: "review",
  },
];

const AdminDashboard = () => {
  return (
    <main className="ad-page">
      <div className="ad-inner">
        <header className="ad-header">
          <div>
            <h1 className="ad-title">Admin dashboard</h1>
            <p className="ad-sub">
              ภาพรวมผู้ใช้ คู่มือทั้งหมด และคำขอสิทธิ์ Creator ในองค์กรของคุณ
            </p>
          </div>
          <div className="ad-headerRight">
            <button
              className="ad-btn ghost"
              onClick={() => alert("Mock: export report")}
            >
              Export report
            </button>
          </div>
        </header>

        {/* Top stats */}
        <section className="ad-statsGrid">
          <div className="ad-statCard">
            <div className="ad-statLabel">Users</div>
            <div className="ad-statValue">{mockStats.totalUsers}</div>
            <div className="ad-statSub">
              Creators: {mockStats.creators} • Admin: {mockStats.admins}
            </div>
          </div>

          <div className="ad-statCard">
            <div className="ad-statLabel">Manuals</div>
            <div className="ad-statValue">{mockStats.manuals}</div>
            <div className="ad-statSub">คู่มือทั้งหมดในระบบ</div>
          </div>

          <div className="ad-statCard ad-statAccent">
            <div className="ad-statLabel">Creator requests</div>
            <div className="ad-statValue">{mockStats.pendingRequests}</div>
            <div className="ad-statSub">คำขอที่กำลังรอการอนุมัติ</div>
          </div>
        </section>

        <div className="ad-mainGrid">
          {/* Creator request queue */}
          <section className="ad-card">
            <div className="ad-cardHeader">
              <h2 className="ad-cardTitle">Creator requests</h2>
              <span className="ad-cardMeta">
                {mockStats.pendingRequests} pending
              </span>
            </div>

            <div className="ad-requestList">
              {mockCreatorRequests.map((r) => (
                <div key={r.id} className="ad-requestItem">
                  <div className="ad-requestMain">
                    <div className="ad-requestName">{r.name}</div>
                    <div className="ad-requestMeta">
                      {r.department} • requested {r.createdAt}
                    </div>
                    <div className="ad-requestReason">{r.reason}</div>
                  </div>
                  <div className="ad-requestActions">
                    <button
                      className="ad-btn ghost"
                      onClick={() =>
                        alert(`Mock: ดูรายละเอียดคำขอ #${r.id}`)
                      }
                    >
                      View
                    </button>
                    <button
                      className="ad-btn approve"
                      onClick={() =>
                        alert(`Mock: Approve request #${r.id}`)
                      }
                    >
                      Approve
                    </button>
                    <button
                      className="ad-btn reject"
                      onClick={() =>
                        alert(`Mock: Reject request #${r.id}`)
                      }
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}

              {mockCreatorRequests.length === 0 && (
                <div className="ad-empty">
                  ยังไม่มีคำขอใหม่ ทุกคำขอที่อนุมัติแล้วจะถูกบันทึกในระบบ
                </div>
              )}
            </div>
          </section>

          {/* Manual overview & user snapshot */}
          <section className="ad-card">
            <div className="ad-cardHeader">
              <h2 className="ad-cardTitle">Recent manuals</h2>
            </div>

            <div className="ad-table">
              <div className="ad-tableHead">
                <span>Title</span>
                <span>Author</span>
                <span>Category</span>
                <span>Status</span>
              </div>

              {mockRecentManuals.map((m) => (
                <button
                  key={m.id}
                  className="ad-tableRow"
                  onClick={() => (window.location.href = `/manual/${m.id}`)}
                >
                  <span className="ad-tableTitle">{m.title}</span>
                  <span className="ad-tableAuthor">{m.author}</span>
                  <span className="ad-tableCategory">{m.category}</span>
                  <span className={`ad-statusPill ad-${m.status}`}>
                    {m.status}
                  </span>
                </button>
              ))}

              {mockRecentManuals.length === 0 && (
                <div className="ad-empty">
                  ยังไม่มีคู่มือที่ถูกสร้างหรืออัปเดตในช่วงนี้
                </div>
              )}
            </div>

            <div className="ad-divider" />

            <div className="ad-cardHeader">
              <h2 className="ad-cardTitle">User snapshot</h2>
            </div>
            <ul className="ad-list">
              <li>
                <span className="ad-dot" />
                มีผู้ใช้ใหม่ 8 คนในสัปดาห์นี้
              </li>
              <li>
                <span className="ad-dot" />
                5 manuals ถูกแก้ไขใน 24 ชั่วโมงที่ผ่านมา
              </li>
              <li>
                <span className="ad-dot" />
                2 creator ถูกเพิ่มจากคำขอในสัปดาห์นี้
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;