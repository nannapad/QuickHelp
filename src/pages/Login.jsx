// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Tabs,
  Tab,
} from "react-bootstrap";
import "./css/Login.css";
import { useTranslation } from "../utils/translations";
import { authenticateUser } from "../data/UserData";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loginData, setLoginData] = useState({
    emailOrUsername: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  // ---------- handlers ----------

  const handleInputChange = (e, type) => {
    const { name, value } = e.target;
    if (type === "login") {
      setLoginData((prev) => ({ ...prev, [name]: value }));
    } else {
      setRegisterData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!loginData.emailOrUsername || !loginData.password) {
        setError(t("login.fillAllFields"));
        setLoading(false);
        return;
      }

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Attempting login with:", loginData.emailOrUsername);

      // Use mock authentication - now supports both email and username
      const authResult = authenticateUser(
        loginData.emailOrUsername,
        loginData.password
      );

      console.log("Auth result:", authResult);

      if (authResult.success) {
        // Use AuthContext login function to update state properly
        login(authResult.user, authResult.token);

        // Dispatch custom event for navbar to listen
        window.dispatchEvent(new Event("authStateChanged"));

        setSuccess(t("login.welcomeBack"));

        // Clear form
        setLoginData({ emailOrUsername: "", password: "" });

        // Redirect based on user role
        setTimeout(() => {
          if (authResult.user.role === "admin") {
            navigate("/admin-dashboard");
          } else if (authResult.user.role === "creator") {
            navigate("/creator-dashboard");
          } else {
            navigate("/");
          }
        }, 800);
      } else {
        console.error("Login failed:", authResult.message);
        setError(t("login.invalidCredentials"));
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(t("login.loginFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const {
        username,
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
      } = registerData;

      if (
        !username ||
        !email ||
        !password ||
        !confirmPassword ||
        !firstName ||
        !lastName
      ) {
        setError(t("login.fillAllFields"));
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError(t("login.passwordsDontMatch"));
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError(t("login.passwordTooShort"));
        setLoading(false);
        return;
      }

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Mock registration logic
      const newUser = {
        id: Date.now(),
        username,
        email,
        firstName,
        lastName,
        role: "user",
        avatar: null,
        department: "",
        position: "",
        isActive: true,
        preferences: {
          notifications: true,
          darkMode: false,
          emailUpdates: true,
          language: "en",
        },
        stats: {
          manualsViewed: 0,
          manualsDownloaded: 0,
          manualsBookmarked: 0,
          loginCount: 1,
        },
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        permissions: ["view_manuals"],
      };

      // Add user to quickhelp_users in localStorage
      const existingUsers = JSON.parse(
        localStorage.getItem("quickhelp_users") || "[]"
      );
      existingUsers.push(newUser);
      localStorage.setItem("quickhelp_users", JSON.stringify(existingUsers));

      // Store user data and auth token
      localStorage.setItem("userData", JSON.stringify(newUser));
      localStorage.setItem("authToken", "mock_token_" + Date.now());

      // Dispatch custom event for navbar to listen
      window.dispatchEvent(new Event("authStateChanged"));

      setSuccess(t("login.accountCreated"));

      setRegisterData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
      });

      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      console.error("Registration error:", err);
      setError(t("login.registrationFailed"));
    } finally {
      setLoading(false);
    }
  };
  const handleContinueAsGuest = () => {
    // Use AuthContext logout to clear auth state properly
    logout();
    navigate("/");
  };

  // ---------- UI ----------
  return (
    <div className="login-page">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <div className="text-center mb-4">
              <h1 className="login-title">{t("login.title")}</h1>
              <p className="login-subtitle">{t("login.subtitle")}</p>
            </div>

            <Card className="login-card">
              <Card.Body>
                {error && (
                  <Alert variant="danger" className="mb-3">
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert variant="success" className="mb-3">
                    {success}
                  </Alert>
                )}

                <Tabs
                  activeKey={activeTab}
                  onSelect={(key) => key && setActiveTab(key)}
                  className="login-tabs nav-justified"
                  fill
                >
                  {/* --------- LOGIN TAB --------- */}
                  <Tab
                    eventKey="login"
                    title={
                      <span className="tab-title">
                        <i className="fas fa-sign-in-alt"></i>
                        {t("login.signIn")}
                      </span>
                    }
                  >
                    {" "}
                    {activeTab === "login" && (
                      <Form onSubmit={handleLogin} className="mt-3">
                        <Form.Group className="mb-3">
                          <Form.Label>{t("login.emailOrUsername")}</Form.Label>
                          <Form.Control
                            type="text"
                            name="emailOrUsername"
                            placeholder={t("login.emailOrUsernamePlaceholder")}
                            value={loginData.emailOrUsername}
                            onChange={(e) => handleInputChange(e, "login")}
                            required
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>{t("login.password")}</Form.Label>
                          <Form.Control
                            type="password"
                            name="password"
                            placeholder={t("login.passwordPlaceholder")}
                            value={loginData.password}
                            onChange={(e) => handleInputChange(e, "login")}
                            required
                          />
                        </Form.Group>

                        <Button
                          variant="primary"
                          type="submit"
                          className="w-100 login-btn mb-3"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              {t("login.signingIn")}
                            </>
                          ) : (
                            t("login.signIn")
                          )}
                        </Button>
                      </Form>
                    )}
                  </Tab>

                  {/* --------- REGISTER TAB --------- */}
                  <Tab
                    eventKey="register"
                    title={
                      <span className="tab-title">
                        <i className="fas fa-user-plus me-2"></i>
                        {t("login.signUp")}
                      </span>
                    }
                  >
                    {activeTab === "register" && (
                      <Form onSubmit={handleRegister} className="mt-3">
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>{t("login.firstName")}</Form.Label>
                              <Form.Control
                                type="text"
                                name="firstName"
                                placeholder={t("login.firstNamePlaceholder")}
                                value={registerData.firstName}
                                onChange={(e) =>
                                  handleInputChange(e, "register")
                                }
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>{t("login.lastName")}</Form.Label>
                              <Form.Control
                                type="text"
                                name="lastName"
                                placeholder={t("login.lastNamePlaceholder")}
                                value={registerData.lastName}
                                onChange={(e) =>
                                  handleInputChange(e, "register")
                                }
                                required
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Form.Group className="mb-3">
                          <Form.Label>{t("login.username")}</Form.Label>
                          <Form.Control
                            type="text"
                            name="username"
                            placeholder={t("login.usernamePlaceholder")}
                            value={registerData.username}
                            onChange={(e) => handleInputChange(e, "register")}
                            required
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>{t("login.email")}</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            placeholder={t("login.emailPlaceholder")}
                            value={registerData.email}
                            onChange={(e) => handleInputChange(e, "register")}
                            required
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>{t("login.password")}</Form.Label>
                          <Form.Control
                            type="password"
                            name="password"
                            placeholder={t("login.passwordPlaceholder")}
                            value={registerData.password}
                            onChange={(e) => handleInputChange(e, "register")}
                            required
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>{t("login.confirmPassword")}</Form.Label>
                          <Form.Control
                            type="password"
                            name="confirmPassword"
                            placeholder={t("login.confirmPasswordPlaceholder")}
                            value={registerData.confirmPassword}
                            onChange={(e) => handleInputChange(e, "register")}
                            required
                          />
                        </Form.Group>

                        <Button
                          variant="success"
                          type="submit"
                          className="w-100 register-btn mb-3"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              {t("login.creatingAccount")}
                            </>
                          ) : (
                            t("login.createAccount")
                          )}
                        </Button>
                      </Form>
                    )}
                  </Tab>
                </Tabs>

                <div className="text-center mt-4">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={handleContinueAsGuest}
                    className="guest-btn"
                  >
                    {t("login.continueAsGuest")}
                  </Button>
                </div>
              </Card.Body>{" "}
            </Card>

            {/* Demo Credentials Info */}
            <div className="text-center mt-4">
              <div className="demo-credentials-box">
                <small className="text-muted d-block mb-2">
                  <strong>📝 Demo Login Credentials:</strong>
                </small>
                <div className="demo-creds-grid">
                  <small className="text-muted">
                    <strong>Admin:</strong> admin / admin@company.com
                  </small>
                  <small className="text-muted">
                    <strong>Creator:</strong> mariagarcia /
                    maria.garcia@company.com
                  </small>
                  <small className="text-muted">
                    <strong>User:</strong> johndoe / john.doe@company.com
                  </small>
                </div>
                <small className="text-muted d-block mt-2">
                  <em>Password: any text (demo mode)</em>
                </small>
              </div>
            </div>

            <div className="text-center mt-3">
              <small className="text-muted">
                <Link to="/about" className="text-decoration-none">
                  {t("nav.about")}
                </Link>
                {" • "}
                <Link to="/faq" className="text-decoration-none">
                  {t("nav.faq")}
                </Link>
              </small>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
