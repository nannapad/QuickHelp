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
import { authenticateUser, createUser } from "../data/UserData";
import "./css/Login.css";
import { useTranslation } from "../utils/translations";

const Login = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loginData, setLoginData] = useState({
    email: "",
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
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (loginData.email && loginData.password) {
        // Use mock authentication
        const authResult = authenticateUser(
          loginData.email,
          loginData.password
        );
        if (authResult.success) {
          // Store user data and auth token
          localStorage.setItem("userData", JSON.stringify(authResult.user));
          localStorage.setItem("authToken", authResult.token);

          // Dispatch custom event to notify NavBar of auth state change
          window.dispatchEvent(new Event("authStateChanged"));
          setSuccess(
            `${t("login.welcomeBack")}, ${authResult.user.firstName}! ${t(
              "login.redirecting"
            )}`
          );
          setTimeout(() => {
            navigate("/feed");
          }, 1500);
        } else {
          setError(authResult.message || t("login.invalidCredentials"));
        }
      } else {
        setError(t("login.fillAllFields"));
      }
    } catch (err) {
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
      // Validate passwords match
      if (registerData.password !== registerData.confirmPassword) {
        setError(t("login.passwordsDontMatch"));
        return;
      }

      if (registerData.password.length < 6) {
        setError(t("login.passwordTooShort"));
        return;
      }

      // Validate required fields
      if (
        !registerData.username ||
        !registerData.email ||
        !registerData.password
      ) {
        setError(t("login.fillAllFields"));
        return;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create user using the new createUser function
      const createResult = createUser({
        username: registerData.username,
        email: registerData.email,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
      });

      if (createResult.success) {
        // Store user data and auth token (auto-login after registration)
        const authToken = "demo-token-" + Date.now();
        localStorage.setItem("userData", JSON.stringify(createResult.user));
        localStorage.setItem("authToken", authToken);

        // Dispatch custom event to notify NavBar of auth state change
        window.dispatchEvent(new Event("authStateChanged"));

        setSuccess(t("login.accountCreated"));
        setTimeout(() => {
          navigate("/feed");
        }, 1500);

        setRegisterData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          firstName: "",
          lastName: "",
        });
      } else {
        setError(
          createResult.message === "Email already exists"
            ? t("login.emailExists")
            : createResult.message === "Username already exists"
            ? t("login.usernameExists")
            : createResult.message
        );
      }
    } catch (err) {
      setError(t("login.registrationFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Container>
        <Row className="justify-content-center">
          <Col
            xs={12}
            sm={10}
            md={8}
            lg={6}
            xl={5}
            className="d-flex justify-content-center"
          >
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
                )}{" "}
                {/* Demo Credentials Info */}
                <Alert variant="info" className="mb-3">
                  <strong>{t("login.demoCredentials")}</strong>
                  <br />
                  <small>
                    <strong>{t("login.demoUser")}</strong> john.doe@company.com{" "}
                    {t("login.anyPassword")}
                    <br />
                    <strong>
                      {t("login.demoAdmin")}
                    </strong> admin@company.com {t("login.anyPassword")}
                  </small>
                </Alert>
                <h1></h1>
                <Tabs
                  activeKey={activeTab}
                  onSelect={(k) => setActiveTab(k)}
                  className="mb-4 justify-content-center"
                  fill
                >
                  {" "}
                  <Tab
                    eventKey="login"
                    title={
                      <span className="fw-semibold">{t("login.signIn")}</span>
                    }
                  >
                    {activeTab === "login" && (
                      <Form onSubmit={handleLogin} className="mt-3">
                        <Form.Group className="mb-3">
                          <Form.Label className="form-label">
                            {t("login.email")}
                          </Form.Label>
                          <Form.Control
                            type="email"
                            value={loginData.email}
                            onChange={(e) =>
                              setLoginData({
                                ...loginData,
                                email: e.target.value,
                              })
                            }
                            placeholder={t("login.emailPlaceholder")}
                            required
                            className="form-control"
                            autoComplete="email"
                          />
                        </Form.Group>

                        <Form.Group className="mb-4">
                          <Form.Label className="form-label">
                            {t("login.password")}
                          </Form.Label>
                          <Form.Control
                            type="password"
                            value={loginData.password}
                            onChange={(e) =>
                              setLoginData({
                                ...loginData,
                                password: e.target.value,
                              })
                            }
                            placeholder={t("login.passwordPlaceholder")}
                            required
                            className="form-control"
                            autoComplete="current-password"
                          />
                        </Form.Group>

                        <Button
                          variant="primary"
                          type="submit"
                          className="login-btn"
                          disabled={loading}
                        >
                          {loading ? t("login.signingIn") : t("login.signIn")}
                        </Button>
                      </Form>
                    )}
                  </Tab>{" "}
                  <Tab
                    eventKey="register"
                    title={
                      <span className="fw-semibold">{t("login.signUp")}</span>
                    }
                  >
                    {activeTab === "register" && (
                      <Form onSubmit={handleRegister} className="mt-3">
                        <Form.Group className="mb-3">
                          <Form.Label className="form-label">
                            {t("login.username")}
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={registerData.username}
                            onChange={(e) =>
                              setRegisterData({
                                ...registerData,
                                username: e.target.value,
                              })
                            }
                            placeholder={t("login.usernamePlaceholder")}
                            required
                            className="form-control"
                            autoComplete="username"
                          />
                        </Form.Group>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label className="form-label">
                                {t("login.firstName")}
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={registerData.firstName}
                                onChange={(e) =>
                                  setRegisterData({
                                    ...registerData,
                                    firstName: e.target.value,
                                  })
                                }
                                placeholder={t("login.firstNamePlaceholder")}
                                className="form-control"
                                autoComplete="given-name"
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label className="form-label">
                                {t("login.lastName")}
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={registerData.lastName}
                                onChange={(e) =>
                                  setRegisterData({
                                    ...registerData,
                                    lastName: e.target.value,
                                  })
                                }
                                placeholder={t("login.lastNamePlaceholder")}
                                className="form-control"
                                autoComplete="family-name"
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Form.Group className="mb-3">
                          <Form.Label className="form-label">
                            {t("login.email")}
                          </Form.Label>
                          <Form.Control
                            type="email"
                            value={registerData.email}
                            onChange={(e) =>
                              setRegisterData({
                                ...registerData,
                                email: e.target.value,
                              })
                            }
                            placeholder={t("login.emailPlaceholder")}
                            required
                            className="form-control"
                            autoComplete="email"
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label className="form-label">
                            {t("login.password")}
                          </Form.Label>
                          <Form.Control
                            type="password"
                            value={registerData.password}
                            onChange={(e) =>
                              setRegisterData({
                                ...registerData,
                                password: e.target.value,
                              })
                            }
                            placeholder={t("login.passwordPlaceholder")}
                            required
                            className="form-control"
                            autoComplete="new-password"
                          />
                        </Form.Group>

                        <Form.Group className="mb-4">
                          <Form.Label className="form-label">
                            {t("login.confirmPassword")}
                          </Form.Label>
                          <Form.Control
                            type="password"
                            value={registerData.confirmPassword}
                            onChange={(e) =>
                              setRegisterData({
                                ...registerData,
                                confirmPassword: e.target.value,
                              })
                            }
                            placeholder={t("login.confirmPasswordPlaceholder")}
                            required
                            className="form-control"
                            autoComplete="new-password"
                          />
                        </Form.Group>

                        <Button
                          variant="success"
                          type="submit"
                          className="login-btn"
                          disabled={loading}
                        >
                          {loading
                            ? t("login.creatingAccount")
                            : t("login.createAccount")}
                        </Button>
                      </Form>
                    )}
                  </Tab>
                </Tabs>{" "}
                <div className="text-center mt-3">
                  <Link to="/feed" className="text-decoration-none fw-semibold">
                    {t("login.continueAsGuest")}
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
