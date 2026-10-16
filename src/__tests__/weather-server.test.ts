import { describe, expect, it, vi } from 'vitest'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { createWeatherServer, startWeatherServer } from '../weather-server.js'
import * as weatherServerModule from '../weather-server.js'
import { logger } from '../utils/logger.js'
import { main } from '../index.js'

describe('weather-server', () => {
  it('creates an McpServer instance with registered weather tools', () => {
    const server = createWeatherServer()
    expect(server).toBeInstanceOf(McpServer)
  })

  it('starts the server and connects to transport', async () => {
    const connectSpy = vi.spyOn(McpServer.prototype, 'connect').mockResolvedValueOnce(undefined)

    await startWeatherServer()
    expect(connectSpy).toHaveBeenCalled()

    connectSpy.mockRestore()
  })

  describe('main entrypoint', () => {
    it('executes startWeatherServer successfully in main', async () => {
      const startSpy = vi
        .spyOn(weatherServerModule, 'startWeatherServer')
        .mockResolvedValueOnce(undefined)

      await main()
      expect(startSpy).toHaveBeenCalled()

      startSpy.mockRestore()
    })

    it('logs error and exits process when server encounters fatal error', async () => {
      const startSpy = vi
        .spyOn(weatherServerModule, 'startWeatherServer')
        .mockRejectedValueOnce(new Error('Port binding failure'))

      const loggerSpy = vi.spyOn(logger, 'error').mockImplementation(() => {})
      const exitSpy = vi
        .spyOn(process, 'exit')
        .mockImplementation((() => {}) as unknown as typeof process.exit)

      await main()

      expect(loggerSpy).toHaveBeenCalledWith('Fatal server error: Port binding failure')
      expect(exitSpy).toHaveBeenCalledWith(1)

      startSpy.mockRestore()
      loggerSpy.mockRestore()
      exitSpy.mockRestore()
    })
  })
})
