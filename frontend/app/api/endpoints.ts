// const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const BASE_URL = "https://pmf-g5j1.onrender.com"


export const AUTH = {
    LOGIN: `${BASE_URL}/auth/login/`,
    REGISTER: `${BASE_URL}/api/user/register/`,
    LOGOUT: `${BASE_URL}/auth/logout/`,
    VERIFY_2FA: `${BASE_URL}/auth/verify-2fa/`,
    REQUEST_PASSWORD_RESET: `${BASE_URL}/auth/request-password-reset/`,
    RESET_PASSWORD: `${BASE_URL}/auth/reset-password/`,
  };
  
  export const USER = {
    PROFILE: `${BASE_URL}/user/profile/`,
    UPDATE_PROFILE: `${BASE_URL}/user/profile/update/`,
    KYC_STATUS: `${BASE_URL}/user/kyc-status/`,
    UPLOAD_KYC_DOCUMENT: `${BASE_URL}/user/upload-kyc/`,
  };
  
  export const TRANSACTION = {
    SEND_MONEY: `${BASE_URL}/transaction/send/`,
    NEED_CURRENCY: `${BASE_URL}/transaction/request-foreign-currency/`,
    HISTORY: `${BASE_URL}/transaction/history/`,
    BY_ID: (id: string) => `${BASE_URL}/transaction/${id}/`,
  };
  
  export const EXCHANGE = {
    LIVE_RATE: `${BASE_URL}/exchange/live-rate/`,
    SET_ALERT: `${BASE_URL}/exchange/set-alert/`,
    HISTORICAL_RATES: `${BASE_URL}/exchange/historical/`,
  };
  
  export const MESSAGING = {
    USER_INBOX: `${BASE_URL}/messaging/inbox/`,
    SEND_MESSAGE: `${BASE_URL}/messaging/send/`,
    GET_THREAD: (id: string) => `${BASE_URL}/messaging/thread/${id}/`,
  };
  
  export const NOTIFICATION = {
    GET_ALL: `${BASE_URL}/notifications/`,
    MARK_AS_READ: (id: string) => `${BASE_URL}/notifications/${id}/mark-as-read/`,
  };
  
  export const SETTINGS = {
    GET_SECURITY_SETTINGS: `${BASE_URL}/settings/security/`,
    UPDATE_PASSWORD: `${BASE_URL}/settings/update-password/`,
    ENABLE_2FA: `${BASE_URL}/settings/enable-2fa/`,
  };
  
  export const HELP_CENTER = {
    FAQ: `${BASE_URL}/support/faqs/`,
    CONTACT_SUPPORT: `${BASE_URL}/support/contact/`,
  };
  