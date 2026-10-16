import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { registerAllTools } from './tools/index.js'
import { logger } from './utils/logger.js'

/**
 * Creates and configures the Global Weather & Location MCP server instance.
 *
 * @returns Configured McpServer instance with registered weather tools.
 */
export function createWeatherServer(): McpServer {
  const server = new McpServer({
    name: 'Global Weather & Location Server',
    version: '1.0.0',
  })

  registerAllTools(server)
  return server
}

/**
 * Starts the Global Weather & Location MCP server using Stdio transport.
 */
export async function startWeatherServer(): Promise<void> {
  const server = createWeatherServer()
  const transport = new StdioServerTransport()

  logger.info('Starting Global Weather & Location MCP Server on Stdio transport...')
  await server.connect(transport)
  logger.info('Global Weather & Location MCP Server running.')
}
