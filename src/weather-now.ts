#!/usr/bin/env node
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { getCanberraWeather } from './services/weather-service.js'

/**
 * Retrieves and prints current Canberra weather from the Open-Meteo API.
 *
 * @param fetchFn - Optional custom fetch function for testing and dependency injection.
 * @param outputFn - Optional output function (defaults to console.log).
 */
export async function getWeatherNow(
  fetchFn: typeof fetch = fetch,
  outputFn: (text: string) => void = console.log,
): Promise<void> {
  const result = await getCanberraWeather(fetchFn)
  outputFn(result)
}

/**
 * Backward compatibility alias matching Python get_weather__now.
 */
export const getWeather_Now = getWeatherNow

/**
 * Backward compatibility alias matching Python get_weather__now.
 */
export const getWeather__now = getWeatherNow

const entryPoint = process.argv[1]
if (entryPoint && path.resolve(entryPoint) === fileURLToPath(import.meta.url)) {
  void getWeatherNow()
}
