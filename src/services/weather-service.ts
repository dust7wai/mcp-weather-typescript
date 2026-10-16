import {
  CANBERRA_COORDINATES,
  FORECAST_API_BASE_URL,
  GEOCODING_API_BASE_URL,
} from '../constants.js'
import type {
  DailyForecast,
  DailyForecastResponse,
  ForecastResponse,
  GeocodingResponse,
} from '../types.js'

/**
 * Looks up geographic coordinates (latitude and longitude) for a given city or place name.
 *
 * @param name - The name of the city or place to look up (e.g., 'Canberra', 'Paris', 'Tokyo').
 * @param fetchFn - Optional fetch implementation for testing and dependency injection.
 * @returns Formatted location string or error message.
 */
export async function lookupLocation(name: string, fetchFn: typeof fetch = fetch): Promise<string> {
  const url = `${GEOCODING_API_BASE_URL}?name=${encodeURIComponent(name)}&count=1&language=en`

  try {
    const response = await fetchFn(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = (await response.json()) as GeocodingResponse
    const location = data.results?.[0]
    if (!location) {
      return `❌ Could not find any location coordinates matching '${name}'.`
    }

    const city = location.name
    const country = location.country ?? 'Unknown Country'
    const admin1 = location.admin1 ?? ''
    const lat = location.latitude
    const lon = location.longitude

    const regionInfo = admin1 ? `${city}, ${admin1}, ${country}` : `${city}, ${country}`

    return `📍 Found Location: ${regionInfo}\nLatitude: ${lat}\nLongitude: ${lon}`
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return `Error during location lookup for '${name}': ${message}`
  }
}

/**
 * Retrieves the current weather, temperature, and wind speed for any global location using coordinates.
 *
 * @param city - The name of the city or place to look up (e.g., 'Canberra', 'Paris', 'Tokyo').
 * @param fetchFn - Optional fetch implementation for testing and dependency injection.
 * @returns Formatted weather report string or error message.
 */
export async function getWeather(city: string, fetchFn: typeof fetch = fetch): Promise<string> {
  const urlCity = `${GEOCODING_API_BASE_URL}?name=${encodeURIComponent(city)}&count=1&language=en`
  let latitude: number | null = null
  let longitude: number | null = null

  try {
    const responseCity = await fetchFn(urlCity)
    if (!responseCity.ok) {
      throw new Error(`HTTP ${responseCity.status}: ${responseCity.statusText}`)
    }

    const dataCity = (await responseCity.json()) as GeocodingResponse
    const location = dataCity.results?.[0]
    if (!location) {
      return `❌ Could not find any location coordinates matching '${city}'.`
    }

    latitude = location.latitude
    longitude = location.longitude

    const urlForecast =
      `${FORECAST_API_BASE_URL}?` +
      `latitude=${latitude}&longitude=${longitude}` +
      '&current=temperature_2m,wind_speed_10m' +
      '&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m' +
      '&timezone=auto'

    const response = await fetchFn(urlForecast)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = (await response.json()) as ForecastResponse
    const current = data.current
    const time = current.time
    const temp = current.temperature_2m
    const wind = current.wind_speed_10m

    return `🌍 Weather Report 🌍\nTime:    ${time}\nTemperature: ${temp}°C\nWind speed: ${wind}km/h`
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    const latStr = latitude === null ? 'None' : latitude
    const lonStr = longitude === null ? 'None' : longitude
    return `Error fetching weather data for coordinates (${latStr}, ${lonStr}) of city ${city}: ${message}`
  }
}

/**
 * Retrieves the current weather, temperature, and wind speed for Canberra, Australia.
 *
 * @param fetchFn - Optional fetch implementation for testing and dependency injection.
 * @returns Formatted Canberra weather report or error message.
 */
export async function getCanberraWeather(fetchFn: typeof fetch = fetch): Promise<string> {
  const url =
    `${FORECAST_API_BASE_URL}?` +
    `latitude=${CANBERRA_COORDINATES.latitude}&longitude=${CANBERRA_COORDINATES.longitude}` +
    '&current=temperature_2m,wind_speed_10m' +
    '&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m' +
    `&timezone=${encodeURIComponent(CANBERRA_COORDINATES.timezone)}`

  try {
    const response = await fetchFn(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = (await response.json()) as ForecastResponse
    const current = data.current
    const time = current.time
    const temp = current.temperature_2m
    const wind = current.wind_speed_10m

    return `☀️ Canberra Current Weather ☀️\nTime:    ${time}\nTemperature: ${temp}°C\nWind speed: ${wind}km/h`
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return `Error fetching weather data: ${message}`
  }
}

/**
 * Formats daily forecast data into an aligned ASCII text table.
 *
 * @param daily - Daily forecast series containing timestamps, temperatures, and rain chances.
 * @returns Formatted table string with header and daily rows.
 */
export function format7DaysForecast(daily: DailyForecast): string {
  const dates = daily.time
  const maxTemps = daily.temperature_2m_max
  const minTemps = daily.temperature_2m_min
  const rainProbs = daily.precipitation_probability_max

  const headerLines = [
    '☀️ Canberra 7-day Weather Forecast ☀️',
    '',
    `${'Date'.padEnd(12)}${'Day'.padEnd(12)}${'Min'.padEnd(8)}${'Max'.padEnd(8)}${'Rain'.padEnd(6)}`,
  ]

  const rowLines = dates.map((date, index) => {
    const minTemp = minTemps[index] ?? 0
    const maxTemp = maxTemps[index] ?? 0
    const rain = rainProbs[index] ?? 0

    const dateObj = new Date(`${date}T00:00:00Z`)
    const day = dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      timeZone: 'UTC',
    })

    const formattedDate = date.padEnd(12)
    const formattedDay = day.padEnd(12)
    const formattedMin = `${minTemp.toFixed(1).padStart(5)}°C `
    const formattedMax = `${maxTemp.toFixed(1).padStart(5)}°C `
    const formattedRain = `${rain.toString().padStart(4)}%`

    return `${formattedDate}${formattedDay}${formattedMin}${formattedMax}${formattedRain}`
  })

  return [...headerLines, ...rowLines].join('\n')
}

/**
 * Retrieves the 7-day weather forecast for Canberra, Australia.
 *
 * @param fetchFn - Optional fetch implementation for testing and dependency injection.
 * @returns Formatted 7-day table string or error message.
 */
export async function getCanberra7DaysForecast(fetchFn: typeof fetch = fetch): Promise<string> {
  const url =
    `${FORECAST_API_BASE_URL}?` +
    `latitude=${CANBERRA_COORDINATES.latitude}&longitude=${CANBERRA_COORDINATES.longitude}` +
    '&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max' +
    `&timezone=${encodeURIComponent(CANBERRA_COORDINATES.timezone)}` +
    '&forecast_days=7'

  try {
    const response = await fetchFn(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = (await response.json()) as DailyForecastResponse
    return format7DaysForecast(data.daily)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return `Error fetching weather data: ${message}`
  }
}
