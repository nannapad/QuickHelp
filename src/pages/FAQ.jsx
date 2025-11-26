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
    // Here you would typically send the question to a backend
    console.log("Question submitted:", questionForm);
    alert("Thank you for your question! We'll get back to you soon.");
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
