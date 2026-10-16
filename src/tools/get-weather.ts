import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { getWeather } from '../services/weather-service.js'

/**
 * Registers the 'get_weather' tool on the MCP server instance.
 *
 * @param server - The McpServer instance to attach the tool to.
 */
export function registerGetWeatherTool(server: McpServer): void {
  server.tool(
    'get_weather',
    'Retrieves the current weather, temperature, and wind speed for any global location using coordinates.',
    {
      city: z
        .string()
        .describe("The name of the city or place to look up (e.g., 'Canberra', 'Paris', 'Tokyo')."),
    },
    async ({ city }) => {
      const text = await getWeather(city)
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
