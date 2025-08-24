export function handleAuthError(error: Error): string {
  console.log("Error: ", error);

  return (error as Error).message;
}
