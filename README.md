# Travel Logs

## Overview

This is a Laravel-based API that allows users to manage travel logs, including bulk CSV uploads. It supports:

-   Creating, retrieving, and deleting travel logs.
-   Bulk uploading travel logs via CSV.
-   Check the upload progress.
-   Asynchronous processing using Laravel Queues.
-   Data validation using `spatie/laravel-data`.

## Prerequisites

Ensure you have the following installed:

-   PHP 8.1+
-   Composer
-   SQLite (or modify for another database)
-   Laravel 10+

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/mvuja/travel_logs
    cd travel_logs
    ```

2. **Install dependencies:**

    ```bash
    composer install
    ```

3. **Set up the environment:**

    ```bash
    cp .env.example .env
    ```

    - Configure database settings in `.env` (using SQLite by default):
        ```env
        DB_CONNECTION=sqlite
        DB_DATABASE=/absolute/path/to/database.sqlite
        ```
        Ensure the `database.sqlite` file exists in `database` folder:
        ```bash
        touch database/database.sqlite
        ```

4. **Run migrations:**

    ```bash
    php artisan migrate
    ```

5. **Seed the database (optional):**

    ```bash
    php artisan db:seed
    ```

6. **Run the queue worker:**

    ```bash
    php artisan queue:work --tries=3
    ```

7. **Start the development server:**
    ```bash
    php artisan serve
    ```

## API Endpoints

### 1. Create a Single Travel Log

**POST** `/api/travel-logs`

#### Request Body (JSON)

```json
{
    "type": "car",
    "departureDate": "2025-03-17T08:00:00Z",
    "arrivalDate": "2025-03-17T12:00:00Z",
    "departurePlace": "Berlin",
    "arrivalPlace": "Munich",
    "comment": "Business trip"
}
```

#### Response

```json
{
    "message": "Travel log created successfully!",
    "data": {
        "type": "car",
        "departureDate": "2025-03-17 08:00:00",
        "arrivalDate": "2025-03-17 12:00:00",
        "departurePlace": "Berlin",
        "arrivalPlace": "Munich",
        "accommodationPlace": null,
        "comment": "Business trip"
    }
}
```

### 2. Retrieve a Travel Log

**GET** `/api/travel-logs/{travelLog}`

#### Response

```json
{
    "message": "Travel log retrieved successfully!",
    "data": {
        "type": "car",
        "departureDate": "2025-03-17 08:00:00",
        "arrivalDate": "2025-03-17 12:00:00",
        "departurePlace": "Berlin",
        "arrivalPlace": "Munich",
        "accommodationPlace": null,
        "comment": "Business trip"
    }
}
```

### 3. Delete a Travel Log

**DELETE** `/api/travel-logs/{travelLog}`

#### Response: 204 No Content

### 4. Bulk Upload Travel Logs (CSV)

**POST** `/api/travel-logs/bulk-upload`

#### Request

-   Send a CSV file with headers: `type,departureDate,arrivalDate,departurePlace,arrivalPlace,accommodationPlace,comment`
-   Example CSV content:
    ```csv
        type,departureDate,arrivalDate,departurePlace,arrivalPlace,accommodationPlace,comment
        car,2025-01-30T10:56:53Z,2025-01-30T11:56:53Z,Berlin,Berlin,,No comment
        rail,2025-02-24T10:56:53Z,2025-02-24T20:56:53Z,Berlin,Paris,,Conference
        hotel,2025-01-16T10:56:53Z,2025-01-16T18:56:53Z,,,Marriott,Conference
        rail,2025-02-26T10:56:53Z,2025-02-26T11:56:53Z,Tokyo,Tokyo,,Business trip
        flight,2024-12-29T10:56:53Z,2024-12-29T15:56:53Z,,,,Business trip
    ```

#### Response

```json
{
    "queueTaskId": 1
}
```

### 5. Check Bulk Upload Status

**GET** `/api/queue-tasks/{queueTask}`

#### Response

```json
{
    "id": 2,
    "status": "success",
    "progress": 100
}
```

## Technologies Used

-   Laravel 10+
-   SQLite (configurable for other databases)
-   Spatie Laravel Data for DTO and validation
-   Laravel Queues for background jobs

## Notes

-   Ensure that `php artisan queue:work` is running for bulk uploads to be processed.
-   Modify `database/database.sqlite` path in `.env` if needed.

## Author

Marko
