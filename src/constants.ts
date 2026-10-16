/**
 * Geographic coordinates and timezone settings for Canberra, Australia.
 */
export const CANBERRA_COORDINATES = {
  latitude: -35.2835,
  longitude: 149.1281,
  timezone: 'Australia/Sydney',
} as const

/**
 * Base URL for the Open-Meteo Geocoding API.
 * Configurable via GEOCODING_API_BASE_URL environment variable.
 */
export const GEOCODING_API_BASE_URL: string =
  process.env['GEOCODING_API_BASE_URL'] || 'https://geocoding-api.open-meteo.com/v1/search'

/**
 * Base URL for the Open-Meteo Forecast API.
 * Configurable via FORECAST_API_BASE_URL environment variable.
 */
export const FORECAST_API_BASE_URL: string =
  process.env['FORECAST_API_BASE_URL'] || 'https://api.open-meteo.com/v1/forecast'
