import { useContext } from "react";
import { LanguageContext } from "../contexts/LanguageContext";

// Translation files for English and Thai
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
      title: "Sign in to QuickHelp",
      subtitle: "Access your company's knowledge base",
      email: "Email address",
      password: "Password",
      signIn: "Sign in",
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
      title: "เข้าสู่ระบบ QuickHelp",
      subtitle: "เข้าถึงฐานความรู้ของบริษัทคุณ",
      email: "อีเมล",
      password: "รหัสผ่าน",
      signIn: "เข้าสู่ระบบ",
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
    },
  },
};

// Hook to get translated text
export const useTranslation = () => {
  const { language } = useContext(LanguageContext);

  const t = (key) => {
    const keys = key.split(".");
    let value = translations[language];

    for (const k of keys) {
      if (value && typeof value === "object") {
        value = value[k];
      } else {
        return key; // Return the key if translation not found
      }
    }

    return value || key;
  };  return { t, language };
};
