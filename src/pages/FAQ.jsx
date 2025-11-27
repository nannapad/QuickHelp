import React, { useState } from "react";
import { useTranslation } from "../utils/translations";
import "./css/FAQ.css";

const FAQ = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questionForm, setQuestionForm] = useState({
    name: "",
    email: "",
    question: "",
  });
  const [userQuestions, setUserQuestions] = useState([]);
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  // Load user questions on mount
  React.useEffect(() => {
    try {
      const userData = localStorage.getItem("userData");
      if (userData) {
        const user = JSON.parse(userData);
        setCurrentUserEmail(user.email);

        // Load all questions and filter by user email
        const allQuestions = JSON.parse(
          localStorage.getItem("userQuestions") || "[]"
        );
        const filteredQuestions = allQuestions.filter(
          (q) => q.email === user.email
        );
        setUserQuestions(filteredQuestions);
      }
    } catch (error) {
      console.error("Error loading user questions:", error);
    }
  }, []);

  const faqs = [
    {
      q: t("faq.questions.access.q"),
      a: t("faq.questions.access.a"),
    },
    {
      q: t("faq.questions.request.q"),
      a: t("faq.questions.request.a"),
    },
    {
      q: t("faq.questions.update.q"),
      a: t("faq.questions.update.a"),
    },
    {
      q: t("faq.questions.categories.q"),
      a: t("faq.questions.categories.a"),
    },
  ];

  // Filter FAQs based on search term
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleQuestionSubmit = (e) => {
    e.preventDefault();

    // Save question to localStorage
    try {
      const existingQuestions = JSON.parse(
        localStorage.getItem("userQuestions") || "[]"
      );

      const newQuestion = {
        id: Date.now(),
        name: questionForm.name,
        email: questionForm.email,
        question: questionForm.question,
        createdAt: new Date().toISOString(),
        status: "pending", // pending, answered, archived
        answer: null,
      };

      existingQuestions.push(newQuestion);
      localStorage.setItem("userQuestions", JSON.stringify(existingQuestions));

      // Update userQuestions state if it's the current user
      if (questionForm.email === currentUserEmail) {
        setUserQuestions((prev) => [...prev, newQuestion]);
      }

      alert("Thank you for your question! Our team will review it shortly.");
    } catch (error) {
      console.error("Error saving question:", error);
      alert("There was an error submitting your question. Please try again.");
    }

    setQuestionForm({ name: "", email: "", question: "" });
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    setQuestionForm({
      ...questionForm,
      [e.target.name]: e.target.value,
    });
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setQuestionForm({ name: "", email: "", question: "" });
  };
  return (
    <main className="faq-page">
      <div className="faq-inner">
        <header className="faq-header">
          <h1 className="faq-title">{t("faq.title")}</h1>
          <p className="faq-subtitle">{t("faq.subtitle")}</p>
        </header>{" "}
        {/* My Questions Section - Only show if user is logged in and has questions */}
        {currentUserEmail && userQuestions.length > 0 && (
          <div className="my-questions-section">
            <h2 className="my-questions-title">📋 My Questions</h2>
            <div className="my-questions-list">
              {userQuestions
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((q) => (
                  <div key={q.id} className="my-question-card">
                    <div className="my-question-header">
                      <span className={`question-status status-${q.status}`}>
                        {q.status === "pending" && "⏳ Pending"}
                        {q.status === "answered" && "✅ Answered"}
                        {q.status === "archived" && "📦 Archived"}
                      </span>
                      <span className="question-date">
                        {new Date(q.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="my-question-content">
                      <h4 className="my-question-text">Q: {q.question}</h4>
                      {q.answer && (
                        <div className="my-question-answer">
                          <div className="answer-header">
                            <span className="answer-icon">💬</span>
                            <span className="answer-label">
                              Admin Response:
                            </span>
                            {q.answeredAt && (
                              <span className="answer-date">
                                {new Date(q.answeredAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                            )}
                          </div>
                          <p className="answer-text">{q.answer}</p>
                          {q.answeredBy && (
                            <p className="answered-by">— {q.answeredBy}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
        {/* Search Section */}
        <div className="faq-search-section">
          <div className="faq-search-wrapper">
            <div className="faq-search-box">
              <input
                type="text"
                placeholder="Search frequently asked questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="faq-search-input"
              />
              <span className="faq-search-icon">🔍</span>
            </div>
            <button onClick={openModal} className="faq-ask-btn">
              💬 Ask Question
            </button>
          </div>
        </div>
        {/* FAQ Content */}
        <div className="faq-content">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3 className="faq-question">{faq.q}</h3>
                <p className="faq-answer">{faq.a}</p>
              </div>
            ))
          ) : (
            <div className="faq-no-results">
              <p>
                No FAQs found matching your search. Try asking a question below!
              </p>
            </div>
          )}
        </div>{" "}
        {/* Modal for Question Form */}
        {isModalOpen && (
          <div className="faq-modal-overlay" onClick={closeModal}>
            <div className="faq-modal" onClick={(e) => e.stopPropagation()}>
              <div className="faq-modal-header">
                <h2 className="faq-modal-title">Ask a Question</h2>
                <button onClick={closeModal} className="faq-modal-close">
                  ✕
                </button>
              </div>

              <form
                onSubmit={handleQuestionSubmit}
                className="faq-question-form"
              >
                <div className="faq-form-row">
                  <div className="faq-form-group">
                    <label htmlFor="name" className="faq-form-label">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={questionForm.name}
                      onChange={handleInputChange}
                      required
                      className="faq-form-input"
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="faq-form-group">
                    <label htmlFor="email" className="faq-form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={questionForm.email}
                      onChange={handleInputChange}
                      required
                      className="faq-form-input"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="faq-form-group">
                  <label htmlFor="question" className="faq-form-label">
                    Your Question
                  </label>
                  <textarea
                    id="question"
                    name="question"
                    value={questionForm.question}
                    onChange={handleInputChange}
                    required
                    className="faq-form-textarea"
                    placeholder="Please describe your question in detail..."
                    rows="4"
                  />
                </div>

                <div className="faq-modal-actions">
                  <button type="submit" className="faq-submit-btn">
                    Send Question
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default FAQ;
