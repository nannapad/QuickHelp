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
import { authenticateUser } from "../data/UserData";
import "./css/Login.css";

const Login = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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
            `Welcome back, ${authResult.user.firstName}! Redirecting...`
          );
          setTimeout(() => {
            navigate("/feed");
          }, 1500);
        } else {
          setError(authResult.message || "Invalid credentials");
        }
      } else {
        setError("Please fill in all fields");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
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
        setError("Passwords do not match");
        return;
      }

      if (registerData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      } // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create user data and auth token for new user
      const userData = {
        id: Date.now(), // Use timestamp as simple ID
        username: registerData.username,
        email: registerData.email,
        avatar: null,
      };
      const authToken = "demo-token-" + Date.now(); // Store in localStorage (auto-login after registration)
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("authToken", authToken);

      // Dispatch custom event to notify NavBar of auth state change
      window.dispatchEvent(new Event("authStateChanged"));

      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => {
        navigate("/feed");
      }, 1500);

      setRegisterData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError("Registration failed. Please try again.");
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
                )}
                {/* Demo Credentials Info */}
                <Alert variant="info" className="mb-3">
                  <strong>Demo Login Credentials:</strong>
                  <br />
                  <small>
                    <strong>User:</strong> john.doe@company.com (any password)
                    <br />
                    <strong>Admin:</strong> admin@company.com (any password)
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
                    title={<span className="fw-semibold">Login</span>}
                  >
                    {activeTab === "login" && (
                      <Form onSubmit={handleLogin} className="mt-3">
                        <Form.Group className="mb-3">
                          <Form.Label className="form-label">Email</Form.Label>
                          <Form.Control
                            type="email"
                            value={loginData.email}
                            onChange={(e) =>
                              setLoginData({
                                ...loginData,
                                email: e.target.value,
                              })
                            }
                            placeholder="Enter your email"
                            required
                            className="form-control"
                            autoComplete="email"
                          />
                        </Form.Group>

                        <Form.Group className="mb-4">
                          <Form.Label className="form-label">
                            Password
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
                            placeholder="Enter your password"
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
                          {loading ? "Signing In..." : "Sign In"}
                        </Button>
                      </Form>
                    )}
                  </Tab>
                  <Tab
                    eventKey="register"
                    title={<span className="fw-semibold">Register</span>}
                  >
                    {activeTab === "register" && (
                      <Form onSubmit={handleRegister} className="mt-3">
                        <Form.Group className="mb-3">
                          <Form.Label className="form-label">
                            Username
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
                            placeholder="Choose a username"
                            required
                            className="form-control"
                            autoComplete="username"
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label className="form-label">Email</Form.Label>
                          <Form.Control
                            type="email"
                            value={registerData.email}
                            onChange={(e) =>
                              setRegisterData({
                                ...registerData,
                                email: e.target.value,
                              })
                            }
                            placeholder="Enter your email"
                            required
                            className="form-control"
                            autoComplete="email"
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label className="form-label">
                            Password
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
                            placeholder="Create a password"
                            required
                            className="form-control"
                            autoComplete="new-password"
                          />
                        </Form.Group>

                        <Form.Group className="mb-4">
                          <Form.Label className="form-label">
                            Confirm Password
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
                            placeholder="Confirm your password"
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
                          {loading ? "Creating..." : "Create Account"}
                        </Button>
                      </Form>
                    )}
                  </Tab>
                </Tabs>{" "}
                <div className="text-center mt-3">
                  <Link to="/feed" className="text-decoration-none fw-semibold">
                    Continue as Guest
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
