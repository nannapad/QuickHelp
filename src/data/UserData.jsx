// Mock user data for the application
const users = [
  {
    id: 1,
    username: "johndoe",
    email: "john.doe@company.com",
    firstName: "John",
    lastName: "Doe",
    role: "user",
    avatar: null,
    department: "IT",
    position: "Software Developer",
    isActive: true,
    preferences: {
      notifications: true,
      darkMode: false,
      emailUpdates: true,
      language: "en",
    },
    stats: {
      manualsViewed: 23,
      manualsDownloaded: 8,
      manualsBookmarked: 5,
      loginCount: 47,
    },
    createdAt: "2024-01-15T09:30:00Z",
    lastLogin: "2024-11-19T08:15:00Z",
    permissions: [
      "view_manuals",
      "download_manuals",
      "bookmark_manuals",
      "comment_manuals",
      "like_manuals",
    ],
  },
  {
    id: 2,
    username: "mariagarcia",
    email: "maria.garcia@company.com",
    firstName: "Maria",
    lastName: "Garcia",
    role: "creator",
    avatar: null,
    department: "Design",
    position: "Senior UX Designer",
    isActive: true,
    preferences: {
      notifications: true,
      darkMode: false,
      emailUpdates: true,
      language: "en",
    },
    stats: {
      manualsViewed: 89,
      manualsDownloaded: 34,
      manualsBookmarked: 18,
      loginCount: 156,
      manualsCreated: 7,
      manualsEdited: 12,
    },
    createdAt: "2024-02-10T14:20:00Z",
    lastLogin: "2024-11-19T09:30:00Z",
    permissions: [
      "view_manuals",
      "download_manuals",
      "bookmark_manuals",
      "comment_manuals",
      "like_manuals",
      "create_manuals",
      "edit_own_manuals",
      "delete_own_manuals",
      "manage_own_categories",
      "manage_own_tags",
    ],
  },
  {
    id: 3,
    username: "admin",
    email: "admin@company.com",
    firstName: "Sarah",
    lastName: "Wilson",
    role: "admin",
    avatar: null,
    department: "Management",
    position: "System Administrator",
    isActive: true,
    preferences: {
      notifications: true,
      darkMode: true,
      emailUpdates: true,
      language: "en",
    },
    stats: {
      manualsViewed: 156,
      manualsDownloaded: 45,
      manualsBookmarked: 23,
      loginCount: 234,
      manualsCreated: 12,
      manualsModerated: 67,
      usersManaged: 125,
    },
    createdAt: "2023-12-01T10:00:00Z",
    lastLogin: "2024-11-19T07:45:00Z",
    permissions: [
      "view_manuals",
      "download_manuals",
      "bookmark_manuals",
      "comment_manuals",
      "like_manuals",
      "create_manuals",
      "edit_manuals",
      "delete_manuals",
      "moderate_comments",
      "manage_users",
      "view_analytics",
      "manage_categories",
      "manage_tags",
      "backup_data",
      "system_settings",
    ],
  },
];

// Helper functions for user operations
export const getUserById = (id) => {
  return users.find((user) => user.id === parseInt(id));
};

export const getUserByEmail = (email) => {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
};

export const getUserByUsername = (username) => {
  return users.find(
    (user) => user.username.toLowerCase() === username.toLowerCase()
  );
};

export const isAdmin = (user) => {
  return user && user.role === "admin";
};

export const isCreator = (user) => {
  return user && user.role === "creator";
};

export const hasPermission = (user, permission) => {
  return user && user.permissions.includes(permission);
};

export const getActiveUsers = () => {
  return users.filter((user) => user.isActive);
};

export const getUsersByRole = (role) => {
  return users.filter((user) => user.role === role);
};

// Authentication helper
export const authenticateUser = (email, password) => {
  // In a real app, this would check against hashed passwords
  // For demo purposes, we'll accept any password for existing users
  const user = getUserByEmail(email);
  if (user && user.isActive) {
    return {
      success: true,
      user: user,
      token: `demo-token-${user.id}-${Date.now()}`,
    };
  }
  return {
    success: false,
    message: "Invalid credentials or inactive account",
  };
};

export default users;
