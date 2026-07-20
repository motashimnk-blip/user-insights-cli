# User Insights CLI

A Node.js command-line application that fetches data from the JSONPlaceholder API and generates a report for each user.

## Features

- Fetches users, posts, and todos concurrently using Promise.all()
- Displays:
  - User name
  - Email
  - City
  - Number of posts
  - Completed todos
  - Open todos
- Sorts users by post count
- Prints summary statistics
- Handles network errors gracefully

## Requirements

- Node.js 18 or later

## Installation

Clone the repository:

```bash
git clone <your-repository-url>
```

Go to the project folder:

```bash
cd user-insights-cli
```

Install dependencies:

```bash
npm install
```

## Run the project

```bash
npm start
```

## API Used

https://jsonplaceholder.typicode.com/users
https://jsonplaceholder.typicode.com/posts
https://jsonplaceholder.typicode.com/todos

## Author

Mohtashim Nawaz