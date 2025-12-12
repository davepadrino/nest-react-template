/**
 *
 * Simple logging utility for the frontend
 */
export class Logger {
  constructor(private context: string) {}

  // TODO: improve typing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private formatMessage(level: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const dataStr = data ? JSON.stringify(data) : '';
    return `[${timestamp}] [${level}] [${this.context}] ${message} ${dataStr}`;
  }

  // TODO: improve typing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log(message: string, data?: any) {
    console.log(this.formatMessage('INFO', message, data));
  }

  // TODO: improve typing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(message: string, error?: any) {
    console.error(this.formatMessage('ERROR', message, error));
  }

  // TODO: improve typing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn(message: string, data?: any) {
    console.warn(this.formatMessage('WARN', message, data));
  }

  // TODO: improve typing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug(message: string, data?: any) {
    if (import.meta.env.DEV) {
      console.debug(this.formatMessage('DEBUG', message, data));
    }
  }
}
