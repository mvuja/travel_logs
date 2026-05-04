# Travel Logs

A full-stack travel log manager built with **Laravel 12** (API) and **React + TypeScript** (frontend).

---

## Features

- **Create, edit, delete** travel logs - flights, rail, car, hotel
- **Geocoded location search** - type a city name, pick from OpenStreetMap autocomplete; city, country and coordinates are stored automatically (no manual input)
- **Bulk CSV upload** - import many logs at once with a live progress bar (background queue job)
- **Sort by date, type or country** - sort is handled server-side
- **Clear all** - reset the database with one click (with confirmation)
- **Activity Breakdown** - donut pie chart showing your log distribution by type
- **Country Heatmap** - world choropleth map coloured by how many times you've visited each country (updates live when logs are added/edited/deleted)

---

## Project Structure

```
travel_logs/        ← Laravel API (backend)
travel_logs/react/  ← React app (frontend)
```

---

## Prerequisites

| Tool            | Why                            |
|-----------------|--------------------------------|
| **PHP 8.2+**    | Runs Laravel                   |
| **Composer**    | Installs PHP dependencies      |
| **Node.js 18+** | Runs the React/Vite dev server |
| **npm**         | Installs JS dependencies       |

---

## Setup & Running - one command

```bash
git clone https://github.com/mvuja/travel_logs
cd travel_logs
./start.sh
```

That's it. The script will:

1. Install PHP dependencies (if missing)
2. Create `.env` and generate an app key (if missing)
3. Create the SQLite database file (if missing)
4. Run migrations
5. Install frontend dependencies (if missing)
6. Start all three services concurrently:
   - Laravel API → **http://localhost:8000**
   - Queue worker (required for bulk CSV uploads)
   - React/Vite dev server → **http://localhost:5173**

Press **Ctrl+C** to stop everything cleanly.

> **First run** takes a minute or two while Composer and npm download dependencies. Subsequent runs start immediately.

---

## Opening the App

Go to **http://localhost:5173**

You'll see:
- **Your Logs** - full list with sort bar, edit/delete per entry, and a **Clear All** button to wipe everything
- **Insights** - Activity pie chart + Country heatmap side by side, updating live
- **New Log** / **Bulk Upload** / **Clear All** buttons in the header

When creating a log, type a city in the location search boxes and **select a result from the dropdown** — this ensures the country is correctly geocoded and will appear on the heatmap.

---

## Sample CSV - try bulk upload immediately

A ready-to-use CSV with **101 realistic travel logs** (flights, hotels, car trips, rail journeys across 20+ countries) is included in the repo root:

```
sample_travel_logs.csv
```

To use it:
1. Click **Bulk Upload** in the header
2. Select `sample_travel_logs.csv`
3. Watch the progress bar. Logs will appear in the list and the charts will populate automatically

> You can also **Clear All** afterwards and start fresh with your own data.

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
| `DELETE` | `/travel-logs` | Delete **all** logs |
| `POST` | `/travel-logs/bulk-upload` | Upload CSV (returns `queueTaskId`) |
| `GET` | `/queue-tasks/{id}` | Poll bulk-upload progress |
| `GET` | `/stats/types` | Count of logs per type |
| `GET` | `/stats/countries` | Visit count per country |

### Bulk CSV format

Required columns (in order):

```
type, departure_date, arrival_date, comment,
city, country, place_name, latitude, longitude,
from_city, from_country, from_place_name, from_lat, from_lng
```

- Columns 1-3 are required: log type and dates
- `comment` is optional (leave empty with `,`)
- Columns 5-9 are the geocoded **destination** (`city` and `country` drive the heatmap)
- Columns 10-14 are the geocoded **origin** - used for flights, rail, car; leave empty for hotels

Example rows:

```csv
type,departure_date,arrival_date,comment,city,country,place_name,latitude,longitude,from_city,from_country,from_place_name,from_lat,from_lng
flight,2025-06-01T08:00,2025-06-01T12:00,Summer trip,New York,United States,"New York, NY, United States",40.7128,-74.0060,London,United Kingdom,"London, England, United Kingdom",51.5074,-0.1278
hotel,2025-06-05T14:00,2025-06-08T11:00,Conference stay,Brussels,Belgium,"Brussels, Belgium",50.8503,4.3517,,,,,,
```

> The included `sample_travel_logs.csv` uses this exact format, use it as a reference.

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
