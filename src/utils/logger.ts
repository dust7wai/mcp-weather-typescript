import type { Logger } from '../types.js'

/**
 * Standard structured logger writing directly to process.stderr.
 * This protects process.stdout from pollution during MCP stdio communication.
 */
export const logger: Logger = {
  info: (message: string): void => {
    process.stderr.write(`[INFO] ${message}\n`)
  },
  warn: (message: string): void => {
    process.stderr.write(`[WARN] ${message}\n`)
  },
  error: (message: string): void => {
    process.stderr.write(`[ERROR] ${message}\n`)
  },
}
