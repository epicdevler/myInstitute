import { AppException } from "./exceptions";

/**
 * Utility function to execute a function and catch any errors that occur.
 * If an error occurs, it will be passed to the provided error handler.
 * * @param fn - The function to execute.
 * * @param onError - The function to call if an error occurs.
 * * @returns {void}
 */
export function withTryAndCatch(
  fn: () => void,
  onError: (error: AppException) => void
): void {
  try {
    fn();
  } catch (error) {
    onError(error as AppException);
  }
}
