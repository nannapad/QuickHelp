import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import "./css/NavBar.css";
import Logo from "../assets/logo.svg";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "../utils/translations";

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // notification helpers
  useEffect(() => {
    const updateUnread = () => {
      try {
        const raw = localStorage.getItem("userData");
        const currentUser = raw ? JSON.parse(raw) : null;
        if (!currentUser) {
          setUnreadCount(0);
          return;
        }
        // lazy-load to avoid importing heavy utils here
        const itemsRaw = localStorage.getItem("quickhelp_notifications");
        const items = itemsRaw ? JSON.parse(itemsRaw) : [];
        const count = items.filter((n) => n.toRoles.includes(currentUser.role) && !(n.readBy || []).includes(currentUser.id)).length;
        setUnreadCount(count);
      } catch (err) {
        setUnreadCount(0);
      }
    };

    updateUnread();
    window.addEventListener("notificationsChanged", updateUnread);
    window.addEventListener("authStateChanged", updateUnread);
    window.addEventListener("storage", updateUnread);
    return () => {
      window.removeEventListener("notificationsChanged", updateUnread);
      window.removeEventListener("authStateChanged", updateUnread);
      window.removeEventListener("storage", updateUnread);
    };
  }, []);
  // Check authentication status on component mount
  useEffect(() => {
    const checkAuthStatus = () => {
      // Check localStorage for auth token or user data
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("userData");

      if (token && userData) {
        setIsLoggedIn(true);
        setUser(JSON.parse(userData));
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkAuthStatus();

    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener("storage", checkAuthStatus);

    // Listen for custom auth events (for same-tab changes)
    window.addEventListener("authStateChanged", checkAuthStatus);

    return () => {
      window.removeEventListener("storage", checkAuthStatus);
      window.removeEventListener("authStateChanged", checkAuthStatus);
    };
  }, []);
  // Dark mode initialization and management
  useEffect(() => {
    // Check localStorage for dark mode preference
    const savedTheme = localStorage.getItem("darkMode");

    // Default to light mode instead of system preference
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
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setIsLoggedIn(false);
    setUser(null);

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("authStateChanged"));

    // Redirect to feed page after logout
    navigate("/feed");
  };
  return (
    <header className="nav">
      <div className="nav-left">
        <Link to="/" className="logo">
          <img src={Logo} alt="QuickHelp Logo" className="logo-image" />
          uickHelp
        </Link>{" "}
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
            </li>
          </ul>
        </nav>
      </div>{" "}
      <div className="nav-right">
        <nav className="nav-links">
          <ul>
            {" "}
            {/* Only show notifications if user is logged in */}
            {isLoggedIn && (
              <li>
                <Button className="notif-btn" title={t("nav.notifications")}>
                  🔔
                  {unreadCount > 0 && (
                    <span className="notif-badge">{unreadCount}</span>
                  )}
                </Button>
              </li>
            )} {" "}
            <li>
              <LanguageSwitcher />
            </li>
            <li>
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
                  👤
                </Button>{" "}
                <div className="profile-menu">
                  {user && (user.role === "admin" || user.role === "creator") && (
                    <Link to="/dashboard" className="profile-menu-item">
                      {t("dashboard")}
                    </Link>
                  )}
                  {/* create manual button for Creator and Admin */}
                  <Link to="/create-manual" className="profile-menu-item">
                    {t("Create Manual")}
                  </Link>      
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
