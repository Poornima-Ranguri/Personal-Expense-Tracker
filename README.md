# Personal Expense Tracker API

A RESTful API built with Node.js, Express.js, and MongoDB for managing personal financial records. This API allows users to track their income and expenses, retrieve transaction history, and view financial summaries.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Sample Usage](#sample-usage)

## Features
- Record income and expenses
- Categorize transactions
- Retrieve transaction history
- Generate financial summaries
- Filter transactions by date range and category
- Basic error handling
- MongoDB integration

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd personal-expense-tracker
```

2. Install dependencies:
```bash
npm init -y
npm install express mongoose dotenv cors
```

3. Create a `.env` file in the root directory and add your MongoDB connection string:
```
MONGODB_URI=mongodb://localhost:27017/expense-tracker
PORT=3000
```

4. Start the server:
```bash
node server.js
```

## Environment Variables
- `MONGODB_URI`: MongoDB connection string
- `PORT`: Port number for the server (default: 3000)

## Database Schema

### Transaction Schema
```javascript
{
  type: String,        // 'income' or 'expense'
  category: String,    // Reference to category
  amount: Number,      // Transaction amount
  date: Date,         // Transaction date
  description: String  // Transaction description
}
```

### Category Schema
```javascript
{
  name: String,       // Category name
  type: String        // 'income' or 'expense'
}
```

## API Endpoints

### Transactions

#### Create Transaction
- **POST** `/transactions`
- **Body:**
```json
{
  "type": "expense",
  "category": "groceries",
  "amount": 50.00,
  "date": "2024-03-20",
  "description": "Weekly groceries"
}
```

#### Get All Transactions
- **GET** `/transactions`
- **Query Parameters:**
  - `startDate` (optional): Filter by start date
  - `endDate` (optional): Filter by end date
  - `category` (optional): Filter by category

#### Get Transaction by ID
- **GET** `/transactions/:id`

#### Update Transaction
- **PUT** `/transactions/:id`
- **Body:** Same as Create Transaction

#### Delete Transaction
- **DELETE** `/transactions/:id`

### Summary

#### Get Financial Summary
- **GET** `/summary`
- **Query Parameters:**
  - `startDate` (optional): Start date for summary
  - `endDate` (optional): End date for summary
  - `category` (optional): Filter by category
- **Response:**
```json
{
  "totalIncome": 1000.00,
  "totalExpenses": 500.00,
  "balance": 500.00,
  "categorySummary": {
    "groceries": 200.00,
    "utilities": 300.00
  }
}
```

## Error Handling

The API implements standard HTTP status codes:
- `200`: Successful operation
- `201`: Resource created
- `400`: Bad request (invalid input)
- `404`: Resource not found
- `500`: Internal server error

Error responses follow this format:
```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

## Sample Usage

### Creating a New Transaction
```javascript
fetch('http://localhost:3000/transactions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    type: 'expense',
    category: 'groceries',
    amount: 50.00,
    date: '2024-03-20',
    description: 'Weekly groceries'
  })
})
```

### Getting Summary
```javascript
fetch('http://localhost:3000/summary?startDate=2024-03-01&endDate=2024-03-31')
  .then(response => response.json())
  .then(data => console.log(data))
```

## Contributing
Feel free to submit issues and enhancement requests.
