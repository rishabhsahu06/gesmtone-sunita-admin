// Authentication utility functions

export const AUTH_CONFIG = {
  TOKEN_KEY: "authToken",
  USER_KEY: "userEmail",
  REMEMBER_KEY: "rememberMe",
}

export const authUtils = {
  // Store authentication data
  login: (token, email, rememberMe = false) => {
    localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token)
    localStorage.setItem(AUTH_CONFIG.USER_KEY, email)

    if (rememberMe) {
      localStorage.setItem(AUTH_CONFIG.REMEMBER_KEY, "true")
    }
  },

  // Remove authentication data
  logout: () => {
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY)
    localStorage.removeItem(AUTH_CONFIG.USER_KEY)
    localStorage.removeItem(AUTH_CONFIG.REMEMBER_KEY)
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    if (typeof window === "undefined") return false
    return !!localStorage.getItem(AUTH_CONFIG.TOKEN_KEY)
  },

  // Get current user data
  getCurrentUser: () => {
    if (typeof window === "undefined") return null

    const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY)
    const email = localStorage.getItem(AUTH_CONFIG.USER_KEY)

    if (!token || !email) return null

    return { token, email }
  },

  // Get auth token
  getToken: () => {
    if (typeof window === "undefined") return null
    return localStorage.getItem(AUTH_CONFIG.TOKEN_KEY)
  },
}

// Mock API functions - replace with real API calls
export const authAPI = {
  login: async (email, password) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock authentication logic
    if (email === "admin@example.com" && password === "admin123") {
      return {
        success: true,
        token: "mock-jwt-token-" + Date.now(),
        user: { email, role: "admin" },
      }
    }

    throw new Error("Invalid credentials")
  },

  forgotPassword: async (email) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock success response
    return {
      success: true,
      message: "Password reset link sent to email",
    }
  },

  resetPassword: async (token, newPassword) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      success: true,
      message: "Password reset successfully",
    }
  },
}
