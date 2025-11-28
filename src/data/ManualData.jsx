// Manual data for the application
const manuals = [
  {
    id: 1,
    title: "VS Code setup for new developers",
    category: "IT",
    meta: "IT • Tools & Environment • v1.3",
    description:
      "Complete guide to setting up VS Code with essential extensions and configurations for new developers.",
    tags: ["vs-code", "setup", "new-hire", "development", "tools"],
    views: 482,
    likes: 45,
    downloads: 120,
    author: "John Doe",
    createdAt: "2024-01-15",
    updatedAt: "2024-03-20",
    difficulty: "Beginner",
    estimatedTime: "30 minutes",
    thumbnail:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
    sections: [
      {
        title: "1. Installation",
        content:
          "Download and install VS Code from the official website. Ensure you select the correct version for your operating system (Windows, macOS, or Linux). During installation, check the 'Add to PATH' option for easier command-line access.",
      },
      {
        title: "2. Recommended Extensions",
        content:
          "Install the following extensions for a better development experience: ESLint, Prettier, GitLens, and Live Server. These tools help with code formatting, version control, and real-time preview.",
      },
      {
        title: "3. Workspace Settings",
        content:
          "Configure your workspace settings to enforce consistent coding standards. Create a .vscode folder in your project root and add a settings.json file with your team's preferred configurations.",
      },
    ],
    versions: ["1.3", "1.2", "1.1", "1.0"],
  },
  {
    id: 2,
    title: "Brand asset usage guideline",
    category: "Design",
    meta: "Design • Brand & CI • v2.0",
    description:
      "Official brand guidelines including logo usage, color schemes, typography, and marketing materials.",
    tags: ["brand", "logo", "marketing", "design", "guidelines"],
    views: 512,
    likes: 67,
    downloads: 89,
    author: "Jane Smith",
    createdAt: "2024-02-01",
    updatedAt: "2024-04-10",
    difficulty: "Intermediate",
    estimatedTime: "15 minutes",
    thumbnail:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    sections: [
      {
        title: "1. Logo Usage",
        content:
          "Our logo is the primary identifier of our brand. Always use the provided files and do not alter the proportions or colors. Ensure sufficient clear space around the logo to maintain its visibility and impact.",
      },
      {
        title: "2. Color Palette",
        content:
          "Our primary colors are Deep Blue (#003366) and Vibrant Orange (#FF6600). Use these colors consistently across all marketing materials. Secondary colors should be used sparingly for accents.",
      },
      {
        title: "3. Typography",
        content:
          "We use 'Inter' for all digital and print communications. Use bold weights for headings and regular weights for body text to ensure readability and hierarchy.",
      },
    ],
    versions: ["2.0", "1.5", "1.0"],
  },
  {
    id: 3,
    title: "Onboarding checklist for new employees",
    category: "HR",
    meta: "HR • Onboarding • v1.1",
    description:
      "Comprehensive checklist to ensure new employees have everything they need for a smooth onboarding process.",
    tags: ["onboarding", "checklist", "hr", "new-employee", "process"],
    views: 430,
    likes: 38,
    downloads: 156,
    author: "Mike Johnson",
    createdAt: "2024-01-20",
    updatedAt: "2024-03-15",
    difficulty: "Beginner",
    estimatedTime: "45 minutes",
    thumbnail:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop",
    sections: [
      {
        title: "1. First Day Essentials",
        content:
          "Welcome the new employee and introduce them to the team. Provide them with their ID badge, access card, and necessary equipment (laptop, monitor, etc.). Ensure they have access to the office Wi-Fi and email.",
      },
      {
        title: "2. System Access",
        content:
          "Set up accounts for email, Slack, Jira, and other internal tools. specific permissions based on their role. Schedule a session with IT to ensure all software is installed and configured correctly.",
      },
      {
        title: "3. Training & Documentation",
        content:
          "Assign mandatory training modules and share links to relevant documentation (like this manual!). Schedule introductory meetings with key team members and stakeholders.",
      },
    ],
    versions: ["1.1", "1.0"],
  },
  {
    id: 4,
    title: "Social media campaign checklist",
    category: "Marketing",
    meta: "Marketing • Social campaign • v0.9",
    description:
      "Step-by-step guide for planning, executing, and measuring social media campaigns across platforms.",
    tags: ["facebook-ads", "tiktok", "campaign", "social-media", "marketing"],
    views: 220,
    likes: 29,
    downloads: 67,
    author: "Sarah Wilson",
    createdAt: "2024-02-15",
    updatedAt: "2024-04-05",
    difficulty: "Advanced",
    estimatedTime: "60 minutes",
    sections: [
      {
        title: "1. Campaign Goals",
        content:
          "Define clear, measurable goals for your campaign (e.g., increase brand awareness, drive website traffic, generate leads). specific KPIs to track progress and success.",
      },
      {
        title: "2. Content Strategy",
        content:
          "Develop a content calendar with a mix of engaging formats (images, videos, stories). Ensure all content aligns with our brand voice and resonates with the target audience.",
      },
      {
        title: "3. Analytics & Reporting",
        content:
          "Monitor campaign performance daily and adjust strategies as needed. Create a final report summarizing key metrics, insights, and recommendations for future campaigns.",
      },
    ],
    versions: ["0.9", "0.8"],
  },
  {
    id: 5,
    title: "Git workflow for team collaboration",
    category: "IT",
    meta: "IT • Version Control • v1.0",
    description:
      "Best practices for using Git in team environments, including branching strategies and code reviews.",
    tags: ["git", "collaboration", "version-control", "workflow", "team"],
    views: 345,
    likes: 52,
    downloads: 98,
    author: "Alex Chen",
    createdAt: "2024-03-01",
    updatedAt: "2024-04-12",
    difficulty: "Intermediate",
    estimatedTime: "40 minutes",
    sections: [
      {
        title: "1. Branching Strategy",
        content:
          "We use the Gitflow workflow. Create feature branches from 'develop' for new work. Submit pull requests for code review before merging back into 'develop'. Use 'main' only for production-ready code.",
      },
      {
        title: "2. Commit Messages",
        content:
          "Write clear, concise commit messages that describe the 'why' and 'what' of your changes. Start with a verb in the imperative mood (e.g., 'Add', 'Fix', 'Update'). Reference issue numbers where applicable.",
      },
      {
        title: "3. Code Review Process",
        content:
          "All code must be reviewed by at least one other team member before merging. Focus on logic, readability, and adherence to coding standards. Be constructive and respectful in your feedback.",
      },
    ],
    versions: ["1.0", "0.9"],
  },
  {
    id: 6,
    title: "UI/UX Design System Documentation",
    category: "Design",
    meta: "Design • System • v1.2",
    description:
      "Complete design system documentation including components, patterns, and design principles.",
    tags: ["ui-ux", "design-system", "components", "documentation", "patterns"],
    views: 298,
    likes: 41,
    downloads: 73,
    author: "Emily Davis",
    createdAt: "2024-01-30",
    updatedAt: "2024-04-08",
    difficulty: "Intermediate",
    estimatedTime: "90 minutes",
    sections: [
      {
        title: "1. Design Principles",
        content:
          "Our design system is built on clarity, consistency, and accessibility. We prioritize user needs and strive for intuitive, delightful experiences. Every component should serve a clear purpose.",
      },
      {
        title: "2. Component Library",
        content:
          "Our library includes buttons, inputs, cards, modals, and more. Each component is documented with usage guidelines, variations, and code snippets. Use these components to build consistent interfaces.",
      },
      {
        title: "3. Accessibility Guidelines",
        content:
          "Ensure all designs meet WCAG 2.1 AA standards. Use sufficient color contrast, provide text alternatives for images, and support keyboard navigation. Accessibility is not an afterthought.",
      },
    ],
    versions: ["1.2", "1.1", "1.0"],
  },
  {
    id: 7,
    title: "IT Acceptable Use Policy",
    category: "IT",
    meta: "IT • Policy • v1.0",
    description:
      "High-level rules for using company devices, networks, and applications in a safe and responsible way.",
    tags: ["it-policy", "acceptable-use", "security", "devices", "network"],
    views: 0,
    likes: 0,
    downloads: 0,
    author: "IT Admin",
    createdAt: "2024-11-27",
    updatedAt: "2024-11-27",
    difficulty: "Beginner",
    estimatedTime: "10 minutes",
    thumbnail:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
    sections: [
      {
        title: "1. Scope & Purpose",
        content:
          "This policy applies to all employees, contractors, and interns who use company IT resources. It explains why responsible use is important for security and productivity.",
      },
      {
        title: "2. Acceptable Use of Devices & Network",
        content:
          "Company laptops, desktops, mobile devices, and Wi‑Fi should be used primarily for business purposes. Users must follow security controls and keep systems updated.",
      },
      {
        title: "3. Prohibited Activities",
        content:
          "Employees must not install unlicensed software, disable security tools, access illegal or inappropriate content, share accounts, or attempt to bypass security controls.",
      },
    ],
    versions: ["1.0"],
  },
  {
    id: 8,
    title: "Password & Multi-Factor Authentication Guidelines",
    category: "IT",
    meta: "IT • Security • v1.0",
    description:
      "Requirements for strong passwords, password manager usage, and multi-factor authentication on company systems.",
    tags: ["password", "mfa", "authentication", "security", "accounts"],
    views: 0,
    likes: 0,
    downloads: 0,
    author: "IT Admin",
    createdAt: "2024-11-27",
    updatedAt: "2024-11-27",
    difficulty: "Beginner",
    estimatedTime: "15 minutes",
    thumbnail:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=300&fit=crop",
    sections: [
      {
        title: "1. Password Rules",
        content:
          "Passwords must be at least 12 characters and include a mix of letters, numbers, and symbols. Do not reuse personal passwords on company systems or share credentials with others.",
      },
      {
        title: "2. Password Manager & Storage",
        content:
          "Employees should use the approved password manager to store and generate unique passwords. Passwords should never be written on paper or stored in plain-text files.",
      },
      {
        title: "3. Multi-Factor Authentication (MFA)",
        content:
          "MFA must be enabled on email, VPN, and all critical systems where available. Users should register at least one primary method (authenticator app) and one backup method.",
      },
    ],
    versions: ["1.0"],
  },
  {
    id: 9,
    title: "Information Security & Data Classification",
    category: "IT",
    meta: "IT • Security • v1.0",
    description:
      "How to classify company information and handle each data type safely and consistently.",
    tags: ["information-security", "data", "classification", "confidential"],
    views: 0,
    likes: 0,
    downloads: 0,
    author: "IT Admin",
    createdAt: "2024-11-27",
    updatedAt: "2024-11-27",
    difficulty: "Intermediate",
    estimatedTime: "20 minutes",
    thumbnail:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
    sections: [
      {
        title: "1. Data Classification Levels",
        content:
          "Company information is classified into levels such as Public, Internal, Confidential, and Restricted. Each level has different requirements for storage and sharing.",
      },
      {
        title: "2. Handling Sensitive Data",
        content:
          "Confidential and Restricted data must be stored only on approved systems, protected with access controls, and never sent via unsecured channels or personal accounts.",
      },
      {
        title: "3. Sharing & Storage Rules",
        content:
          "Before sharing data, verify the recipient and send only what is necessary. Use approved tools such as shared drives or collaboration platforms for long-term storage.",
      },
    ],
    versions: ["1.0"],
  },
  {
    id: 10,
    title: "IT Incident Reporting & Support Process",
    category: "IT",
    meta: "IT • Support • v1.0",
    description:
      "How employees should contact IT support, open tickets, and report incidents quickly and clearly.",
    tags: ["support", "helpdesk", "incident", "ticket", "it-service"],
    views: 0,
    likes: 0,
    downloads: 0,
    author: "IT Admin",
    createdAt: "2024-11-27",
    updatedAt: "2024-11-27",
    difficulty: "Beginner",
    estimatedTime: "10 minutes",
    thumbnail:
      "https://images.unsplash.com/photo-1581090700227-1e37b190418e?w=400&h=300&fit=crop",
    sections: [
      {
        title: "1. When to Contact IT",
        content:
          "Contact IT when you experience system errors, hardware failures, access issues, or if you suspect a security problem such as malware or unusual login activity.",
      },
      {
        title: "2. Support Channels & Ticketing",
        content:
          "Employees can reach IT via the helpdesk portal, email, or phone during business hours. High-impact incidents should be reported using the fastest available channel.",
      },
      {
        title: "3. Information to Include in Requests",
        content:
          "Include a clear description, screenshots, error messages, time of occurrence, and whether other colleagues are affected. Good information helps IT resolve issues faster.",
      },
    ],
    versions: ["1.0"],
  },
  {
    id: 11,
    title: "VPN & Remote Access Guide",
    category: "IT",
    meta: "IT • Remote Work • v1.0",
    description:
      "Guidelines for securely connecting to company systems from outside the office using VPN and remote tools.",
    tags: ["vpn", "remote-access", "wfh", "security", "network"],
    views: 0,
    likes: 0,
    downloads: 0,
    author: "IT Admin",
    createdAt: "2024-11-27",
    updatedAt: "2024-11-27",
    difficulty: "Beginner",
    estimatedTime: "15 minutes",
    thumbnail:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop",
    sections: [
      {
        title: "1. Who Needs VPN Access",
        content:
          "Employees who access internal applications, file shares, or admin tools from outside the office must use the company VPN for security and compliance.",
      },
      {
        title: "2. Installing and Connecting",
        content:
          "Explains how to install the approved VPN client, select the correct profile, sign in with corporate credentials, and confirm that the connection is active.",
      },
      {
        title: "3. Remote Work Best Practices",
        content:
          "Use trusted networks where possible, avoid public Wi‑Fi without VPN, lock your screen when away from the device, and never leave laptops unattended in public spaces.",
      },
    ],
    versions: ["1.0"],
  },
  {
    id: 12,
    title: "Company Device & Software Management",
    category: "IT",
    meta: "IT • Devices • v1.0",
    description:
      "Rules for using company laptops and mobiles, and how to request or install software safely.",
    tags: ["devices", "laptops", "mobile", "software", "asset-management"],
    views: 0,
    likes: 0,
    downloads: 0,
    author: "IT Admin",
    createdAt: "2024-11-27",
    updatedAt: "2024-11-27",
    difficulty: "Beginner",
    estimatedTime: "15 minutes",
    thumbnail:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
    sections: [
      {
        title: "1. Devices Issued by the Company",
        content:
          "Laptops, phones, and other equipment remain company property. Employees are responsible for reasonable care and must return devices when employment ends.",
      },
      {
        title: "2. Approved Software & Updates",
        content:
          "Only approved software may be installed on company devices. New tools must go through an IT review, and users must not disable automatic updates or antivirus.",
      },
      {
        title: "3. Lost or Stolen Devices",
        content:
          "If a device is lost or stolen, notify IT and your manager immediately so that remote wipe, account lock, and incident review can be performed.",
      },
    ],
    versions: ["1.0"],
  },
  {
    id: 13,
    title: "Backup, File Storage & Shared Drives",
    category: "IT",
    meta: "IT • Storage • v1.0",
    description:
      "Guidelines for where to store files, how data is backed up, and how to use shared folders safely.",
    tags: ["backup", "file-storage", "shared-drive", "onedrive", "sharepoint"],
    views: 0,
    likes: 0,
    downloads: 0,
    author: "IT Admin",
    createdAt: "2024-11-27",
    updatedAt: "2024-11-27",
    difficulty: "Beginner",
    estimatedTime: "15 minutes",
    thumbnail:
      "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=400&h=300&fit=crop",
    sections: [
      {
        title: "1. Where to Store Files",
        content:
          "Business documents should be stored on approved platforms such as shared drives, SharePoint, or OneDrive. Avoid keeping the only copy on your local desktop.",
      },
      {
        title: "2. Backup Responsibilities",
        content:
          "Servers and cloud storage are backed up by IT on a regular schedule. Users are responsible for ensuring that important files are saved in those locations.",
      },
      {
        title: "3. Restoring Deleted or Lost Files",
        content:
          "Explains how to restore files from recycle bins or version history, and when to contact IT if older backups are needed.",
      },
    ],
    versions: ["1.0"],
  },
  {
    id: 14,
    title: "Email & Collaboration Tools Usage",
    category: "IT",
    meta: "IT • Communication • v1.0",
    description:
      "Best practices for using corporate email, calendars, and chat tools such as Teams or Slack.",
    tags: ["email", "collaboration", "teams", "slack", "communication"],
    views: 0,
    likes: 0,
    downloads: 0,
    author: "IT Admin",
    createdAt: "2024-11-27",
    updatedAt: "2024-11-27",
    difficulty: "Beginner",
    estimatedTime: "15 minutes",
    thumbnail:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=300&fit=crop",
    sections: [
      {
        title: "1. Email Usage",
        content:
          "Corporate email accounts should be used for business communication. Avoid sending sensitive information to personal addresses or using personal email for company work.",
      },
      {
        title: "2. Calendar & Meetings",
        content:
          "Use clear meeting titles and agendas, invite only necessary attendees, and respect working hours. Keep your calendar up to date so colleagues can schedule effectively.",
      },
      {
        title: "3. Chat & Channels",
        content:
          "Use channels by project or team, keep discussions on-topic, and avoid sharing confidential data in informal chats unless the channel is properly restricted.",
      },
    ],
    versions: ["1.0"],
  },
  {
    id: 15,
    title: "Phishing & Social Engineering Awareness",
    category: "IT",
    meta: "IT • Security Awareness • v1.0",
    description:
      "How to recognize phishing emails, suspicious links, and social engineering attempts.",
    tags: ["phishing", "security-awareness", "training", "email", "fraud"],
    views: 0,
    likes: 0,
    downloads: 0,
    author: "IT Admin",
    createdAt: "2024-11-27",
    updatedAt: "2024-11-27",
    difficulty: "Beginner",
    estimatedTime: "15 minutes",
    thumbnail:
      "https://images.unsplash.com/photo-1510511233900-1982d92bd835?w=400&h=300&fit=crop",
    sections: [
      {
        title: "1. Recognizing Phishing",
        content:
          "Phishing messages often use urgent language, unexpected attachments, or suspicious links and may pretend to be from IT, banks, or well-known services.",
      },
      {
        title: "2. What to Do with Suspicious Messages",
        content:
          "Do not click links or open attachments in suspicious emails. Use the phishing report button if available or forward the message to the security or IT team.",
      },
      {
        title: "3. Safe Browsing Habits",
        content:
          "Always check the website address, avoid downloading software from unknown sites, and keep your browser and plugins up to date.",
      },
    ],
    versions: ["1.0"],
  },
  {
    id: 16,
    title: "IT Onboarding Checklist for New Employees",
    category: "IT",
    meta: "IT • Onboarding • v1.0",
    description:
      "A step-by-step IT checklist to help new employees get set up on their first day and during the first week.",
    tags: ["onboarding", "new-hire", "accounts", "setup", "it"],
    views: 0,
    likes: 0,
    downloads: 0,
    author: "IT Admin",
    createdAt: "2024-11-27",
    updatedAt: "2024-11-27",
    difficulty: "Beginner",
    estimatedTime: "20 minutes",
    thumbnail:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop",
    sections: [
      {
        title: "1. Day-One Setup",
        content:
          "New employees receive their accounts, change their initial password, sign in to email and collaboration tools, and review the IT acceptable use policy.",
      },
      {
        title: "2. First-Week Checklist",
        content:
          "By the end of the first week, employees should have access to all required systems, completed basic IT and security training, and tested VPN or remote access if needed.",
      },
      {
        title: "3. Getting Help",
        content:
          "Explains how to contact the IT helpdesk, open support tickets, and use self-service resources such as FAQs or internal manuals.",
      },
    ],
    versions: ["1.0"],
  },
];

// Helper to get all manuals (static + local)
const getAllManuals = () => {
  try {
    const localManuals = JSON.parse(
      localStorage.getItem("customManuals") || "[]"
    );
    return [...manuals, ...localManuals];
  } catch (e) {
    console.error("Error reading local manuals:", e);
    return manuals;
  }
};

export { manuals };
export default getAllManuals();
