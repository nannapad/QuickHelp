import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // Log error to monitoring service in production
    if (process.env.NODE_ENV === "production") {
      console.error("Error caught by boundary:", error, errorInfo);
      // Could send to error tracking service here
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "40px 20px",
            textAlign: "center",
            maxWidth: "600px",
            margin: "0 auto",
            fontFamily: "var(--font-family)",
          }}
        >
          <div
            style={{
              fontSize: "4rem",
              marginBottom: "20px",
            }}
          >
            ⚠️
          </div>
          <h1
            style={{
              fontSize: "1.5rem",
              marginBottom: "16px",
              color: "var(--text)",
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--text-muted)",
              marginBottom: "24px",
              lineHeight: "1.5",
            }}
          >
            We're sorry, but something unexpected happened. Please try
            refreshing the page.
          </p>
          <div
            style={{ display: "flex", gap: "12px", justifyContent: "center" }}
          >
            <button
              onClick={() => window.location.reload()}
              style={{
                background: "var(--primary)",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              Refresh Page
            </button>

            <button
              onClick={() => window.history.back()}
              style={{
                background: "var(--bg-light)",
                color: "var(--text)",
                border: "1px solid var(--border)",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              Go Back
            </button>
          </div>{" "}
          {process.env.NODE_ENV === "development" && (
            <details
              style={{
                marginTop: "40px",
                textAlign: "left",
                padding: "20px",
                background: "var(--bg-light)",
                borderRadius: "8px",
                fontSize: "0.875rem",
              }}
            >
              <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
                Error Details (Development)
              </summary>
              <pre
                style={{
                  marginTop: "12px",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                }}
              >
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
