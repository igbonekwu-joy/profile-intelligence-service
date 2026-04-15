# Profile Intelligence Service

A REST API that predicts demographic information — gender, age, and nationality — from a given name, using the [Genderize.io](https://genderize.io), [Agify.io](https://agify.io), and [Nationalize.io](https://nationalize.io) APIs. Results are stored in a MongoDB database and can be queried with filters.

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **External APIs:** Genderize.io, Agify.io, Nationalize.io

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB instance (local or cloud)

### Installation

```bash
git clone https://github.com/your-username/profile-intelligence-service.git
cd profile-intelligence-service
npm install
```

### Environment Variables

Create a `.env` file in the root of the project:

```env
NODE_ENV=development
DB_URI=your_production_mongodb_uri
DB_TEST_URI=your_development_mongodb_uri
PORT=3000
```

### Running the Server

```bash
# Development
npm run dev

# Production
npm start
```

---

## API Reference

### Store a Profile

Accepts a name, calls the Genderize, Agify, and Nationalize APIs, and stores the predicted profile.

```
POST /api/profiles
```

**Request Body:**

```json
{
  "name": "John"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "name": "John",
    "gender": "male",
    "age": 35,
    "age_group": "adult",
    "country_id": "US",
    "country_probability": 0.124,
    "created_at": "2024-04-15T13:45:30.000Z"
  }
}
```

---

### Get All Profiles

Returns all stored profiles. Supports optional filtering by `gender`, `country_id`, and `age_group`.

```
GET /api/profiles
```

**Query Parameters:**

| Parameter    | Type   | Description                          |
|--------------|--------|--------------------------------------|
| `gender`     | string | Filter by gender (e.g. `male`, `female`) |
| `country_id` | string | Filter by country code (e.g. `NG`, `US`) |
| `age_group`  | string | Filter by age group (e.g. `adult`, `senior`) |

**Example Request:**

```
GET /api/profiles?gender=male&country_id=NG
```

**Response:**

```json
{
  "status": "success",
  "count": 2,
  "data": [
    {
      "id": "id-1",
      "name": "John",
      "gender": "male",
      "country_id": "NG",
      "age": 35,
      "age_group": "adult"
    },
    {
      "id": "id-2",
      "name": "James",
      "gender": "male",
      "country_id": "NG",
      "age": 28,
      "age_group": "adult"
    }
  ]
}
```

---

### Get a Single Profile

```
GET /api/profiles/:id
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "name": "John",
    "gender": "male",
    "age": 35,
    "age_group": "adult",
    "country_id": "NG",
    "country_probability": 0.124,
    "created_at": "2024-04-15T13:45:30.000Z"
  }
}
```

---

### Delete a Profile

```
DELETE /api/profiles/:id
```

**Response:**

```json
{
  "status": "success",
  "message": "Profile deleted successfully"
}
```

---

## External APIs Used

| API | Purpose | Docs |
|-----|---------|------|
| [Genderize.io](https://genderize.io) | Predicts gender from a name | [docs](https://genderize.io/#documentation) |
| [Agify.io](https://agify.io) | Predicts age from a name | [docs](https://agify.io/#documentation) |
| [Nationalize.io](https://nationalize.io) | Predicts nationality from a name | [docs](https://nationalize.io/#documentation) |

---

## License

MIT