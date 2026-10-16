#!/usr/bin/env node
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { getCanberra7DaysForecast } from './services/weather-service.js'

/**
 * Retrieves and prints the 7-day weather forecast for Canberra.
 *
 * @param fetchFn - Optional custom fetch function for testing and dependency injection.
 * @param outputFn - Optional output function (defaults to console.log).
 */
export async function getWeather7Days(
  fetchFn: typeof fetch = fetch,
  outputFn: (text: string) => void = console.log,
): Promise<void> {
  const result = await getCanberra7DaysForecast(fetchFn)
  outputFn(result)
}

/**
 * Backward compatibility alias matching snake_case naming.
 */
export const getWeather_7Days = getWeather7Days

/**
 * Backward compatibility alias matching snake_case naming.
 */
export const getWeather_7days = getWeather7Days

const entryPoint = process.argv[1]
if (entryPoint && path.resolve(entryPoint) === fileURLToPath(import.meta.url)) {
  void getWeather7Days()
}
