import { describe, expect, it, vi } from 'vitest'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import {
  registerAllTools,
  registerGetCanberra7DaysWeatherTool,
  registerGetCanberraWeatherTool,
  registerGetWeatherTool,
  registerLookupLocationTool,
} from '../index.js'
import * as weatherService from '../../services/weather-service.js'

interface RegisteredTool {
  description?: string
  handler: (
    args: Record<string, unknown>,
  ) => Promise<{ content: Array<{ type: string; text: string }> }>
}

interface McpServerInternals {
  _registeredTools: Record<string, RegisteredTool>
}

function getRegisteredTool(server: McpServer, name: string): RegisteredTool {
  const internals = server as unknown as McpServerInternals
  const tool = internals._registeredTools[name]
  if (!tool) {
    throw new Error(`Tool ${name} not found`)
  }
  return tool
}

describe('MCP Tools Registration', () => {
  it('registers and executes lookup_location tool', async () => {
    const server = new McpServer({ name: 'test-server', version: '1.0.0' })
    registerLookupLocationTool(server)

    const tool = getRegisteredTool(server, 'lookup_location')
    expect(tool.description).toContain('Looks up geographic coordinates')

    const spy = vi
      .spyOn(weatherService, 'lookupLocation')
      .mockResolvedValueOnce('📍 Found Location: Canberra')

    const result = await tool.handler({ name: 'Canberra' })
    expect(spy).toHaveBeenCalledWith('Canberra')
    expect(result.content[0]?.text).toBe('📍 Found Location: Canberra')
  })

  it('registers and executes get_weather tool', async () => {
    const server = new McpServer({ name: 'test-server', version: '1.0.0' })
    registerGetWeatherTool(server)

    const tool = getRegisteredTool(server, 'get_weather')
    expect(tool.description).toContain('Retrieves the current weather')

    const spy = vi
      .spyOn(weatherService, 'getWeather')
      .mockResolvedValueOnce('🌍 Weather Report: 20°C')

    const result = await tool.handler({ city: 'Sydney' })
    expect(spy).toHaveBeenCalledWith('Sydney')
    expect(result.content[0]?.text).toBe('🌍 Weather Report: 20°C')
  })

  it('registers and executes get_canberra_weather tool', async () => {
    const server = new McpServer({ name: 'test-server', version: '1.0.0' })
    registerGetCanberraWeatherTool(server)

    const tool = getRegisteredTool(server, 'get_canberra_weather')
    expect(tool.description).toContain('Canberra, Australia')

    const spy = vi
      .spyOn(weatherService, 'getCanberraWeather')
      .mockResolvedValueOnce('☀️ Canberra Current Weather')

    const result = await tool.handler({})
    expect(spy).toHaveBeenCalled()
    expect(result.content[0]?.text).toBe('☀️ Canberra Current Weather')
  })

  it('registers and executes get_canberra_7days_weather tool', async () => {
    const server = new McpServer({ name: 'test-server', version: '1.0.0' })
    registerGetCanberra7DaysWeatherTool(server)

    const tool = getRegisteredTool(server, 'get_canberra_7days_weather')
    expect(tool.description).toContain('7-day weather forecast')

    const spy = vi
      .spyOn(weatherService, 'getCanberra7DaysForecast')
      .mockResolvedValueOnce('☀️ Canberra 7-day Weather Forecast')

    const result = await tool.handler({})
    expect(spy).toHaveBeenCalled()
    expect(result.content[0]?.text).toBe('☀️ Canberra 7-day Weather Forecast')
  })

  it('registers all tools when calling registerAllTools', () => {
    const server = new McpServer({ name: 'test-server', version: '1.0.0' })
    registerAllTools(server)

    const internals = server as unknown as McpServerInternals
    expect(internals._registeredTools['lookup_location']).toBeDefined()
    expect(internals._registeredTools['get_weather']).toBeDefined()
    expect(internals._registeredTools['get_canberra_weather']).toBeDefined()
    expect(internals._registeredTools['get_canberra_7days_weather']).toBeDefined()
  })
})
