import React from "react";
import "./css/About.css";

const About = () => {
  return (
    <div className="page">
      <div className="container">
        <header className="header">
          <h1 className="title">About QuickHelp</h1>{" "}
          <p className="lead">
            <strong>QuickHelp</strong> is a first-semester capstone project for{" "}
            <span className="highlight">
              Computer Science and Innovation (CSI) Year 2
            </span>{" "}
            students, focusing primarily on <strong>Frontend</strong> web
            development.
          </p>
        </header>

        <div className="grid">
          <section className="card">
            <div className="card-icon">🎯</div>
            <h2 className="card-title">Project Objective</h2>
            <p className="card-text">
              This project is designed as a platform to help users quickly find
              answers, short explanations, and basic user guides. We focus on
              web structure and user experience (UI/UX) design.
            </p>{" "}
          </section>

          <section className="card">
            <div className="card-icon">🚀</div>
            <h2 className="card-title">What We Focus On</h2>
            <ul className="list">
              <li>Web page layout design</li>
              <li>React component management</li>
              <li>CSS Module implementation for modular styling</li>
              <li>Creating user-friendly and visually appealing interfaces</li>
              <li>Responsive design for all device sizes</li>
            </ul>{" "}
          </section>

          <section className="card">
            <div className="card-icon">⚡</div>
            <h2 className="card-title">Key Features</h2>
            <ul className="list">
              <li>📚 Manual browsing and searching</li>
              <li>👤 User authentication and profiles</li>
              <li>✍️ Content creation for approved users</li>
              <li>🏷️ Categorization and tagging system</li>
              <li>🌍 Multi-language support (EN/TH)</li>
              <li>🌓 Dark/Light theme toggle</li>
            </ul>{" "}
          </section>

          <section className="card">
            <div className="card-icon">🔧</div>
            <h2 className="card-title">Technology Stack</h2>
            <div className="tech-stack">
              <span className="tech">React</span>
              <span className="tech">CSS Modules</span>
              <span className="tech">React Router</span>
              <span className="tech">Local Storage</span>
              <span className="tech">Responsive Design</span>
            </div>{" "}
          </section>

          <section className="card">
            <div className="card-icon">📋</div>
            <h2 className="card-title">Project Scope</h2>
            <p className="card-text">
              As a first-semester project, we haven't delved deep into{" "}
              <strong>Backend</strong> development or <strong>Database</strong>{" "}
              management yet. The system is not connected to a real database.{" "}
            </p>
            <p className="card-text">
              All data displayed on the website is currently{" "}
              <strong>mock data</strong> used for testing and demonstrating the
              web functionality.
            </p>{" "}
          </section>

          <section className="card">
            <div className="card-icon">🎓</div>
            <h2 className="card-title">Learning Goals</h2>
            <p className="card-text">
              The main goal of this project is to practice designing and
              building websites with clear structure, professional appearance,
              and understanding user flow from a user perspective.
            </p>
            <div className="goals">
              <div className="goal">
                <span className="goal-icon">✅</span>
                Master React component architecture
              </div>
              <div className="goal">
                <span className="goal-icon">✅</span>
                Implement modern CSS techniques
              </div>
              <div className="goal">
                <span className="goal-icon">✅</span>
                Create responsive user interfaces
              </div>
              <div className="goal">
                <span className="goal-icon">✅</span>
                Understand user experience principles
              </div>
            </div>
          </section>
        </div>

        <footer className="footer">
          <div className="footer-content">
            {" "}
            <p className="footer-text">
              Built with ❤️ by CSI Year 2 students as a learning project
            </p>
            <div className="footer-note">
              <small>
                This is a demonstration project for educational purposes. All
                data is simulated for testing functionality.
              </small>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default About;
