import React from "react";
import "./css/Settings.css";
import { useTranslation } from "../utils/translations";
import { useLanguage } from "../contexts/LanguageContext";

const Settings = () => {
  return (
    <main className="settings-page">
      <div className="settings-inner">
        <header className="settings-header">
          <div>
            <h1 className="settings-title">Settings</h1>
            <p className="settings-sub">
              จัดการการแจ้งเตือน, การแสดงผล และข้อมูลบัญชีของคุณใน QuickHelp
            </p>
          </div>
          <div className="settings-badge">
            <span className="settings-dot" />
            <span>Signed in</span>
          </div>
        </header>

        <div className="settings-grid">
          {/* Account */}
          <section className="settings-card">
            <h2 className="settings-card-title">Account</h2>
            <p className="settings-card-sub">
              ข้อมูลบัญชีหลักที่ใช้เข้าสู่ระบบ QuickHelp
            </p>

            <div className="settings-row">
              <div className="settings-row-label">Email</div>
              <div className="settings-row-main">
                <div className="settings-row-text">you@company.com</div>
                <button className="settings-btn ghost">Change email</button>
              </div>
            </div>

            <div className="settings-row">
              <div className="settings-row-label">Password</div>
              <div className="settings-row-main">
                <div className="settings-row-text">••••••••</div>
                <button className="settings-btn ghost">Change password</button>
              </div>
            </div>

            <div className="settings-row">
              <div className="settings-row-label">Organization</div>
              <div className="settings-row-main">
                <div className="settings-row-text">
                  QuickHelp Demo Workspace
                </div>
                <button className="settings-btn ghost">Leave workspace</button>
              </div>
            </div>
          </section>

          {/* Appearance */}
          <section className="settings-card">
            <h2 className="settings-card-title">Appearance</h2>
            <p className="settings-card-sub">
              เลือกธีมและความหนาแน่นของคอนเทนต์ให้เหมาะกับการใช้งานของคุณ
            </p>

            <div className="settings-row">
              <div className="settings-row-label">Theme</div>
              <div className="settings-row-main settings-options">
                <label className="settings-pillOption">
                  <input type="radio" name="theme" defaultChecked />
                  <span>System</span>
                </label>
                <label className="settings-pillOption">
                  <input type="radio" name="theme" />
                  <span>Light</span>
                </label>
                <label className="settings-pillOption">
                  <input type="radio" name="theme" />
                  <span>Dark</span>
                </label>
              </div>
            </div>

            <div className="settings-row">
              <div className="settings-row-label">Density</div>
              <div className="settings-row-main settings-options">
                <label className="settings-pillOption">
                  <input type="radio" name="density" defaultChecked />
                  <span>Comfortable</span>
                </label>
                <label className="settings-pillOption">
                  <input type="radio" name="density" />
                  <span>Compact</span>
                </label>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="settings-card">
            <h2 className="settings-card-title">Notifications</h2>
            <p className="settings-card-sub">
              ควบคุมว่าคุณจะได้รับการแจ้งเตือนอะไรจาก QuickHelp บ้าง
            </p>

            <label className="settings-toggleRow">
              <div>
                <div className="settings-toggle-title">
                  Manual updated (favorite)
                </div>
                <div className="settings-toggle-sub">
                  แจ้งเตือนเมื่อคู่มือที่คุณบันทึกไว้มีเวอร์ชันใหม่
                </div>
              </div>
              <input type="checkbox" defaultChecked />
            </label>

            <label className="settings-toggleRow">
              <div>
                <div className="settings-toggle-title">
                  Comments on my manuals
                </div>
                <div className="settings-toggle-sub">
                  แจ้งเตือนเมื่อมีคอมเมนต์ในคู่มือที่คุณสร้าง
                </div>
              </div>
              <input type="checkbox" defaultChecked />
            </label>

            <label className="settings-toggleRow">
              <div>
                <div className="settings-toggle-title">
                  Product updates & tips
                </div>
                <div className="settings-toggle-sub">
                  อีเมลอัปเดตฟีเจอร์ใหม่และเทคนิคการใช้งาน
                </div>
              </div>
              <input type="checkbox" />
            </label>
          </section>

          {/* Danger zone */}
          <section className="settings-card danger">
            <h2 className="settings-card-title">Danger zone</h2>
            <p className="settings-card-sub">
              การกระทำเหล่านี้อาจมีผลกับการเข้าถึงข้อมูลของคุณ
              โปรดใช้อย่างระมัดระวัง
            </p>

            <div className="settings-row">
              <div>
                <div className="settings-toggle-title">Delete Account</div>
                <div className="settings-toggle-sub">
                  ลบบัญชีถาวร คุณจะไม่สามารถเข้าสู่ระบบ
                  QuickHelp ได้
                </div>
              </div>
              <button className="settings-btn danger">Delete Account</button>
            </div>
          </section>
        </div>

        <footer className="settings-footer">
          <button
            className="settings-btn primary"
            onClick={() => alert("Mock: saved settings ✨")}
          >
            Save changes
          </button>
          <button className="settings-btn ghost">Reset</button>
        </footer>
      </div>
    </main>
  );
};

export default Settings;
