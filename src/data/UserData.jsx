// Load users from localStorage or use default data
const getStoredUsers = () => {
  try {
    const stored = localStorage.getItem("quickhelp_users");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading users from localStorage:", error);
  }
  return defaultUsers;
};

// Save users to localStorage
const saveUsersToStorage = (updatedUsers) => {
  try {
    localStorage.setItem("quickhelp_users", JSON.stringify(updatedUsers));
  } catch (error) {
    console.error("Error saving users to localStorage:", error);
  }
};

// Default user data for the application
const defaultUsers = [
  {
    id: 1,
    username: "johndoe",
    email: "john.doe@company.com",
    firstName: "John",
    lastName: "Doe",
    role: "user",
    avatar: null,
    profilePicture: null,
    bio: "Passionate software developer with 5+ years of experience in web technologies.",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
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
      likesGiven: 12,
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
    profilePicture:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    bio: "Senior UX Designer creating intuitive and accessible user experiences. Love crafting detailed design systems.",
    phone: "+1 (555) 987-6543",
    location: "Austin, TX",
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
      likesGiven: 45,
      totalManualViews: 892,
      likesReceived: 134,
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
    profilePicture:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    bio: "System Administrator ensuring smooth operations and maintaining platform quality. Always happy to help users.",
    phone: "+1 (555) 456-7890",
    location: "Seattle, WA",
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
      likesGiven: 89,
      totalManualViews: 1245,
      likesReceived: 201,
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

// Initialize users from localStorage
let users = getStoredUsers();

// Helper functions for user operations
export const getUserById = (id) => {
  users = getStoredUsers(); // Refresh from storage
  return users.find((user) => user.id === parseInt(id));
};

export const getUserByEmail = (email) => {
  users = getStoredUsers(); // Refresh from storage
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
};

export const getUserByUsername = (username) => {
  users = getStoredUsers(); // Refresh from storage
  return users.find(
    (user) => user.username.toLowerCase() === username.toLowerCase()
  );
};

// Function to create a new user
export const createUser = (userData) => {
  const currentUsers = getStoredUsers();

  // Check if email already exists
  if (
    currentUsers.find(
      (user) => user.email.toLowerCase() === userData.email.toLowerCase()
    )
  ) {
    return {
      success: false,
      message: "Email already exists",
    };
  }

  // Check if username already exists
  if (
    currentUsers.find(
      (user) => user.username.toLowerCase() === userData.username.toLowerCase()
    )
  ) {
    return {
      success: false,
      message: "Username already exists",
    };
  }

  // Create new user with default permissions
  const newUser = {
    id: Math.max(...currentUsers.map((u) => u.id), 0) + 1,
    username: userData.username.toLowerCase(),
    email: userData.email.toLowerCase(),
    firstName:
      userData.firstName || userData.username.split(/[._-]/)[0] || "User",
    lastName: userData.lastName || "",
    role: "user",
    avatar: null,
    department: userData.department || "",
    position: userData.position || "Member",
    isActive: true,
    preferences: {
      notifications: true,
      darkMode: false,
      emailUpdates: true,
      language: "en",
    },
    stats: {
      manualsViewed: 0,
      manualsDownloaded: 0,
      manualsBookmarked: 0,
      loginCount: 0,
    },
    createdAt: new Date().toISOString(),
    lastLogin: null,
    permissions: [
      "view_manuals",
      "download_manuals",
      "bookmark_manuals",
      "comment_manuals",
      "like_manuals",
    ],
  };

  const updatedUsers = [...currentUsers, newUser];
  saveUsersToStorage(updatedUsers);
  users = updatedUsers; // Update local reference

  return {
    success: true,
    user: newUser,
  };
};

// Function to update user login stats
export const updateUserLogin = (userId) => {
  const currentUsers = getStoredUsers();
  const userIndex = currentUsers.findIndex(
    (user) => user.id === parseInt(userId)
  );

  if (userIndex !== -1) {
    currentUsers[userIndex].stats.loginCount += 1;
    currentUsers[userIndex].lastLogin = new Date().toISOString();
    saveUsersToStorage(currentUsers);
    users = currentUsers; // Update local reference
    return currentUsers[userIndex];
  }

  return null;
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
  users = getStoredUsers(); // Refresh from storage
  return users.filter((user) => user.isActive);
};

export const getUsersByRole = (role) => {
  users = getStoredUsers(); // Refresh from storage
  return users.filter((user) => user.role === role);
};

// Authentication helper
export const authenticateUser = (email, password) => {
  // In a real app, this would check against hashed passwords
  // For demo purposes, we'll accept any password for existing users
  const user = getUserByEmail(email);
  if (user && user.isActive) {
    // Update login stats
    const updatedUser = updateUserLogin(user.id);
    return {
      success: true,
      user: updatedUser || user,
      token: `demo-token-${user.id}-${Date.now()}`,
    };
  }
  return {
    success: false,
    message: "Invalid credentials or inactive account",
  };
};

// Function to update user profile data
export const updateUserProfile = (userId, updatedData) => {
  const currentUsers = getStoredUsers();
  const userIndex = currentUsers.findIndex(
    (user) => user.id === parseInt(userId)
  );

  if (userIndex !== -1) {
    currentUsers[userIndex] = { ...currentUsers[userIndex], ...updatedData };
    saveUsersToStorage(currentUsers);
    users = currentUsers; // Update local reference
    return currentUsers[userIndex];
  }

  return null;
};

// Function to get all users (for admin purposes)
export const getAllUsers = () => {
  return getStoredUsers();
};

// Mock data for creator requests
const defaultCreatorRequests = [
  {
    id: 1,
    userId: 4,
    name: "Alex Johnson",
    department: "Marketing",
    reason: "Need to create manuals for new marketing campaigns",
    status: "pending",
    createdAt: "2024-11-20T10:30:00Z",
  },
  {
    id: 2,
    userId: 5,
    name: "Sam Smith",
    department: "Sales",
    reason: "Documenting sales processes",
    status: "pending",
    createdAt: "2024-11-21T14:15:00Z",
  },
  {
    id: 3,
    userId: 6,
    name: "Jordan Lee",
    department: "HR",
    reason: "Updating employee handbook",
    status: "approved",
    createdAt: "2024-11-18T09:00:00Z",
  },
];

export const getCreatorRequests = () => {
  // In a real app, this would fetch from an API or database
  return defaultCreatorRequests;
};

export default users;
