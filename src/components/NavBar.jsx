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
        if (!user) {
          setUnreadCount(0);
          return;
        }
        // Get notifications from localStorage (for now)
        const itemsRaw = localStorage.getItem("quickhelp_notifications");
        const items = itemsRaw ? JSON.parse(itemsRaw) : [];
        const count = items.filter(
          (n) =>
            n.toRoles.includes(user.role) && !(n.readBy || []).includes(user.id)
        ).length;
        setUnreadCount(count);
      } catch (err) {
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
      navigate("/");
    }
  };

  return (
    <header className="nav">
      <div className="nav-left">
        <Link to="/" className="logo">
          <img src={Logo} alt="QuickHelp Logo" className="logo-image" />
          QuickHelp
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
            </li>
          </ul>
        </nav>
      </div>

      <div className="nav-right">
        <nav className="nav-links">
          <ul>
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
            )}

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
                </Button>

                <div className="profile-menu">
                  {user &&
                    (user.role === "admin" || user.role === "creator") && (
                      <Link to="/dashboard" className="profile-menu-item">
                        Dashboard
                      </Link>
                    )}

                  {/* Create manual button for Creator and Admin */}
                  {user &&
                    (user.role === "admin" || user.role === "creator") && (
                      <Link to="/create-manual" className="profile-menu-item">
                        Create Manual
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
