import {jwtDecode} from "jwt-decode";
export function setAutoLogout(token) {
  try {
    const decoded = jwtDecode(token);

    const expiry = decoded.exp * 1000; 
    const now = Date.now();
    const timeout = expiry - now;

    if (timeout > 0) {
      setTimeout(() => {
        localStorage.clear();
        window.location.href = "/";
        alert("Session expired. Please log in again.");
      }, timeout);
    }
  } catch (error) {
    console.error("Error setting auto-logout:", error);
  }
}