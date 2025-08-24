import { handleAppError } from "./firebaseErrorHandler";

export function handleAuthError(error: unknown): string {
  console.log("Error: ", error);

  return handleAppError(error);
}
