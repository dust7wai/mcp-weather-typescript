import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { lookupLocation } from '../services/weather-service.js'

/**
 * Registers the 'lookup_location' tool on the MCP server instance.
 *
 * @param server - The McpServer instance to attach the tool to.
 */
export function registerLookupLocationTool(server: McpServer): void {
  server.tool(
    'lookup_location',
    'Looks up geographic coordinates (latitude and longitude) for a given city or place name.',
    {
      name: z
        .string()
        .describe("The name of the city or place to look up (e.g., 'Canberra', 'Paris', 'Tokyo')."),
    },
    async ({ name }) => {
      const text = await lookupLocation(name)
      return {
        content: [
          {
            type: 'text',
            text,
          },
        ],
      }
    },
  )
}
