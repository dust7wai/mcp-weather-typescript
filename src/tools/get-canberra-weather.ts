import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { getCanberraWeather } from '../services/weather-service.js'

/**
 * Registers the 'get_canberra_weather' tool on the MCP server instance.
 *
 * @param server - The McpServer instance to attach the tool to.
 */
export function registerGetCanberraWeatherTool(server: McpServer): void {
  server.tool(
    'get_canberra_weather',
    'Retrieves the current weather, temperature, and wind speed for Canberra, Australia.',
    async () => {
      const text = await getCanberraWeather()
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
