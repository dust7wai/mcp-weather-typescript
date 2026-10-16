import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { getCanberra7DaysForecast } from '../services/weather-service.js'

/**
 * Registers the 'get_canberra_7days_weather' tool on the MCP server instance.
 *
 * @param server - The McpServer instance to attach the tool to.
 */
export function registerGetCanberra7DaysWeatherTool(server: McpServer): void {
  server.tool(
    'get_canberra_7days_weather',
    'Retrieves the 7-day weather forecast for Canberra, Australia.',
    async () => {
      const text = await getCanberra7DaysForecast()
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
