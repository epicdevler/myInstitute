// Assuming logError is defined elsewhere in your project, e.g.:
// function logError(context: string | undefined, error: unknown): void {
//   console.error(context ? `[${context}] Error:` : "Error:", error);
// }

/**
 * Utility function to handle application-specific errors from backend services,
 * returning customized, user-friendly messages, or a general message for unknown responses.
 *
 * @param e The error object caught from a try-catch block.
 * @returns A user-friendly error message string.
 */
export function handleAppError(e: unknown): string {
  // Always log the original error for internal debugging and monitoring.

  // Check if the error object has a 'code' property, typical for many service SDK errors.
  if (
    e &&
    typeof e === "object" &&
    "code" in e &&
    typeof (e as { code: unknown }).code === "string"
  ) {
    const errorCode = (e as { code: string }).code;

    // --- Authentication Errors (codes start with "auth/") ---
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
          return "This email address is already registered.";
        case "auth/weak-password":
          return "The password is too weak. Please choose a stronger one.";
        case "auth/too-many-requests":
        case "auth/quota-exceeded": // Covers general throttling and phone verification limits
          return "Too many attempts. Please try again later.";
        case "auth/operation-not-allowed":
          return "This sign-in method is not enabled for your account. Please contact support.";
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
          return "This application is not authorized for the requested action. Please contact support.";
        case "auth/unauthorized-domain":
          return "The domain is not authorized for this action. Please contact support.";
        case "auth/invalid-verification-code":
        case "auth/missing-verification-code":
          return "Invalid or missing verification code. Please try again.";
        // Add more specific Auth error codes as you encounter them
        default:
          return "An authentication error occurred. Please try again.";
      }
    }
    // --- File Operation Errors (codes start with "storage/") ---
    else if (errorCode.startsWith("storage/")) {
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
        // Add more specific Storage error codes as needed
        default:
          return "A file operation error occurred. Please try again.";
      }
    }
    // --- Data Operation Errors (no prefix) ---
    // These codes are directly the specific error type (e.g., "permission-denied").
    // We check them after the prefixed codes.
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
      case "unknown": // Generic unknown error, usually from backend
        return "An unknown data error occurred. Please try again.";
      // No default here. If it's an error with a `code` but not matched by any
      // of the above specific cases, it will fall through to the general message below.
    }
    

    // --- Fallback for unhandled service-specific errors with a code ---
    return `A service error occurred. Please try again later.`;
  } else if (e instanceof Error) {
    // --- Handle Standard JavaScript Error Objects ---
    // This block catches generic JavaScript Error objects (e.g., TypeError, NetworkError from browser APIs).
    if (e.message && e.message.toLowerCase().includes("network")) {
      return "A network issue occurred. Please check your internet connection.";
    }
    // For any other standard JS Error, provide a slightly more descriptive message.
    return `An unexpected application error occurred: ${e.message}. Please try again later.`;
  } else {    
    // --- Graceful Fallback for Truly Unknown Responses ---
    // This catches anything else that's not an object with a 'code' or a standard Error object.
    return `An unknown error occurred. Please try again later.`;
  }
}

/* 

# NEXT_PUBLIC_GOOGLE_API_KEY=your-google-api-key

NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD5vvHvPN3miySc9aeOaDaMIQm61WSNsOY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=philtech-errandking.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=philtech-errandking
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=philtech-errandking.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=321655537337
NEXT_PUBLIC_FIREBASE_APP_ID=1:321655537337:web:156622ebba1c327ab7e568
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-SM8YNK23FG
*/
