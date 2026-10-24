/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /profile
 * @type {string[]}
 */
export const authRoutes = ['/login', '/error'];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiPrefix = '/api';

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const privateAuthPrefix = ['/profile', '/checkout'];

/**
 * The prefix for Admin routes
 * Routes that start with this prefix are used for Admin operations
 * @type {string}
 */
export const adminAuthPrefix = '/dashboard';

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = '/profile';
export const DEFAULT_ADMIN_REDIRECT = '/admin';
export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
export const clientSideRoute = '/client-page';
export const serverSideRoute = '/server-page';
export const loginRoute = '/login';
export const registerRoute = '/register';
export const resetPasswordRoute = '/reset-password';
export const newPasswordRoute = '/new-password';
export const emailVerificationRoute = '/email-verification';
export const profileRoute = '/profile';
export const checkoutRoute = '/checkout';
export const paymentSuccessRoute = '/checkout/successful-payment';
