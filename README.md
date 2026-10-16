# mcp-weather-typescript

A TypeScript-first Model Context Protocol (MCP) server and CLI toolset for retrieving weather forecasts and geographic coordinates via Open-Meteo, replicating the full feature set from the `python/` directory.

## 🌤️ Features

- **MCP Weather & Location Server**: Fully-featured Model Context Protocol server exposing tools over standard input/output (`stdio`) JSON-RPC transport:
  - `lookup_location`: Resolves geographic coordinates (latitude and longitude) for any city or location.
  - `get_weather`: Retrieves real-time temperature and wind speed for any city worldwide.
  - `get_canberra_weather`: Retrieves real-time weather, temperature, and wind speed for Canberra, Australia.
  - `get_canberra_7days_weather`: Provides a 7-day daily weather forecast table for Canberra, Australia.
- **CLI Utilities**:
  - `weather-now`: Quick CLI tool retrieving current weather for Canberra.
  - `weather-7days`: Formatted 7-day forecast table for Canberra.
- **Stream Protection**: All informational and diagnostic logging is safely directed to `process.stderr` to prevent JSON-RPC transport corruption on `process.stdout`.
- **Strict TypeScript & Full Test Coverage**: Fully typed with strict checks and complete unit test coverage via Vitest.

## 📦 Installation

Ensure you have Node.js (v18+) and [pnpm](https://pnpm.io/) installed:

```bash
pnpm install
```

## 🚀 Usage

### 1. Run MCP Server

```bash
# In development mode (tsx)
pnpm run dev

# Or build and run production binary
pnpm run build
node dist/index.js
```

#### MCP Client Configuration Example (e.g. Claude Desktop / Cursor)

```json
{
  "mcpServers": {
    "weather": {
      "command": "node",
      "args": ["/path/to/mcp-weather-typescript/dist/index.js"]
    }
  }
}
```

### 2. Standalone Weather Scripts

```bash
# Current Canberra weather
pnpm run weather:now
# or directly with built output:
node dist/weather-now.js

# 7-day Canberra weather forecast
pnpm run weather:7days
# or directly with built output:
node dist/weather-7days.js
```

## 🛠️ Development & Quality Assurance

| Action | Command |
| :--- | :--- |
| **Type Check** | `pnpm run typecheck` |
| **Run Unit Tests** | `pnpm test` |
| **Run Test Coverage** | `pnpm run test:coverage` |
| **Linting** | `pnpm run lint` |
| **Format Check** | `pnpm run format:check` |
| **Format Fix** | `pnpm run format` |
| **Build Project** | `pnpm run build` |

## 📁 Project Structure

```text
mcp-weather-typescript/
├── python/                     # Original Python reference implementations
│   ├── weather_now.py
│   ├── weather_7days.py
│   └── weather_server.py
├── src/
│   ├── __tests__/              # Integration and CLI unit tests
│   ├── services/
│   │   ├── __tests__/          # Weather service unit tests
│   │   └── weather-service.ts  # Open-Meteo API client and forecast formatting
│   ├── tools/
│   │   ├── __tests__/          # MCP tool registration tests
│   │   ├── get-canberra-7days-weather.ts
│   │   ├── get-canberra-weather.ts
│   │   ├── get-weather.ts
│   │   ├── lookup-location.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── __tests__/          # Logger tests
│   │   └── logger.ts           # Stderr-safe structured logger
│   ├── constants.ts            # Coordinates, API endpoints, environment config
│   ├── index.ts                # Main server entrypoint (Stdio transport)
│   ├── types.ts                # TypeScript interfaces and data models
│   ├── weather-7days.ts        # CLI runner replicating weather_7days.py
│   └── weather-now.ts          # CLI runner replicating weather_now.py
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── tsconfig.build.json
└── vitest.config.ts
```
