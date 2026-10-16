import { describe, expect, it, vi } from 'vitest'
import { getWeatherNow, getWeather_Now, getWeather__now } from '../weather-now.js'
import { getWeather7Days, getWeather_7Days, getWeather_7days } from '../weather-7days.js'

describe('CLI runners and functions', () => {
  describe('weather-now', () => {
    it('calls getCanberraWeather and prints result via outputFn', async () => {
      const mockFetch: typeof fetch = async () =>
        new Response(
          JSON.stringify({
            latitude: -35.2835,
            longitude: 149.1281,
            current: {
              time: '2026-10-14T20:00',
              temperature_2m: 15.0,
              wind_speed_10m: 10.0,
            },
          }),
          { status: 200, statusText: 'OK' },
        )

      const outputSpy = vi.fn()
      await getWeatherNow(mockFetch, outputSpy)

      expect(outputSpy).toHaveBeenCalledWith(
        '☀️ Canberra Current Weather ☀️\nTime:    2026-10-14T20:00\nTemperature: 15°C\nWind speed: 10km/h',
      )
    })

    it('provides backwards compatibility aliases', () => {
      expect(getWeather_Now).toBe(getWeatherNow)
      expect(getWeather__now).toBe(getWeatherNow)
    })
  })

  describe('weather-7days', () => {
    it('calls getCanberra7DaysForecast and prints result via outputFn', async () => {
      const mockFetch: typeof fetch = async () =>
        new Response(
          JSON.stringify({
            latitude: -35.2835,
            longitude: 149.1281,
            daily: {
              time: ['2026-10-14'],
              temperature_2m_max: [22.5],
              temperature_2m_min: [11.2],
              precipitation_probability_max: [5],
            },
          }),
          { status: 200, statusText: 'OK' },
        )

      const outputSpy = vi.fn()
      await getWeather7Days(mockFetch, outputSpy)

      expect(outputSpy).toHaveBeenCalledWith(
        expect.stringContaining('☀️ Canberra 7-day Weather Forecast ☀️'),
      )
      expect(outputSpy).toHaveBeenCalledWith(
        expect.stringContaining('2026-10-14  Wednesday    11.2°C  22.5°C    5%'),
      )
    })

    it('provides backward compatibility aliases', () => {
      expect(getWeather_7Days).toBe(getWeather7Days)
      expect(getWeather_7days).toBe(getWeather7Days)
    })
  })
})
