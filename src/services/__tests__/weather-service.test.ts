import { describe, expect, it } from 'vitest'
import {
  format7DaysForecast,
  getCanberra7DaysForecast,
  getCanberraWeather,
  getWeather,
  lookupLocation,
} from '../weather-service.js'
import type { DailyForecast } from '../../types.js'

describe('weather-service', () => {
  describe('lookupLocation', () => {
    it('returns formatted location string when city is found with admin1', async () => {
      const mockFetch: typeof fetch = async () =>
        new Response(
          JSON.stringify({
            results: [
              {
                name: 'Canberra',
                country: 'Australia',
                admin1: 'Australian Capital Territory',
                latitude: -35.2835,
                longitude: 149.1281,
              },
            ],
          }),
          { status: 200, statusText: 'OK' },
        )

      const result = await lookupLocation('Canberra', mockFetch)
      expect(result).toBe(
        '📍 Found Location: Canberra, Australian Capital Territory, Australia\nLatitude: -35.2835\nLongitude: 149.1281',
      )
    })

    it('returns formatted location string without admin1 when admin1 is omitted', async () => {
      const mockFetch: typeof fetch = async () =>
        new Response(
          JSON.stringify({
            results: [
              {
                name: 'Singapore',
                country: 'Singapore',
                latitude: 1.3521,
                longitude: 103.8198,
              },
            ],
          }),
          { status: 200, statusText: 'OK' },
        )

      const result = await lookupLocation('Singapore', mockFetch)
      expect(result).toBe(
        '📍 Found Location: Singapore, Singapore\nLatitude: 1.3521\nLongitude: 103.8198',
      )
    })

    it('falls back to "Unknown Country" if country is not provided', async () => {
      const mockFetch: typeof fetch = async () =>
        new Response(
          JSON.stringify({
            results: [
              {
                name: 'Unknown Place',
                latitude: 0,
                longitude: 0,
              },
            ],
          }),
          { status: 200, statusText: 'OK' },
        )

      const result = await lookupLocation('Unknown Place', mockFetch)
      expect(result).toBe(
        '📍 Found Location: Unknown Place, Unknown Country\nLatitude: 0\nLongitude: 0',
      )
    })

    it('returns not found message when results array is empty', async () => {
      const mockFetch: typeof fetch = async () =>
        new Response(JSON.stringify({ results: [] }), { status: 200, statusText: 'OK' })

      const result = await lookupLocation('NonExistentCity12345', mockFetch)
      expect(result).toBe(
        "❌ Could not find any location coordinates matching 'NonExistentCity12345'.",
      )
    })

    it('returns not found message when results property is undefined', async () => {
      const mockFetch: typeof fetch = async () =>
        new Response(JSON.stringify({}), { status: 200, statusText: 'OK' })

      const result = await lookupLocation('MissingFieldCity', mockFetch)
      expect(result).toBe("❌ Could not find any location coordinates matching 'MissingFieldCity'.")
    })

    it('returns error message when fetch fails with HTTP error', async () => {
      const mockFetch: typeof fetch = async () =>
        new Response('Internal Error', { status: 500, statusText: 'Internal Server Error' })

      const result = await lookupLocation('Canberra', mockFetch)
      expect(result).toBe(
        "Error during location lookup for 'Canberra': HTTP 500: Internal Server Error",
      )
    })

    it('returns error message when fetch throws a network error', async () => {
      const mockFetch: typeof fetch = async () => {
        throw new Error('Network timeout')
      }

      const result = await lookupLocation('Canberra', mockFetch)
      expect(result).toBe("Error during location lookup for 'Canberra': Network timeout")
    })

    it('handles non-Error exceptions gracefully', async () => {
      const mockFetch: typeof fetch = async () => {
        throw 'Unexpected string rejection'
      }

      const result = await lookupLocation('Canberra', mockFetch)
      expect(result).toBe(
        "Error during location lookup for 'Canberra': Unexpected string rejection",
      )
    })
  })

  describe('getWeather', () => {
    it('returns weather report when city and forecast are found', async () => {
      const mockFetch: typeof fetch = async (input) => {
        const url = String(input)
        if (url.includes('geocoding-api.open-meteo.com')) {
          return new Response(
            JSON.stringify({
              results: [
                {
                  name: 'Tokyo',
                  country: 'Japan',
                  latitude: 35.6762,
                  longitude: 139.6503,
                },
              ],
            }),
            { status: 200, statusText: 'OK' },
          )
        }

        return new Response(
          JSON.stringify({
            latitude: 35.6762,
            longitude: 139.6503,
            current: {
              time: '2026-10-14T12:00',
              temperature_2m: 19.5,
              wind_speed_10m: 11.2,
            },
          }),
          { status: 200, statusText: 'OK' },
        )
      }

      const result = await getWeather('Tokyo', mockFetch)
      expect(result).toBe(
        '🌍 Weather Report 🌍\nTime:    2026-10-14T12:00\nTemperature: 19.5°C\nWind speed: 11.2km/h',
      )
    })

    it('returns not found message when geocoding results are empty', async () => {
      const mockFetch: typeof fetch = async () =>
        new Response(JSON.stringify({ results: [] }), { status: 200, statusText: 'OK' })

      const result = await getWeather('UnknownCity99', mockFetch)
      expect(result).toBe("❌ Could not find any location coordinates matching 'UnknownCity99'.")
    })

    it('returns error with None coordinates if geocoding fetch fails', async () => {
      const mockFetch: typeof fetch = async () =>
        new Response('Bad Gateway', { status: 502, statusText: 'Bad Gateway' })

      const result = await getWeather('Paris', mockFetch)
      expect(result).toBe(
        'Error fetching weather data for coordinates (None, None) of city Paris: HTTP 502: Bad Gateway',
      )
    })

    it('returns error with coordinates if forecast fetch fails', async () => {
      const mockFetch: typeof fetch = async (input) => {
        const url = String(input)
        if (url.includes('geocoding-api.open-meteo.com')) {
          return new Response(
            JSON.stringify({
              results: [
                {
                  name: 'Paris',
                  country: 'France',
                  latitude: 48.8566,
                  longitude: 2.3522,
                },
              ],
            }),
            { status: 200, statusText: 'OK' },
          )
        }

        return new Response('Forecast unavailable', {
          status: 503,
          statusText: 'Service Unavailable',
        })
      }

      const result = await getWeather('Paris', mockFetch)
      expect(result).toBe(
        'Error fetching weather data for coordinates (48.8566, 2.3522) of city Paris: HTTP 503: Service Unavailable',
      )
    })
  })

  describe('getCanberraWeather', () => {
    it('returns formatted Canberra weather on success', async () => {
      const mockFetch: typeof fetch = async () =>
        new Response(
          JSON.stringify({
            latitude: -35.2835,
            longitude: 149.1281,
            current: {
              time: '2026-10-14T20:00',
              temperature_2m: 14.8,
              wind_speed_10m: 7.5,
            },
          }),
          { status: 200, statusText: 'OK' },
        )

      const result = await getCanberraWeather(mockFetch)
      expect(result).toBe(
        '☀️ Canberra Current Weather ☀️\nTime:    2026-10-14T20:00\nTemperature: 14.8°C\nWind speed: 7.5km/h',
      )
    })

    it('returns error message when fetch fails', async () => {
      const mockFetch: typeof fetch = async () =>
        new Response('Server error', { status: 500, statusText: 'Internal Server Error' })

      const result = await getCanberraWeather(mockFetch)
      expect(result).toBe('Error fetching weather data: HTTP 500: Internal Server Error')
    })
  })

  describe('format7DaysForecast', () => {
    it('formats a 7-day forecast series into an ASCII table matching Python output', () => {
      const sampleDaily: DailyForecast = {
        time: ['2026-10-14', '2026-10-15'],
        temperature_2m_max: [18.2, 21.0],
        temperature_2m_min: [8.5, 9.3],
        precipitation_probability_max: [10, 0],
      }

      const output = format7DaysForecast(sampleDaily)
      const lines = output.split('\n')

      expect(lines[0]).toBe('☀️ Canberra 7-day Weather Forecast ☀️')
      expect(lines[1]).toBe('')
      expect(lines[2]).toBe(
        `${'Date'.padEnd(12)}${'Day'.padEnd(12)}${'Min'.padEnd(8)}${'Max'.padEnd(8)}${'Rain'.padEnd(6)}`,
      )
      expect(lines[3]).toBe('2026-10-14  Wednesday     8.5°C  18.2°C   10%')
      expect(lines[4]).toBe('2026-10-15  Thursday      9.3°C  21.0°C    0%')
    })
  })

  describe('getCanberra7DaysForecast', () => {
    it('retrieves and formats 7-day Canberra weather forecast', async () => {
      const mockFetch: typeof fetch = async () =>
        new Response(
          JSON.stringify({
            latitude: -35.2835,
            longitude: 149.1281,
            daily: {
              time: ['2026-10-14'],
              temperature_2m_max: [20.0],
              temperature_2m_min: [10.0],
              precipitation_probability_max: [25],
            },
          }),
          { status: 200, statusText: 'OK' },
        )

      const result = await getCanberra7DaysForecast(mockFetch)
      expect(result).toContain('☀️ Canberra 7-day Weather Forecast ☀️')
      expect(result).toContain('2026-10-14  Wednesday    10.0°C  20.0°C   25%')
    })

    it('returns error message when forecast request fails', async () => {
      const mockFetch: typeof fetch = async () =>
        new Response('Service Unavailable', {
          status: 503,
          statusText: 'Service Unavailable',
        })

      const result = await getCanberra7DaysForecast(mockFetch)
      expect(result).toBe('Error fetching weather data: HTTP 503: Service Unavailable')
    })
  })
})
