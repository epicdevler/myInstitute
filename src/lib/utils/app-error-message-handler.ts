export function getAppErrorMessage(e: unknown): string {
  // logError("handleApplicationError", e);

  // ── Firebase-style errors (kept for any legacy paths) ────────────────────
  if (
    e &&
    typeof e === "object" &&
    "code" in e &&
    typeof (e as { code: unknown }).code === "string"
  ) {
    const errorCode = (e as { code: string }).code;

    if (errorCode.startsWith("auth/")) {
      switch (errorCode) {
        case "auth/network-request-failed":
          return "Network error occurred. Please check your internet connection and try again.";
        case "auth/invalid-email":
          return "The email address is not valid.";
        case "auth/user-not-found":
          return "No account found with this email address.";
        case "auth/wrong-password":
          return "The password you entered is incorrect.";
        case "auth/email-already-in-use":
        case "auth/email-already-exists":
          return "This email address is already registered.";
        case "auth/weak-password":
          return "The password is too weak. Please choose a stronger one.";
        case "auth/too-many-requests":
        case "auth/quota-exceeded":
          return "Too many attempts. Please try again later.";
        case "auth/operation-not-allowed":
          return "This sign-in method is not enabled. Please contact support.";
        case "auth/expired-action-code":
          return "The link has expired. Please request a new one.";
        case "auth/invalid-action-code":
          return "The link is invalid or has already been used.";
        case "auth/user-disabled":
          return "Your account has been disabled. Please contact support.";
        case "auth/invalid-credential":
          return "Your sign-in credentials are not valid. Please try again.";
        case "auth/requires-recent-login":
          return "Please re-authenticate to complete this action.";
        case "auth/user-token-expired":
          return "Your session has expired. Please sign in again.";
        case "auth/app-not-authorized":
        case "auth/unauthorized-domain":
          return "This application is not authorized for the requested action. Please contact support.";
        case "auth/invalid-verification-code":
        case "auth/missing-verification-code":
          return "Invalid or missing verification code. Please try again.";
        default:
          return "An authentication error occurred. Please try again.";
      }
    }

    if (errorCode.startsWith("storage/")) {
      switch (errorCode) {
        case "storage/object-not-found":
          return "The requested file or item was not found.";
        case "storage/unauthorized":
          return "You do not have permission to access this file.";
        case "storage/cancelled":
          return "The file operation was cancelled.";
        case "storage/retry-limit-exceeded":
          return "The file operation timed out. Please check your connection and try again.";
        case "storage/cannot-slice-blob":
          return "Could not process the file for upload. Please try a different file.";
        case "storage/quota-exceeded":
          return "File storage limit exceeded. Please contact support if this persists.";
        case "storage/invalid-checksum":
          return "File corruption detected during transfer. Please try again.";
        case "storage/unauthenticated":
          return "You must be signed in to perform this file operation.";
        case "storage/bucket-not-found":
          return "The file storage location was not found or configured incorrectly.";
        default:
          return "A file operation error occurred. Please try again.";
      }
    }

    switch (errorCode) {
      case "permission-denied":
        return "You do not have permission to perform this action.";
      case "not-found":
        return "The requested data was not found.";
      case "unavailable":
        return "This service is currently unavailable. Please try again shortly.";
      case "cancelled":
        return "The data operation was cancelled.";
      case "resource-exhausted":
        return "Too many data requests. Please try again later.";
      case "unauthenticated":
        return "You need to be signed in to access this data.";
      case "invalid-argument":
        return "The data provided is invalid.";
      case "already-exists":
        return "The item you're trying to create already exists.";
      case "aborted":
        return "The operation was aborted due to a conflict. Please try again.";
      case "data-loss":
        return "Data loss occurred. Please report this issue.";
      case "internal":
        return "An internal server error occurred. Please try again later.";
      case "unknown":
        return "An unknown data error occurred. Please try again.";
    }

    return "A service error occurred. Please try again later.";
  }

  // ── Standard JS Error ─────────────────────────────────────────────────────
  if (e instanceof Error) {
    if (e.message?.toLowerCase().includes("network")) {
      return "A network issue occurred. Please check your internet connection.";
    }
    return `An unexpected error occurred. Please try again later.`;
  }

  // ── Unknown ───────────────────────────────────────────────────────────────
  return "An unknown error occurred. Please try again later.";
}
