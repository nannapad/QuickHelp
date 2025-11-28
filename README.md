# QuickHelp

QuickHelp is a simple internal manual management system built as a **frontend-focused capstone project**.

The goal of this project is to practice building a clean, maintainable React application that feels close to a real system, **without** requiring a full backend.

---

## 🎯 What is QuickHelp?

QuickHelp is a web app that helps teams manage their **how-to manuals** in one place.

Instead of keeping guides in random slides, chat messages, or PDFs on someone’s laptop, QuickHelp provides:

- A central place to **search, read, and bookmark** manuals  
- Simple **version tracking** so users know which version they’re reading  
- Basic **analytics** so admins can see what people are searching for

It is designed for small teams, internal projects, clubs, or classes.

---

## 👥 User Roles

QuickHelp uses three main roles:

### 1. Regular User
- Browse and search manuals
- Read manual content
- Like manuals
- Comment on manuals
- Bookmark manuals for quick access later
- Receive notifications when bookmarked manuals are updated

### 2. Creator
- Everything a regular user can do, plus:
- Create new manuals
- Edit existing manuals
- Manage content blocks and metadata (title, tags, category, version)
- Submit manuals for review (if required by the flow)

### 3. Admin
- Full access to the system
- Manage users and their roles (especially creator roles)
- Review and approve creator requests
- Review and change manual statuses (draft, pending, published)
- See **search analytics** (popular queries, queries with no results)
- Oversee overall content quality

---

## 🌟 Core Features

- 🔍 **Manual search**
  - AI-style relevance scoring (simple scoring based on title, tags, and content)
  - Filters by category and tags

- 📑 **Manual viewer**
  - Structured content blocks (headings, text, code, etc.)
  - Views, likes, downloads counters
  - Comments and inline feedback

- ⭐ **Bookmarking**
  - Each user can bookmark manuals they care about
  - Bookmarks stored per user in `localStorage`
  - When a manual is updated, users who bookmarked it can receive a notification

- 🧾 **Version handling**
  - Each manual has a `version` and a `versions` history list
  - When content changes, creators can bump the version
  - Readers can see which version they’re reading in the manual metadata

- 🔔 **Notifications**
  - Stored per user in `localStorage`
  - Used for events such as:
    - Manual you bookmarked has been updated
    - (Optionally) creator request status updates

- 📊 **Search analytics**
  - Each search query is logged with its result count
  - Admin can see:
    - Popular queries
    - Queries that return no results (content gaps)

- 🌐 **Multi-language support**
  - Default language: **English**
  - Switch between English and Thai
  - All user-facing text goes through `translation.js` + `useTranslation()`
  - No hard-coded strings in components whenever possible

- 👤 **Auth simulation**
  - Basic login and register flow
  - Users and roles are stored in `localStorage`
  - `AuthContext` manages login state for the whole app  
  > Note: this is a frontend-focused educational project, not a production auth system.

---

## 🧱 Tech Stack

- **Frontend framework:** React (with Vite)
- **Routing:** React Router DOM
- **Styling:** Custom CSS (+ light Bootstrap-style layout)
- **State Management:**
  - React Context:
    - `AuthContext` – login state and current user
    - `LanguageContext` – current language (EN/TH)
- **Data storage:** `localStorage` (simulated database)
  - Users
  - Manuals (static + custom)
  - Comments
  - Creator requests
  - Bookmarks
  - Notifications
  - Search analytics
  - Manual interactions (views, likes, downloads)

---

## 📁 Project Structure (simplified)

```text
src/
  main.jsx          # React entry point
  App.jsx           # Routing + providers

  layouts/
    AppLayout.jsx   # NavBar + Outlet + Footer

  contexts/
    AuthContext.jsx       # Login state + user roles
    LanguageContext.jsx   # Language (EN/TH)

  data/
    UserData.jsx          # Mock users and user utilities
    ManualData.jsx        # Static manuals + custom manuals
    CommentData.js        # Initial comments
    CreatorRequests.js    # Creator request storage

  utils/
    translations.js       # All text for EN/TH + useTranslation()
    bookmarks.js          # Bookmark storage and utilities
    manualInteractions.js # Views, likes, downloads, notifications
    notifications.js      # Notification storage
    aiSearch.js           # Simple relevance scoring for search
    searchAnalytics.js    # Logging of search queries
    fileUtils.js          # Basic file helpers (image/base64)
    cleanupBlobUrls.js    # Handles safe image URLs
    ...                   # Additional helpers (responsive, accessibility, etc.)

  components/
    NavBar.jsx
    Footer.jsx
    ManualCard.jsx
    ManualGrid.jsx
    NotificationDropdown.jsx
    LanguageSwitcher.jsx
    ProfileAvatar.jsx
    AlertModal.jsx
    ProtectedRoute.jsx
    ErrorBoundary.jsx
    OptimizedImage.jsx
    ...

  pages/
    Feed.jsx              # Manual search and listing
    ManualDetail.jsx      # Manual reader + likes + comments + bookmark
    CreateManual.jsx      # Create a new manual
    EditManual.jsx        # Edit an existing manual
    EditDraft.jsx         # Edit draft manuals
    AdminDashboard.jsx    # Admin overview and analytics
    CreatorDashboard.jsx  # Creator overview and content list
    Profile.jsx           # User profile
    Settings.jsx          # Preferences (language, theme, notifications)
    Login.jsx             # Login / Register
    CreatorRequest.jsx    # Request creator role
    FAQ.jsx               # Frequently asked questions
    About.jsx             # Project background and overview
    NotFound.jsx          # 404 page
