/**
 * Geographic location item returned from the Open-Meteo Geocoding API.
 */
export interface GeocodingLocation {
  readonly id?: number
  readonly name: string
  readonly latitude: number
  readonly longitude: number
  readonly elevation?: number
  readonly feature_code?: string
  readonly country_code?: string
  readonly country?: string
  readonly admin1?: string
  readonly admin2?: string
  readonly timezone?: string
  readonly population?: number
}

/**
 * Open-Meteo Geocoding API response payload.
 */
export interface GeocodingResponse {
  readonly results?: readonly GeocodingLocation[]
  readonly generationtime_ms?: number
}

/**
 * Current weather block in the Open-Meteo Forecast API response.
 */
export interface CurrentWeather {
  readonly time: string
  readonly interval?: number
  readonly temperature_2m: number
  readonly wind_speed_10m: number
}

/**
 * Open-Meteo Forecast API response payload for current weather.
 */
export interface ForecastResponse {
  readonly latitude: number
  readonly longitude: number
  readonly generationtime_ms?: number
  readonly utc_offset_seconds?: number
  readonly timezone?: string
  readonly timezone_abbreviation?: string
  readonly elevation?: number
  readonly current: CurrentWeather
}

/**
 * Daily weather series in the Open-Meteo Forecast API response.
 */
export interface DailyForecast {
  readonly time: readonly string[]
  readonly temperature_2m_max: readonly number[]
  readonly temperature_2m_min: readonly number[]
  readonly precipitation_probability_max: readonly number[]
}

/**
 * Open-Meteo Forecast API response payload for 7-day daily forecast.
 */
export interface DailyForecastResponse {
  readonly latitude: number
  readonly longitude: number
  readonly generationtime_ms?: number
  readonly timezone?: string
  readonly daily: DailyForecast
}

/**
 * Forecast daily entry formatted for display.
 */
export interface DailyForecastEntry {
  readonly date: string
  readonly day: string
  readonly minTemp: number
  readonly maxTemp: number
  readonly precipitationProbability: number
}

/**
 * Standard structured logger interface directing output to stderr.
 */
export interface Logger {
  info: (message: string) => void
  warn: (message: string) => void
  error: (message: string) => void
}
