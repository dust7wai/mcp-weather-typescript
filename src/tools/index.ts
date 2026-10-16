import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { registerLookupLocationTool } from './lookup-location.js'
import { registerGetWeatherTool } from './get-weather.js'
import { registerGetCanberraWeatherTool } from './get-canberra-weather.js'
import { registerGetCanberra7DaysWeatherTool } from './get-canberra-7days-weather.js'

/**
 * Registers all weather and location tools to the provided McpServer instance.
 *
 * @param server - The McpServer instance to configure.
 */
export function registerAllTools(server: McpServer): void {
  registerLookupLocationTool(server)
  registerGetWeatherTool(server)
  registerGetCanberraWeatherTool(server)
  registerGetCanberra7DaysWeatherTool(server)
}

export {
  registerLookupLocationTool,
  registerGetWeatherTool,
  registerGetCanberraWeatherTool,
  registerGetCanberra7DaysWeatherTool,
}
