# Travel Logs

A full-stack travel log manager built with **Laravel 12** (API) and **React + TypeScript** (frontend).

---

## Features

- **Create, edit, delete** travel logs — flights, rail, car, hotel
- **Geocoded location search** — type a city name, pick from OpenStreetMap autocomplete; city, country and coordinates are stored automatically (no manual input)
- **Bulk CSV upload** — import many logs at once with a live progress bar (background queue job)
- **Activity Breakdown** — donut pie chart showing your log distribution by type
- **Country Heatmap** — world choropleth map coloured by how many times you've visited each country (updates live when logs are added/edited/deleted)

---

## Project Structure

```
travel_logs/        ← Laravel API (backend)
travel_logs/react/  ← React app (frontend)
```

---

## Prerequisites

| Tool | Why |
|---|---|
| **PHP 8.2+** | Runs Laravel |
| **Composer** | Installs PHP dependencies |
| **Node.js 18+** | Runs the React/Vite dev server |
| **npm** | Installs JS dependencies |
| **SQLite** | Default database — single file, no server needed |

---

## Setup

### 1 — Clone

```bash
git clone https://github.com/mvuja/travel_logs
cd travel_logs
```

### 2 — Install PHP dependencies

```bash
composer install
```

### 3 — Environment file

```bash
cp .env.example .env
```

The defaults work out of the box for a local SQLite setup — nothing to change.

### 4 — App key

```bash
php artisan key:generate
```

Laravel needs this to encrypt cookies and sessions.

### 5 — Create the SQLite file

```bash
touch database/database.sqlite
```

SQLite stores everything in this single file. It must exist before running migrations.

### 6 — Run migrations

```bash
php artisan migrate
```

### 7 — Install frontend dependencies

```bash
cd react
npm install
```

---

## Running the App

You need **three terminals** open from the project root.

### Terminal 1 — Laravel API

```bash
php artisan serve
```

Starts the API at **http://localhost:8000**.

### Terminal 2 — Queue worker (required for bulk upload)

```bash
php artisan queue:listen --tries=1
```

Processes background jobs. Without this, bulk CSV uploads will stay stuck at `queued`.

### Terminal 3 — React frontend

```bash
cd react
npm run dev
```

Starts the Vite dev server at **http://localhost:5173**. API calls are automatically proxied to port 8000 — no CORS config needed.

---

## Opening the App

Go to **http://localhost:5173**

You'll see:
- **Your Logs** — full list with edit/delete actions
- **Insights** — Activity pie chart + Country heatmap side by side
- **New Log** / **Bulk Upload** buttons in the header

When creating a log, type a city in the location search boxes and **select a result from the dropdown** — this ensures the country is correctly geocoded and will appear on the heatmap.

---

## API Reference

Base URL: `http://localhost:8000/api`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/travel-logs` | List all logs |
| `POST` | `/travel-logs` | Create a log |
| `GET` | `/travel-logs/{id}` | Get a single log |
| `PUT` | `/travel-logs/{id}` | Update a log |
| `DELETE` | `/travel-logs/{id}` | Delete a log |
| `POST` | `/travel-logs/bulk-upload` | Upload CSV (returns `queueTaskId`) |
| `GET` | `/queue-tasks/{id}` | Poll bulk-upload progress |
| `GET` | `/stats/types` | Count of logs per type |
| `GET` | `/stats/countries` | Visit count per country |

### Example — Create a log

```bash
curl -X POST http://localhost:8000/api/travel-logs \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "type": "flight",
    "departureDate": "2025-06-01T08:00",
    "arrivalDate": "2025-06-01T12:00",
    "city": "London",
    "country": "United Kingdom",
    "placeName": "London, England, United Kingdom",
    "latitude": 51.5074,
    "longitude": -0.1278,
    "fromCity": "Paris",
    "fromCountry": "France",
    "fromPlaceName": "Paris, Île-de-France, France",
    "fromLat": 48.8566,
    "fromLng": 2.3522
  }'
```

### Bulk CSV format

```csv
type,departure_date,arrival_date,departure_place,arrival_place,accommodation_place,comment
flight,2025-06-01T08:00,2025-06-01T12:00,London,New York,,Summer trip
hotel,2025-06-05T14:00,2025-06-08T11:00,,,Marriott Brussels,Conference stay
```

---

## Running Tests

```bash
php artisan test
# or
./vendor/bin/pest
```

---

## Technologies

| Layer | Stack |
|---|---|
| Backend | Laravel 12, PHP 8.2, SQLite |
| Validation / DTOs | spatie/laravel-data |
| Queue | Laravel database queue driver |
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS v4 |
| UI components | shadcn/ui (Radix UI primitives) |
| Icons | lucide-react |
| Charts | Recharts |
| Maps | Leaflet, react-leaflet |
| Geocoding | OpenStreetMap Nominatim (free, no API key) |
