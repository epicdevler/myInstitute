/* * NetworkRequest.ts
 * This module provides a singleton class for making network requests.
 * It supports GET and POST requests with JSON body handling.
 * The class is designed to be used as a singleton to ensure that only one instance exists throughout the application.
 */
// src/data/utils/networkRequest.ts

import {
  GetMethodNetworkRequestException,
  PostMethodNetworkRequestException,
  NotFoundException,
  ValidationException,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
  InternalServerErrorException,
  ServiceUnavailableException,
  BadRequestException,
} from "./exceptions";

class NetworkRequest {
  private static instance: NetworkRequest;

  private constructor() {
    // Private constructor to prevent direct instantiation
  }

  /** * Returns the singleton instance of NetworkRequest.
   * If the instance does not exist, it creates a new one.
   * @returns The singleton instance of NetworkRequest.
   */
  static getInstance(): NetworkRequest {
    if (!NetworkRequest.instance) {
      NetworkRequest.instance = new NetworkRequest();
    }
    return NetworkRequest.instance;
  }

  /**
   * Sends a GET request to the specified URL.
   * @param url - The URL to send the GET request to.
   * @param options - Optional additional request options.
   * @returns A promise that resolves to the response data.
   */
  async get<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, { ...options, method: "GET" });
    if (!response.ok) {
      switch (response.status) {
        case 400:
          throw new BadRequestException(`GET request failed: ${response.statusText}`);
        case 401:
          throw new UnauthorizedException(`GET request failed: ${response.statusText}`);
        case 403:
          throw new ForbiddenException(`GET request failed: ${response.statusText}`);
        case 404:
          throw new NotFoundException(`GET request failed: ${response.statusText}`);
        case 409:
          throw new ConflictException(`GET request failed: ${response.statusText}`);
        case 422:
          throw new ValidationException(`GET request failed: ${response.statusText}`);
        case 500:
          throw new InternalServerErrorException(`GET request failed: ${response.statusText}`);
        case 503:
          throw new ServiceUnavailableException(`GET request failed: ${response.statusText}`);
        default:
          throw new GetMethodNetworkRequestException(`GET request failed: ${response.statusText}`);
      }
    }
    return response.json();
  }

  /**
   * Sends a POST request to the specified URL with the provided body.
   * @param url - The URL to send the POST request to.
   * @param body - The body of the POST request, which will be stringified as JSON.
   * @param options - Optional additional request options.
   * @returns A promise that resolves to the response data.
   */
  async post<T>(url: string, body: unknown, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      switch (response.status) {
        case 400:
          throw new BadRequestException(`POST request failed: ${response.statusText}`);
        case 401:
          throw new UnauthorizedException(`POST request failed: ${response.statusText}`);
        case 403:
          throw new ForbiddenException(`POST request failed: ${response.statusText}`);
        case 404:
          throw new NotFoundException(`POST request failed: ${response.statusText}`);
        case 409:
          throw new ConflictException(`POST request failed: ${response.statusText}`);
        case 422:
          throw new ValidationException(`POST request failed: ${response.statusText}`);
        case 500:
          throw new InternalServerErrorException(`POST request failed: ${response.statusText}`);
        case 503:
          throw new ServiceUnavailableException(`POST request failed: ${response.statusText}`);
        default:
          throw new PostMethodNetworkRequestException(`POST request failed: ${response.statusText}`);
      }
    }
    return response.json();
  }
}

export default NetworkRequest;
