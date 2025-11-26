import { useContext } from "react";
import { LanguageContext } from "../contexts/LanguageContext";

export const translations = {
  en: {
    // Navigation
    nav: {
      feed: "Feed",
      about: "About",
      faq: "FAQ",
      login: "Login",
      logout: "Logout",
      profile: "Profile",
      settings: "Settings",
      creatorRequest: "Creator Request",
      notifications: "Notifications",
      createManual: "Create",
    },

    // Feed Page
    feed: {
      title: "Quick Search",
      subtitle:
        'Find all organizational manuals in one place — try typing "VS Code", "Onboarding", "Brand guideline" or select a category below',
      searchPlaceholder: "Search manuals, categories, tags...",
      categories: {
        all: "All",
        it: "IT",
        design: "Design",
        marketing: "Marketing",
        hr: "HR",
      },
      recommended: "Recommended manuals",
      searchResults: "Search results",
      resultsText: "Based on what's popular this week",
      noResults: "No manuals found",
      noResultsDesc: "Try adjusting your search terms or browse by category",
    },

    // About Page
    about: {
      title: "About QuickHelp",
      subtitle:
        "Your one-stop solution for accessing company manuals, guides, and documentation. Find what you need quickly and efficiently.",
      features: {
        search: {
          title: "🔍 Quick Search",
          desc: "Find exactly what you're looking for with our powerful search functionality. Search by title, category, tags, or content.",
        },
        organized: {
          title: "📁 Well Organized",
          desc: "All manuals are categorized and tagged for easy browsing. Navigate through IT, HR, Design, Marketing, and other departments effortlessly.",
        },
        updated: {
          title: "🔄 Always Updated",
          desc: "Our content is regularly maintained and updated by department experts to ensure you always have the latest information.",
        },
      },
      featuredTitle: "Featured Manuals",
      featuredDesc:
        "Here are some of our most popular and helpful manuals to get you started.",
    },

    // FAQ Page
    faq: {
      title: "Frequently Asked Questions",
      subtitle: "Find answers to common questions about using QuickHelp",
      questions: {
        access: {
          q: "How do I access manuals?",
          a: "Simply use the search bar on the homepage or browse by category. All employees have access to view and download manuals.",
        },
        request: {
          q: "How can I request to become a creator?",
          a: "Go to your profile menu and click 'Creator Request'. Fill out the form explaining why you need creator access and what type of manuals you plan to create.",
        },
        update: {
          q: "How often are manuals updated?",
          a: "Manuals are updated as needed by their creators. You can see the last updated date on each manual's detail page.",
        },
        categories: {
          q: "What categories are available?",
          a: "We currently have IT, Design, Marketing, and HR categories. More categories may be added based on organizational needs.",
        },
      },
    },

    // Login Page
    login: {
      title: "Welcome to QuickHelp",
      subtitle: "Access your company's knowledge base",
      signIn: "Sign In",
      signUp: "Register",
      createAccount: "Create Account",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      username: "Username",
      emailOrUsername: "Email or Username",
      firstName: "First Name",
      lastName: "Last Name",
      emailPlaceholder: "Enter your email",
      emailOrUsernamePlaceholder: "Enter your email or username",
      passwordPlaceholder: "Enter your password",
      confirmPasswordPlaceholder: "Confirm your password",
      usernamePlaceholder: "Choose a username",
      firstNamePlaceholder: "Your first name",
      lastNamePlaceholder: "Your last name",
      signingIn: "Signing In...",
      creatingAccount: "Creating Account...",
      continueAsGuest: "Continue as Guest",
      demoCredentials: "Demo Login Credentials:",
      demoUser: "User:",
      demoAdmin: "Admin:",
      anyPassword: "(any password)",
      welcomeBack: "Welcome back",
      redirecting: "Redirecting...",
      accountCreated: "Account created successfully! Redirecting...",
      invalidCredentials: "Invalid credentials",
      fillAllFields: "Please fill in all fields",
      passwordsDontMatch: "Passwords do not match",
      passwordTooShort: "Password must be at least 6 characters",
      emailExists: "Email already exists",
      usernameExists: "Username already exists",
      loginFailed: "Login failed. Please try again.",
      registrationFailed: "Registration failed. Please try again.",
      noAccount: "Don't have an account?",
      contactAdmin: "Contact your administrator",
      errors: {
        invalid: "Invalid email or password",
        required: "This field is required",
      },
    },

    // Profile Page
    profile: {
      title: "My Profile",
      personalInfo: "Personal Information",
      username: "Username",
      email: "Email",
      firstName: "First Name",
      lastName: "Last Name",
      department: "Department",
      position: "Position",
      accountStats: "Account Statistics",
      manualsViewed: "Manuals Viewed",
      manualsDownloaded: "Manuals Downloaded",
      manualsBookmarked: "Manuals Bookmarked",
      loginCount: "Total Logins",
      memberSince: "Member since",
      lastLogin: "Last login",
      editProfile: "Edit Profile",
      saveChanges: "Save Changes",
      cancel: "Cancel",
    },

    // Settings Page
    settings: {
      title: "Settings",
      preferences: "Preferences",
      notifications: "Notifications",
      language: "Language",
      theme: "Theme",
      light: "Light",
      dark: "Dark",
      emailNotifications: "Email Notifications",
      pushNotifications: "Push Notifications",
      weeklyDigest: "Weekly Digest",
      save: "Save Settings",
    },

    // Creator Request Page
    creatorRequest: {
      title: "Creator request",
      subtitle:
        "Request permission to create and manage manuals for your team in QuickHelp",
      reasonContext: "Reason & context",
      reasonDesc: "Tell the Admin team why you need Creator permissions",
      team: "Team/Department you belong to",
      teamPlaceholder: "e.g. IT, Design, Marketing",
      reason: "Reason for requesting Creator permission",
      reasonPlaceholder:
        "e.g. Need to create onboarding manuals for new team, consolidate scattered IT guides, etc.",
      manualTypes: "Example types of manuals you will create",
      typesPlaceholder: "e.g. VS Code setup, Design guideline, HR checklist",
      agreement:
        "I agree that the manuals created will be internal organizational information and will not be shared externally without permission",
      submit: "Submit Creator Request",
      pending: "Request is pending review",
      requestStatus: "Request status",
      statusDesc: "Track your request status and see overall timeline",
      currentStatus: "Current status",
      statuses: {
        pending: "Pending review",
        approved: "Approved",
        rejected: "Rejected",
      },
      timeline: {
        submitted: "Request submitted",
        underReview: "Under review",
        approved: "Approved",
        reviewNote: "Admin will review within 1-2 business days",
        byAdmin: "by Admin team",
        effectNote:
          "Creator permissions will take effect immediately after approval",
      },
      needHelp: "Need help?",
      helpText:
        "If your request is taking unusually long, you can contact the Admin team or HR for more information",
    },

    // Manual Detail Page
    manualDetail: {
      backToFeed: "← Back to Feed",
      quickStart: "Quick start",
      overview: "Overview",
      tableOfContents: "Table of Contents",
      information: "Information",
      fileSize: "File size",
      lastUpdated: "Last updated",
      createdBy: "Created by",
      department: "Department",
      version: "Version",
      downloads: "Downloads",
      tags: "Tags",
      relatedManuals: "Related manuals",
      comments: "Comments",
      addComment: "Add a comment...",
      postComment: "Post",
      downloadManual: "Download Manual",
      bookmarkManual: "Bookmark",
      shareManual: "Share",
    },

    // Create Manual Page
    createManual: {
      title: "Create Manual",
      subtitle: "Create a new manual for your team and organization",
      titleLabel: "Title",
      titlePlaceholder: "Enter manual title...",
      categoryLabel: "Category",
      selectCategory: "Select a category",
      tagsLabel: "Tags",
      tagsPlaceholder: "Press Enter to add tag",
      tagsHint: "Press Enter to add tag | Click tag to remove",
      thumbnailLabel: "Thumbnail",
      uploadImage: "Upload Image",
      contentLabel: "Content",
      contentPlaceholder: "Write manual content...",
      publish: "Publish Manual",
      publishing: "Publishing...",
      fillAllFields: "Please fill in all required fields",
      success: "Manual created successfully!",
      error: "Failed to create manual. Please try again.",
      addBlock: "Add new block",
      blockTypes: {
        text: "Text",
        heading: "Heading",
        quote: "Quote",
        code: "Code",
        image: "Image",
      },
      blockPlaceholders: {
        heading: "Section title",
        quote: "Highlight text or short quote...",
        code: "Code example...",
        text: "Type manual content here...",
        image: "Click to upload image or enter image URL",
      },
    },

    // Edit Manual Page
    editManual: {
      title: "Edit Manual",
      subtitle: "Update your manual content and settings",
      backToDashboard: "Back to Dashboard",
      updateManual: "Update Manual",
      saveAsDraft: "Save as Draft",
      publishDraft: "Publish",
      saveDraft: "Save as Draft",
      success: "Manual updated successfully!",
      error: "Failed to update manual. Please try again.",
      notFound: "Manual not found",
      noPermission: "You don't have permission to edit this manual!",
      loading: "Loading manual...",
      updated: "Manual has been updated!",
      draftSaved: "Draft saved successfully!",
    },

    editDraft: {
      title: "Edit Draft",
      draftDetails: "Draft Details",
      draftCaption: "Configure your draft before publishing",
      updateDraft: "Update Draft",
      publishDraft: "Publish",
      titleRequired: "Please enter a manual title",
      minBlockWarning: "You must have at least one block in your manual.",
      draftUpdated: "Draft updated successfully! Redirecting to dashboard...",
      publishSuccess:
        "Draft published successfully! Waiting for admin approval...",
      updateError: "Failed to update draft",
      publishError: "Failed to publish draft",
      notFound: "Draft not found",
      noPermission: "You don't have permission to edit this draft!",
      loading: "Loading draft...",
      backToDashboard: "Back to Dashboard",
    },

    // Common
    common: {
      search: "Search",
      download: "Download",
      bookmark: "Bookmark",
      like: "Like",
      share: "Share",
      edit: "Edit",
      delete: "Delete",
      save: "Save",
      cancel: "Cancel",
      loading: "Loading...",
      error: "Error",
      success: "Success",
      warning: "Warning",
      info: "Information",
      close: "Close",
      back: "Back",
      next: "Next",
      previous: "Previous",
      or: "or",
    }, // Dashboard
    dashboard: {
      admin: {
        title: "Admin Dashboard",
        subtitle:
          "Overview of users, manuals, and creator requests in your organization",
        exportReport: "Export report",
        users: "Users",
        creators: "Creators",
        admins: "Admins",
        manuals: "Manuals",
        totalManuals: "Total manuals in system",
        creatorRequests: "Creator requests",
        pendingApproval: "Requests pending approval",
        pending: "pending",
        view: "View",
        approve: "Approve",
        reject: "Reject",
        noRequests:
          "No pending requests. Approved requests are recorded in the system.",
        manageManuals: "Manage Manuals",
        pendingManuals: "Pending Manuals",
        draftManuals: "Draft Manuals",
        publishedManuals: "Published Manuals",
        awaitingApproval: "Awaiting approval",
        savedDrafts: "Saved as drafts",
        noPendingManuals: "No pending manuals. All manuals have been reviewed.",
        noDrafts: "No draft manuals found.",
        noPublishedManuals: "No published manuals found",
        drafts: "drafts",
        published: "published",
        author: "Author",
        category: "Category",
        status: "Status",
        actions: "Actions",
        title: "Title",
        submitted: "Submitted",
        created: "Created",
        noRecentManuals: "No manuals found",
        userSnapshot: "User snapshot",
        newUsers: "8 new users this week",
        recentEdits: "5 manuals edited in the last 24 hours",
        newCreators: "2 creators added from requests this week",
      },
      creator: {
        title: "Creator Dashboard",
        subtitle: "Overview of your manuals, drafts, and recent activity",
        createManual: "Create manual",
        publishedManuals: "Published manuals",
        publishedDesc: "Manuals that are live and searchable",
        pendingManuals: "Pending approval",
        pendingDesc: "Manuals awaiting admin approval",
        draftManuals: "Draft Manuals",
        drafts: "Drafts",
        draftsDesc: "Unpublished manuals you can continue editing",
        totalViews: "Total views",
        viewsDesc: "Total views across all your manuals",
        myManuals: "My manuals",
        published: "published",
        pending: "pending",
        category: "Category",
        status: "Status",
        lastUpdated: "Last updated",
        views: "Views",
        actions: "Actions",
        noManuals: "No manuals yet. Try creating your first manual!",
        draft: "draft",
        draftsAndPending: "Drafts & Pending",
        lastEdited: "last edited",
        submitted: "submitted",
        continue: "Continue",
        publish: "Publish",
        edit: "Edit",
        noDrafts:
          "No drafts or pending manuals. When you save as draft or submit for approval, they will appear here.",
        noDraftsMessage:
          "No draft manuals. When you save as draft, they will appear here.",
        recentActivity: "Recent activity",
        noActivity:
          "No recent activity. Create your first manual to get started!",
        newComment: "New comment on",
        updatedVersion: "You updated version",
      },
    },
  },

  th: {
    // Navigation
    nav: {
      feed: "ฟีด",
      about: "เกี่ยวกับ",
      faq: "คำถามที่พบบ่อย",
      login: "เข้าสู่ระบบ",
      logout: "ออกจากระบบ",
      profile: "โปรไฟล์",
      settings: "ตั้งค่า",
      creatorRequest: "ขอสิทธิ์ Creator",
      notifications: "แจ้งเตือน",
      createManual: "สร้าง",
    },

    // Feed Page
    feed: {
      title: "ค้นหาด่วน",
      subtitle:
        'ค้นหาคู่มือทั้งหมดขององค์กรจากที่เดียว — ลองพิมพ์ "VS Code", "Onboarding", "Brand guideline" หรือเลือกหมวดด้านล่าง',
      searchPlaceholder: "ค้นหาคู่มือ, หมวดหมู่, แท็ก...",
      categories: {
        all: "ทั้งหมด",
        it: "ไอที",
        design: "ดีไซน์",
        marketing: "การตลาด",
        hr: "ทรัพยากรบุคคล",
      },
      recommended: "คู่มือที่แนะนำ",
      searchResults: "ผลการค้นหา",
      resultsText: "อิงจากความนิยมในสัปดาห์นี้",
      noResults: "ไม่พบคู่มือ",
      noResultsDesc: "ลองปรับคำค้นหาหรือเลือกดูตามหมวดหมู่",
    },

    // About Page
    about: {
      title: "เกี่ยวกับ QuickHelp",
      subtitle:
        "โซลูชันครบวงจรสำหรับเข้าถึงคู่มือ คำแนะนำ และเอกสารของบริษัท ค้นหาสิ่งที่คุณต้องการได้อย่างรวดเร็วและมีประสิทธิภาพ",
      features: {
        search: {
          title: "🔍 ค้นหาด่วน",
          desc: "ค้นหาสิ่งที่คุณต้องการได้อย่างแม่นยำด้วยระบบค้นหาที่มีประสิทธิภาพ ค้นหาตามชื่อ หมวดหมู่ แท็ก หรือเนื้อหา",
        },
        organized: {
          title: "📁 จัดระเบียบดี",
          desc: "คู่มือทั้งหมดถูกจัดหมวดหมู่และแท็กเพื่อให้เรียกดูง่าย เนวิเกตผ่านฝ่าย IT, HR, ดีไซน์, การตลาด และฝ่ายอื่นๆ ได้อย่างง่ายดาย",
        },
        updated: {
          title: "🔄 อัปเดตเสมอ",
          desc: "เนื้อหาของเราได้รับการดูแลและอัปเดตอย่างสม่ำเสมอโดยผู้เชี่ยวชาญในแต่ละฝ่าย เพื่อให้คุณมีข้อมูลล่าสุดเสมอ",
        },
      },
      featuredTitle: "คู่มือแนะนำ",
      featuredDesc:
        "นี่คือคู่มือที่ได้รับความนิยมและมีประโยชน์ที่สุดเพื่อให้คุณเริ่มต้นได้",
    },

    // FAQ Page
    faq: {
      title: "คำถามที่พบบ่อย",
      subtitle: "ค้นหาคำตอบของคำถามทั่วไปเกี่ยวกับการใช้ QuickHelp",
      questions: {
        access: {
          q: "จะเข้าถึงคู่มือได้อย่างไร?",
          a: "เพียงใช้แถบค้นหาในหน้าแรกหรือเลือกดูตามหมวดหมู่ พนักงานทุกคนสามารถเข้าถึง ดู และดาวน์โหลดคู่มือได้",
        },
        request: {
          q: "จะขอเป็น creator ได้อย่างไร?",
          a: "ไปที่เมนูโปรไฟล์และคลิก 'ขอสิทธิ์ Creator' กรอกแบบฟอร์มอธิบายว่าทำไมต้องการสิทธิ์ creator และจะสร้างคู่มือประเภทใดบ้าง",
        },
        update: {
          q: "คู่มือได้รับการอัปเดตบ่อยแค่ไหน?",
          a: "คู่มือจะได้รับการอัปเดตตามความจำเป็นโดยผู้สร้าง คุณสามารถดูวันที่อัปเดตล่าสุดในหน้ารายละเอียดของแต่ละคู่มือ",
        },
        categories: {
          q: "มีหมวดหมู่อะไรบ้าง?",
          a: "ปัจจุบันเรามี IT, ดีไซน์, การตลาด และ HR อาจมีการเพิ่มหมวดหมู่ใหม่ตามความต้องการขององค์กร",
        },
      },
    },

    // Login Page
    login: {
      title: "ยินดีต้อนรับสู่ QuickHelp",
      subtitle: "เข้าถึงฐานความรู้ของบริษัทคุณ",
      signIn: "เข้าสู่ระบบ",
      signUp: "สมัครสมาชิก",
      createAccount: "สร้างบัญชี",
      email: "อีเมล",
      password: "รหัสผ่าน",
      confirmPassword: "ยืนยันรหัสผ่าน",
      username: "ชื่อผู้ใช้",
      emailOrUsername: "อีเมลหรือชื่อผู้ใช้",
      firstName: "ชื่อ",
      lastName: "นามสกุล",
      emailPlaceholder: "กรอกอีเมลของคุณ",
      emailOrUsernamePlaceholder: "กรอกอีเมลหรือชื่อผู้ใช้",
      passwordPlaceholder: "กรอกรหัสผ่าน",
      confirmPasswordPlaceholder: "ยืนยันรหัสผ่าน",
      usernamePlaceholder: "เลือกชื่อผู้ใช้",
      firstNamePlaceholder: "ชื่อของคุณ",
      lastNamePlaceholder: "นามสกุลของคุณ",
      signingIn: "กำลังเข้าสู่ระบบ...",
      creatingAccount: "กำลังสร้างบัญชี...",
      continueAsGuest: "ไปต่อในฐานะแขก",
      demoCredentials: "ข้อมูลสำหรับทดสอบ:",
      demoUser: "ผู้ใช้:",
      demoAdmin: "ผู้ดูแล:",
      anyPassword: "(รหัสผ่านใดๆ)",
      welcomeBack: "ยินดีต้อนรับกลับ",
      redirecting: "กำลังเปลี่ยนหน้า...",
      accountCreated: "สร้างบัญชีสำเร็จ! กำลังเปลี่ยนหน้า...",
      invalidCredentials: "ข้อมูลประจำตัวไม่ถูกต้อง",
      fillAllFields: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
      passwordsDontMatch: "รหัสผ่านไม่ตรงกัน",
      passwordTooShort: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร",
      emailExists: "อีเมลนี้มีอยู่แล้ว",
      usernameExists: "ชื่อผู้ใช้นี้มีอยู่แล้ว",
      loginFailed: "เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่",
      registrationFailed: "สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่",
      noAccount: "ไม่มีบัญชี?",
      contactAdmin: "ติดต่อผู้ดูแลระบบ",
      errors: {
        invalid: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
        required: "ช่องนี้จำเป็นต้องกรอก",
      },
    },

    // Profile Page
    profile: {
      title: "โปรไฟล์ของฉัน",
      personalInfo: "ข้อมูลส่วนตัว",
      username: "ชื่อผู้ใช้",
      email: "อีเมล",
      firstName: "ชื่อ",
      lastName: "นามสกุล",
      department: "ฝ่าย",
      position: "ตำแหน่ง",
      accountStats: "สถิติบัญชี",
      manualsViewed: "คู่มือที่ดู",
      manualsDownloaded: "คู่มือที่ดาวน์โหลด",
      manualsBookmarked: "คู่มือที่บุ๊คมาร์ค",
      loginCount: "จำนวนการเข้าสู่ระบบ",
      memberSince: "สมาชิกตั้งแต่",
      lastLogin: "เข้าสู่ระบบล่าสุด",
      editProfile: "แก้ไขโปรไฟล์",
      saveChanges: "บันทึกการเปลี่ยนแปลง",
      cancel: "ยกเลิก",
    },

    // Settings Page
    settings: {
      title: "ตั้งค่า",
      preferences: "ค่ากำหนด",
      notifications: "การแจ้งเตือน",
      language: "ภาษา",
      theme: "ธีม",
      light: "สว่าง",
      dark: "มืด",
      emailNotifications: "การแจ้งเตือนทางอีเมล",
      pushNotifications: "การแจ้งเตือนแบบ Push",
      weeklyDigest: "สรุปรายสัปดาห์",
      save: "บันทึกการตั้งค่า",
    },

    // Creator Request Page
    creatorRequest: {
      title: "ขอสิทธิ์ Creator",
      subtitle: "ขอสิทธิ์สร้างและจัดการคู่มือสำหรับทีมของคุณใน QuickHelp",
      reasonContext: "เหตุผลและบริบท",
      reasonDesc: "บอกให้ทีม Admin รู้ว่าคุณต้องการสิทธิ์ Creator เพื่อทำอะไร",
      team: "ทีม/แผนกที่คุณสังกัด",
      teamPlaceholder: "เช่น IT, Design, Marketing",
      reason: "เหตุผลในการขอสิทธิ์ Creator",
      reasonPlaceholder:
        "เช่น ต้องการสร้างคู่มือ onboarding สำหรับทีมใหม่, รวมคู่มือ IT ที่กระจายอยู่หลายที่ ฯลฯ",
      manualTypes: "ตัวอย่างประเภทคู่มือที่คุณจะสร้าง",
      typesPlaceholder: "เช่น VS Code setup, Design guideline, HR checklist",
      agreement:
        "ฉันยอมรับว่าคู่มือที่สร้างจะเป็นข้อมูลภายในองค์กร และจะไม่เผยแพร่ไปภายนอกโดยไม่ได้รับอนุญาต",
      submit: "ส่งคำขอเป็น Creator",
      pending: "มีคำขอที่กำลังรอตรวจสอบ",
      requestStatus: "สถานะคำขอ",
      statusDesc: "ติดตามสถานะคำขอของคุณ และดู timeline โดยรวม",
      currentStatus: "สถานะปัจจุบัน",
      statuses: {
        pending: "รอการตรวจสอบ",
        approved: "อนุมัติแล้ว",
        rejected: "ปฏิเสธ",
      },
      timeline: {
        submitted: "ส่งคำขอแล้ว",
        underReview: "อยู่ระหว่างการตรวจสอบ",
        approved: "อนุมัติแล้ว",
        reviewNote: "Admin จะตรวจสอบภายใน 1-2 วันทำการ",
        byAdmin: "โดยทีม Admin",
        effectNote: "สิทธิ์ Creator จะมีผลทันทีหลังจากอนุมัติ",
      },
      needHelp: "ต้องการความช่วยเหลือ?",
      helpText:
        "ถ้าคำขอของคุณใช้เวลานานผิดปกติ สามารถติดต่อทีม Admin หรือ HR เพื่อสอบถามเพิ่มเติมได้",
    },

    // Manual Detail Page
    manualDetail: {
      backToFeed: "← กลับไปยังฟีด",
      quickStart: "เริ่มต้นด่วน",
      overview: "ภาพรวม",
      tableOfContents: "สารบัญ",
      information: "ข้อมูล",
      fileSize: "ขนาดไฟล์",
      lastUpdated: "อัปเดตล่าสุด",
      createdBy: "สร้างโดย",
      department: "ฝ่าย",
      version: "เวอร์ชัน",
      downloads: "ดาวน์โหลด",
      tags: "แท็ก",
      relatedManuals: "คู่มือที่เกี่ยวข้อง",
      comments: "ความคิดเห็น",
      addComment: "เพิ่มความคิดเห็น...",
      postComment: "โพสต์",
      downloadManual: "ดาวน์โหลดคู่มือ",
      bookmarkManual: "บุ๊คมาร์ค",
      shareManual: "แชร์",
    },

    // Create Manual Page
    createManual: {
      title: "สร้างคู่มือ",
      subtitle: "สร้างคู่มือใหม่สำหรับทีมและองค์กรของคุณ",
      titleLabel: "ชื่อเรื่อง",
      titlePlaceholder: "ใส่ชื่อคู่มือ...",
      categoryLabel: "หมวดหมู่",
      selectCategory: "เลือกหมวดหมู่",
      tagsLabel: "แท็ก",
      tagsPlaceholder: "กด Enter เพื่อเพิ่มแท็ก",
      tagsHint: "กด Enter เพื่อเพิ่มแท็ก | คลิกแท็กเพื่อลบ",
      thumbnailLabel: "รูปภาพ",
      uploadImage: "อัปโหลดรูปภาพ",
      contentLabel: "เนื้อหา",
      contentPlaceholder: "เขียนเนื้อหาคู่มือ...",
      publish: "เผยแพร่คู่มือ",
      publishing: "กำลังเผยแพร่...",
      fillAllFields: "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน",
      success: "สร้างคู่มือสำเร็จ!",
      error: "การสร้างคู่มือไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
      addBlock: "เพิ่มบล็อกใหม่",
      blockTypes: {
        text: "ข้อความ",
        heading: "หัวข้อ",
        quote: "คำคม",
        code: "โค้ด",
        image: "รูปภาพ",
      },
      blockPlaceholders: {
        heading: "หัวข้อใหญ่ / Section title",
        quote: "ข้อความเน้นย้ำ หรือคำคมสั้น ๆ…",
        code: "โค้ดตัวอย่าง…",
        text: "พิมพ์เนื้อหาคู่มือที่นี่…",
        image: "คลิกเพื่ออัปโหลดรูปภาพหรือใส่ URL รูปภาพ",
      },
    },

    // Edit Manual Page
    editManual: {
      title: "แก้ไขคู่มือ",
      subtitle: "อัปเดตเนื้อหาและการตั้งค่าคู่มือของคุณ",
      backToDashboard: "กลับไปที่แดชบอร์ด",
      updateManual: "อัปเดตคู่มือ",
      saveAsDraft: "บันทึกร่าง",
      publishDraft: "เผยแพร่",
      saveDraft: "บันทึกร่าง",
      success: "อัปเดตคู่มือสำเร็จ!",
      error: "การอัปเดตคู่มือไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
      notFound: "ไม่พบคู่มือ",
      noPermission: "คุณไม่มีสิทธิ์แก้ไขคู่มือนี้!",
      loading: "กำลังโหลดคู่มือ...",
      updated: "คู่มือได้รับการอัปเดตแล้ว!",
      draftSaved: "บันทึกร่างสำเร็จ!",
    },

    editDraft: {
      title: "แก้ไขร่าง",
      draftDetails: "รายละเอียดร่าง",
      draftCaption: "ตั้งค่าร่างของคุณก่อนเผยแพร่",
      updateDraft: "อัปเดตร่าง",
      publishDraft: "เผยแพร่",
      titleRequired: "กรุณาใส่ชื่อคู่มือ",
      minBlockWarning: "คุณต้องมีอย่างน้อยหนึ่งบล็อกในคู่มือ",
      draftUpdated: "อัปเดตร่างสำเร็จ! กำลังกลับไปที่แดชบอร์ด...",
      publishSuccess: "เผยแพร่ร่างสำเร็จ! รอการอนุมัติจากผู้ดูแล...",
      updateError: "การอัปเดตร่างไม่สำเร็จ",
      publishError: "การเผยแพร่ร่างไม่สำเร็จ",
      notFound: "ไม่พบร่าง",
      noPermission: "คุณไม่มีสิทธิ์แก้ไขร่างนี้!",
      loading: "กำลังโหลดร่าง...",
      backToDashboard: "กลับไปที่แดชบอร์ด",
    },

    // Common
    common: {
      search: "ค้นหา",
      download: "ดาวน์โหลด",
      bookmark: "บุ๊คมาร์ค",
      like: "ถูกใจ",
      share: "แชร์",
      edit: "แก้ไข",
      delete: "ลบ",
      save: "บันทึก",
      cancel: "ยกเลิก",
      loading: "กำลังโหลด...",
      error: "ข้อผิดพลาด",
      success: "สำเร็จ",
      warning: "คำเตือน",
      info: "ข้อมูล",
      close: "ปิด",
      back: "ย้อนกลับ",
      next: "ถัดไป",
      previous: "ก่อนหน้า",
      or: "หรือ",
    },

    // Dashboard
    dashboard: {
      admin: {
        title: "แดชบอร์ดผู้ดูแลระบบ",
        subtitle: "ภาพรวมของผู้ใช้ คู่มือ และคำขอ creator ในองค์กรของคุณ",
        exportReport: "ส่งออกรายงาน",
        users: "ผู้ใช้",
        creators: "ผู้สร้าง",
        admins: "ผู้ดูแล",
        manuals: "คู่มือ",
        totalManuals: "คู่มือทั้งหมดในระบบ",
        creatorRequests: "คำขอ Creator",
        pendingApproval: "คำขอที่รออนุมัติ",
        pending: "รอดำเนินการ",
        view: "ดู",
        approve: "อนุมัติ",
        reject: "ปฏิเสธ",
        noRequests: "ไม่มีคำขอที่รอดำเนินการ คำขอที่อนุมัติแล้วถูกบันทึกในระบบ",
        manageManuals: "จัดการคู่มือ",
        pendingManuals: "คู่มือรอการอนุมัติ",
        draftManuals: "คู่มือร่าง",
        publishedManuals: "คู่มือที่เผยแพร่แล้ว",
        awaitingApproval: "รอการอนุมัติ",
        savedDrafts: "บันทึกเป็นร่าง",
        noPendingManuals: "ไม่มีคู่มือที่รอการอนุมัติ ตรวจสอบคู่มือทั้งหมดแล้ว",
        noDrafts: "ไม่พบคู่มือร่าง",
        noPublishedManuals: "ไม่พบคู่มือที่เผยแพร่",
        drafts: "ร่าง",
        published: "เผยแพร่แล้ว",
        author: "ผู้เขียน",
        category: "หมวดหมู่",
        status: "สถานะ",
        actions: "การดำเนินการ",
        title: "ชื่อเรื่อง",
        submitted: "ส่งแล้ว",
        created: "สร้างเมื่อ",
        noRecentManuals: "ไม่พบคู่มือ",
        userSnapshot: "ภาพรวมผู้ใช้",
        newUsers: "ผู้ใช้ใหม่ 8 คนในสัปดาห์นี้",
        recentEdits: "แก้ไขคู่มือ 5 เล่มในช่วง 24 ชั่วโมงที่ผ่านมา",
        newCreators: "เพิ่ม creator 2 คนจากคำขอในสัปดาห์นี้",
      },
      creator: {
        title: "แดชบอร์ดผู้สร้าง",
        subtitle: "ภาพรวมของคู่มือ ร่าง และกิจกรรมล่าสุดของคุณ",
        createManual: "สร้างคู่มือ",
        publishedManuals: "คู่มือที่เผยแพร่",
        publishedDesc: "คู่มือที่เผยแพร่และค้นหาได้",
        pendingManuals: "รอการอนุมัติ",
        pendingDesc: "คู่มือที่รอการอนุมัติจากผู้ดูแล",
        draftManuals: "คู่มือร่าง",
        drafts: "ร่าง",
        draftsDesc: "คู่มือที่ยังไม่เผยแพร่และคุณสามารถแก้ไขต่อได้",
        totalViews: "การดูทั้งหมด",
        viewsDesc: "การดูรวมในคู่มือทั้งหมดของคุณ",
        myManuals: "คู่มือของฉัน",
        published: "เผยแพร่แล้ว",
        pending: "รอดำเนินการ",
        category: "หมวดหมู่",
        status: "สถานะ",
        lastUpdated: "อัปเดตล่าสุด",
        views: "การดู",
        actions: "การดำเนินการ",
        noManuals: "ยังไม่มีคู่มือ ลองสร้างคู่มือแรกของคุณ!",
        draft: "ร่าง",
        draftsAndPending: "ร่างและรอดำเนินการ",
        lastEdited: "แก้ไขล่าสุด",
        submitted: "ส่งแล้ว",
        continue: "ดำเนินการต่อ",
        publish: "เผยแพร่",
        edit: "แก้ไข",
        noDrafts:
          "ไม่มีร่างหรือคู่มือรอดำเนินการ เมื่อคุณบันทึกเป็นร่างหรือส่งเพื่อขออนุมัติ จะปรากฏที่นี่",
        noDraftsMessage: "ไม่มีคู่มือร่าง เมื่อคุณบันทึกเป็นร่าง จะปรากฏที่นี่",
        recentActivity: "กิจกรรมล่าสุด",
        noActivity: "ไม่มีกิจกรรมล่าสุด สร้างคู่มือแรกของคุณเพื่อเริ่มต้น!",
        newComment: "ความคิดเห็นใหม่ใน",
        updatedVersion: "คุณได้อัปเดตเวอร์ชัน",
      },
    },
  },
};

// Enhanced translation hook with error handling
export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    console.warn("useTranslation must be used within a LanguageProvider");
    return { t: (key) => key }; // Fallback function
  }

  const { language } = context;

  const t = (key, defaultValue = key) => {
    try {
      const keys = key.split(".");
      let value = translations[language];

      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k];
        } else {
          // Fallback to English if key not found in current language
          value = translations.en;
          for (const k of keys) {
            if (value && typeof value === "object" && k in value) {
              value = value[k];
            } else {
              return defaultValue;
            }
          }
          break;
        }
      }

      return typeof value === "string" ? value : defaultValue;
    } catch (error) {
      console.warn(`Translation error for key "${key}":`, error);
      return defaultValue;
    }
  };

  return { t, language };
};
