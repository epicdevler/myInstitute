export interface NetworkRequestRepository {
  /**
   * Send a GET request to the specified URL.
   * @param url The URL to send the GET request to.
   * @param headers Optional headers to include in the request.
   * @returns A promise that resolves to the response data.
    **/

    get<T>(url: string, headers?: Record<string, string>): Promise<T>

    /**
     * Send a POST request to the specified URL with the given data.
     * @param url The URL to send the POST request to.
     * @param data The data to include in the POST request body.
     * @param headers Optional headers to include in the request.
     * @returns A promise that resolves to the response data.
     **/
    post<T>(url: string, data: unknown, headers?: Record<string, string>): Promise<T>
}