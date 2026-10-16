#!/usr/bin/env node
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { startWeatherServer } from './weather-server.js'
import { logger } from './utils/logger.js'

/**
 * Main application entrypoint.
 * Boots the MCP server with Stdio transport.
 */
export async function main(): Promise<void> {
  try {
    await startWeatherServer()
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    logger.error(`Fatal server error: ${message}`)
    process.exit(1)
  }
}

const entryPoint = process.argv[1]
if (entryPoint && path.resolve(entryPoint) === fileURLToPath(import.meta.url)) {
  void main()
}
