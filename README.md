# Profile Intelligence Service

A RESTful API that predicts gender, age, and nationality based on a given name using the [Genderize.io](https://genderize.io) API, [Agify.io](https://api.agify.io) API, and [Nationalize](https://api.nationalize.io) API. Built with Node.js and Express.

---

## Features

- Predict gender, age, and nationality from a name
- Input validation with descriptive error messages
- Centralized error handling and logging (console + file)
- Rate limiting to prevent abuse
- CORS support
- Response time monitoring
- Handling of uncaught exceptions and unhandled promise rejections

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Logging:** Winston
- **Validation:** Joi
- **HTTP Client:** Axios
- **Rate Limiting:** express-rate-limit
- **Status Codes:** http-status-codes

---

## Getting Started

### Prerequisites

- Node.js v16+
- npm

### Installation

```bash
git clone https://github.com/igbonekwu-joy/profile-intelligence-service.git
cd profile-intelligence-service
npm install
```

### Environment Variables

Create a `.env` file or rename .env.example in the root directory:

```env
PORT=5000
GENDERIZE_API_URL=https://api.genderize.io
```

### Running the App

```bash
npm run dev
```

The server will start on `http://localhost:5000`.

---

## API Reference

### Get Gender by Name

```
GET /api/classify?name={name}
```

#### Query Parameters

| Parameter | Type   | Required | Description          |
|-----------|--------|----------|----------------------|
| `name`    | string | Yes      | The name to look up  |

#### Success Response `200 OK`

```json
{
  "status": "success",
  "data": {
    "name": "John",
    "gender": "male",
    "probability": 0.99,
    "sample_size": 12345,
    "is_confident": true,
    "processed_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### `is_confident` Logic

`is_confident` is `true` when:
- `probability >= 0.7` AND
- `sample_size >= 100`

---

## Error Responses

| Status | Reason |
|--------|--------|
| `400 Bad Request` | `name` parameter is missing or empty |
| `422 Unprocessable Entity` | `name` contains non-letter characters like numbers |
| `429 Too Many Requests` | Rate limit exceeded |
| `500 Internal Server Error` | Unexpected server error |
| `502 Bad Gateway` | Upstream/Server failure |

#### Error Response Format

```json
{
  "status": "error",
  "message": "error message"
}
```

---

## Example Requests

```bash
# Valid request
curl http://localhost:5000/api/classify?name=John

# Missing name → 400
curl http://localhost:5000/

# Invalid name (number) → 422
curl http://localhost:5000/api/classify?name=123
```

---

## Project Structure

```
├── src/
│   ├── middleware/
│   │   ├── asyncHandler.js         # Wraps async routes to forward errors
│   │   └── errorHandler.js         # Handles internal server and upstream errors
│   │   ├── rateLimitHandler.js     # Rate limiting middleware
│   │   └── responseTimeHandler.js  # Logs and monitors response time
|   ├── modules/
|   |   ├── gender.controller.js    # Gender details retrieval logic
│   │   └── gender.routes.js        # Contains the get route
|   |   └── gender.service.js       # Genderize.io API integration
|   |   └── gender.validator.js     # Joi validation schema
│   ├── startup/
│   │   ├── logger.js               # Winston logging setup
│   │   └── routes.js               # Route registration
│   ├── app.js                      # Express app setup
│   ├── axios.js                    # Axios instance factory
│   └── config.js                   # Environment variable config 
│      
├── logfile.log                     # Auto-generated log file
└── .env                            # Environment variables (not committed)
```

---

## Logging

All requests and errors are logged to:
- **Console** — for development
- **`logfile.log`** — for persistent logs (auto-created on first run)

Slow responses (>500ms internal processing time) are flagged with a warning log.