/**
 * Error Handler
 *
 * Centralized error handling for the application
 */
export class ErrorHandler {
  // TODO: improve typing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static handle(error: any): string {
    if (error.response) {
      // HTTP error response
      const message = error.response.data?.message || error.response.statusText;
      return `Error: ${message}`;
    } else if (error.request) {
      return 'Network error. Please check your connection and try again.';
    } else if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred.';
  }

  // TODO: improve typing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static getUserFriendlyMessage(error: any): string {
    const statusCode = error.response?.status;

    switch (statusCode) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'A conflict occurred. The resource may already exist.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return this.handle(error);
    }
  }
}
