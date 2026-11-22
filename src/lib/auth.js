/** Local auth helpers (NextAuth session is primary; these are optional utilities) */

export const AUTH_CONFIG = {
  TOKEN_KEY: "authToken",
  USER_KEY: "userEmail",
  REMEMBER_KEY: "rememberMe",
};

export const authUtils = {
  logout: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    localStorage.removeItem(AUTH_CONFIG.USER_KEY);
    localStorage.removeItem(AUTH_CONFIG.REMEMBER_KEY);
  },

  isAuthenticated: () => {
    if (typeof window === "undefined") return false;
    return Boolean(localStorage.getItem(AUTH_CONFIG.TOKEN_KEY));
  },

  getToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
  },
};
