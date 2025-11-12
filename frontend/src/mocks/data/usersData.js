// © 2025 SmartAir City Team
// Licensed under the MIT License. See LICENSE file for details.

/**
 * Users Mock Data Generator
 * Based on openapi (1).yaml specs
 */

const randomChoice = (array) => array[Math.floor(Math.random() * array.length)];

// ============================================
// USER ROLES
// ============================================

const USER_ROLES = ['admin', 'user', 'viewer'];

// ============================================
// GENERATE USER
// ============================================

/**
 * Generate một user theo OpenAPI schema
 * @param {object} options - Options
 * @returns {object} User object
 */
export const generateUser = (options = {}) => {
  const id = options.id || `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const name = options.name || `User ${Math.floor(Math.random() * 1000)}`;
  
  return {
    id: id,
    role: options.role || randomChoice(USER_ROLES),
    pw: 'hashed_password_here', // Never return real password
    mail: options.mail || `${name.toLowerCase().replace(/\s/g, '.')}@smartaircity.com`,
    name: name,
  };
};

// ============================================
// GENERATE MULTIPLE USERS
// ============================================

/**
 * Generate array of users
 * @param {number} count - Number of users
 * @returns {array} Array of users
 */
export const generateUsers = (count = 5) => {
  const users = [];
  
  for (let i = 0; i < count; i++) {
    users.push(generateUser({
      name: `User ${i + 1}`
    }));
  }
  
  return users;
};

// ============================================
// MOCK USERS DATABASE
// ============================================

export const MOCK_USERS = [
  {
    id: 'admin-001',
    role: 'admin',
    pw: 'hashed_password',
    mail: 'admin@smartaircity.com',
    name: 'Admin User',
  },
  {
    id: 'user-001',
    role: 'user',
    pw: 'hashed_password',
    mail: 'user@smartaircity.com',
    name: 'Regular User',
  },
  ...generateUsers(3)
];

// ============================================
// AUTH HELPERS
// ============================================

/**
 * Mock login - Always return success for testing
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {object} Login result
 */
export const mockLogin = (email, password) => {
  const user = MOCK_USERS.find(u => u.mail === email);
  
  if (user) {
    return {
      success: true,
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: user.id,
        name: user.name,
        mail: user.mail,
        role: user.role,
      }
    };
  }
  
  return {
    success: false,
    error: 'Invalid email or password'
  };
};

/**
 * Mock signup
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {object} Signup result
 */
export const mockSignup = (email, password) => {
  const exists = MOCK_USERS.find(u => u.mail === email);
  
  if (exists) {
    return {
      success: false,
      error: 'Email already exists'
    };
  }
  
  const newUser = generateUser({ mail: email });
  MOCK_USERS.push(newUser);
  
  return {
    success: true,
    token: 'mock-jwt-token-' + Date.now(),
    user: {
      id: newUser.id,
      name: newUser.name,
      mail: newUser.mail,
      role: newUser.role,
    }
  };
};

// Export default
const usersMockData = {
  generateUser,
  generateUsers,
  MOCK_USERS,
  mockLogin,
  mockSignup,
  USER_ROLES,
};

export default usersMockData;
