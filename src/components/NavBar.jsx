import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import "./css/NavBar.css";
import Logo from "../assets/logo.svg";
import LanguageSwitcher from "./LanguageSwitcher";
import NotificationDropdown from "./NotificationDropdown";
import ProfileAvatar from "./ProfileAvatar";
import { useTranslation } from "../utils/translations";
import { getUnreadCountForUser } from "../utils/notifications";

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate(); // Check authentication status on component mount and when auth changes
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        // Check localStorage for user data and auth token
        const userData = localStorage.getItem("userData");
        const authToken = localStorage.getItem("authToken");

        if (userData && authToken) {
          const profile = JSON.parse(userData);
          setUser(profile);
          setIsLoggedIn(true);
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setUser(null);
        setIsLoggedIn(false);
      }
    };

    checkAuthStatus();

    // Listen for custom auth events
    const handleAuthChange = () => checkAuthStatus();
    window.addEventListener("authStateChanged", handleAuthChange);

    return () => {
      window.removeEventListener("authStateChanged", handleAuthChange);
    };
  }, []);
  // Notification count effect
  useEffect(() => {
    const updateUnread = () => {
      try {
        if (!user || !user.id) {
          setUnreadCount(0);
          return;
        }
        // Use the notification utility to get unread count
        const count = getUnreadCountForUser(user.id);
        setUnreadCount(count);
      } catch (err) {
        console.error("Error updating notification count:", err);
        setUnreadCount(0);
      }
    };

    updateUnread();
    window.addEventListener("notificationsChanged", updateUnread);
    window.addEventListener("authStateChanged", updateUnread);

    return () => {
      window.removeEventListener("notificationsChanged", updateUnread);
      window.removeEventListener("authStateChanged", updateUnread);
    };
  }, [user]);

  // Dark mode initialization and management
  useEffect(() => {
    // Check localStorage for dark mode preference
    const savedTheme = localStorage.getItem("darkMode");
    const shouldBeDark = savedTheme === "true";

    setIsDarkMode(shouldBeDark);
    document.body.classList.toggle("dark", shouldBeDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.body.classList.toggle("dark", newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
  };
  const handleLogout = () => {
    try {
      // Clear local storage
      localStorage.removeItem("userData");
      localStorage.removeItem("authToken");

      // Update state
      setIsLoggedIn(false);
      setUser(null);
      setShowSidebar(false); // Close sidebar on logout

      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event("authStateChanged"));

      // Redirect to home page after logout
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if there's an error
      localStorage.removeItem("userData");
      localStorage.removeItem("authToken");
      setIsLoggedIn(false);
      setUser(null);
      setShowSidebar(false);
      navigate("/");
    }
  };

  const closeSidebar = () => {
    setShowSidebar(false);
  };

  return (
    <header className="nav">
      {/* Mobile Hamburger Menu */}
      <button
        className="hamburger-menu"
        onClick={() => setShowSidebar(!showSidebar)}
        aria-label="Toggle menu"
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>
      {/* Sidebar Overlay */}
      {showSidebar && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}{" "}
      {/* Mobile Sidebar */}
      <aside className={`mobile-sidebar ${showSidebar ? "open" : ""}`}>
        <div className="sidebar-header">
          <h3 className="sidebar-title">{t("nav.menu")}</h3>
          <button className="sidebar-close" onClick={closeSidebar}>
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          {/* Create Manual Button - First in sidebar for creators/admins */}
          {isLoggedIn &&
            user &&
            (user.role === "admin" || user.role === "creator") && (
              <Link
                to="/create-manual"
                className="sidebar-create-btn"
                onClick={closeSidebar}
              >
                <span className="create-icon">+</span>
                {t("nav.createManual")}
              </Link>
            )}

          {/* Navigation Links */}
          <Link to="/feed" className="sidebar-link" onClick={closeSidebar}>
            <span className="sidebar-icon">📰</span>
            {t("nav.feed")}
          </Link>
          <Link to="/about" className="sidebar-link" onClick={closeSidebar}>
            <span className="sidebar-icon">ℹ️</span>
            {t("nav.about")}
          </Link>
          <Link to="/faq" className="sidebar-link" onClick={closeSidebar}>
            <span className="sidebar-icon">❓</span>
            {t("nav.faq")}
          </Link>

          {/* Separator */}
          {isLoggedIn && <div className="sidebar-separator"></div>}

          {/* User-specific links */}
          {isLoggedIn && (
            <>
              {" "}
              {user && (user.role === "admin" || user.role === "creator") && (
                <Link
                  to="/dashboard"
                  className="sidebar-link"
                  onClick={closeSidebar}
                >
                  <span className="sidebar-icon">📊</span>
                  {t("nav.dashboard")}
                </Link>
              )}
              <Link
                to="/profile"
                className="sidebar-link"
                onClick={closeSidebar}
              >
                <span className="sidebar-icon">👤</span>
                {t("nav.profile")}
              </Link>
              <Link
                to="/settings"
                className="sidebar-link"
                onClick={closeSidebar}
              >
                <span className="sidebar-icon">⚙️</span>
                {t("nav.settings")}
              </Link>
              {user && user.role !== "admin" && user.role !== "creator" && (
                <Link
                  to="/creator-request"
                  className="sidebar-link"
                  onClick={closeSidebar}
                >
                  <span className="sidebar-icon">✍️</span>
                  {t("nav.creatorRequest")}
                </Link>
              )}
              <div className="sidebar-separator"></div>
              <button
                onClick={() => {
                  handleLogout();
                  closeSidebar();
                }}
                className="sidebar-link sidebar-logout"
              >
                <span className="sidebar-icon">🚪</span>
                {t("nav.logout")}
              </button>
            </>
          )}

          {!isLoggedIn && (
            <Link to="/login" className="sidebar-link" onClick={closeSidebar}>
              <span className="sidebar-icon">🔐</span>
              {t("nav.login")}
            </Link>
          )}
        </nav>
      </aside>
      <div className="nav-left">
        <Link to="/" className="logo">
          <img src={Logo} alt="QuickHelp Logo" className="logo-image" />
          uickHelp
        </Link>
        <nav className="nav-links">
          <ul>
            <li>
              <Link to="/feed">
                <Button>{t("nav.feed")}</Button>
              </Link>
            </li>
            <li>
              <Link to="/about">
                <Button>{t("nav.about")}</Button>
              </Link>
            </li>
            <li>
              <Link to="/faq">
                <Button>{t("nav.faq")}</Button>
              </Link>
            </li>{" "}
          </ul>
        </nav>
      </div>
      <div className="nav-right">
        <nav className="nav-links">
          <ul>
            {/* Create manual button for Creator and Admin - visible in navbar */}
            {isLoggedIn &&
              user &&
              (user.role === "admin" || user.role === "creator") && (
                <li>
                  <Link to="/create-manual">
                    <Button className="btn-create-manual">
                      <span className="create-icon">+</span>
                      {t("nav.createManual")}
                    </Button>
                  </Link>
                </li>
              )}
            {/* Only show notifications if user is logged in */}
            {isLoggedIn && (
              <li className="notif-container">
                <Button
                  className="notif-btn"
                  title={t("nav.notifications")}
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  🔔
                  {unreadCount > 0 && (
                    <span className="notif-badge">{unreadCount}</span>
                  )}
                </Button>
                <NotificationDropdown
                  user={user}
                  isOpen={showNotifications}
                  onClose={() => setShowNotifications(false)}
                />
              </li>
            )}
            <li>
              <LanguageSwitcher />
            </li>
            <li>
              {" "}
              <Button
                className="btn-theme"
                title="Toggle theme"
                onClick={toggleDarkMode}
              >
                {isDarkMode ? "☀️" : "🌙"}
              </Button>
            </li>
            {/* Show login button or profile based on auth status */}
            {isLoggedIn ? (
              <li className="profile-dropdown">
                <Button
                  className="btn-profile"
                  title={`Profile: ${user?.username || "User"}`}
                >
                  <ProfileAvatar user={user} size="small" />
                </Button>
                <div className="profile-menu">
                  {/* Dashboard link for Creator and Admin */}
                  {user &&
                    (user.role === "admin" || user.role === "creator") && (
                      <Link to="/dashboard" className="profile-menu-item">
                        {t("nav.dashboard")}
                      </Link>
                    )}

                  <Link to="/profile" className="profile-menu-item">
                    {t("nav.profile")}
                  </Link>

                  <Link to="/settings" className="profile-menu-item">
                    {t("nav.settings")}
                  </Link>

                  {user && user.role !== "admin" && user.role !== "creator" && (
                    <Link to="/creator-request" className="profile-menu-item">
                      {t("nav.creatorRequest")}
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="profile-menu-item logout-btn"
                  >
                    {t("nav.logout")}
                  </button>
                </div>
              </li>
            ) : (
              <li>
                <Link to="/login">
                  <Button className="btn-login">{t("nav.login")}</Button>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
