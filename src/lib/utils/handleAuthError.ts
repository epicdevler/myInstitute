import { getAppErrorMessage } from "./app-error-message-handler";
import { handleAppError } from "./firebaseErrorHandler";

export function handleAuthError(error: unknown): string {
  console.log("Error: ", error);

  return getAppErrorMessage(error);
}
