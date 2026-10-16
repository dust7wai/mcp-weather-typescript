import { describe, expect, it, vi } from 'vitest'
import { logger } from '../logger.js'

describe('logger', () => {
  it('writes INFO logs to process.stderr', () => {
    const stderrSpy = vi.spyOn(process.stderr, 'write').mockReturnValue(true)

    logger.info('System is starting up')
    expect(stderrSpy).toHaveBeenCalledWith('[INFO] System is starting up\n')

    stderrSpy.mockRestore()
  })

  it('writes WARN logs to process.stderr', () => {
    const stderrSpy = vi.spyOn(process.stderr, 'write').mockReturnValue(true)

    logger.warn('Resource warning occurred')
    expect(stderrSpy).toHaveBeenCalledWith('[WARN] Resource warning occurred\n')

    stderrSpy.mockRestore()
  })

  it('writes ERROR logs to process.stderr', () => {
    const stderrSpy = vi.spyOn(process.stderr, 'write').mockReturnValue(true)

    logger.error('Critical failure occurred')
    expect(stderrSpy).toHaveBeenCalledWith('[ERROR] Critical failure occurred\n')

    stderrSpy.mockRestore()
  })
})
