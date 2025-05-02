# Org Chart Frontend

This React application helps to visualize an organizational chart based on employee data fetched from a Go backend.

## Overview

The Org Chart frontend renders employee data in a hierarchical nested list structure, displaying employee and manager relationships. Employees are sorted alphabetically by last name when a manager has multiple reports

## Prerequisites

- Bun runtime (latest version)

## Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/org-chart.git
   cd org-chart/frontend
   ```

2. Install dependencies
   ```
   bun install
   ```

## Running the Application

Start the development server:

```
bun run start
```

The application will be available at http://localhost:3000

## API Integration

The frontend communicates with the Go backend through a RESTful API located at http://localhost:8080. The main endpoint used is:

- `GET /employees` - Retrieves the employee list in JSON array format.

## Implementation Details

### Data Structure

The employee data is transformed into a hierarchical structure for rendering:

```javascript
{
  id: string,
  name: string,
  title: string,
  manager_id: string | null,
  reports: Array<Employee>
}
```

### Rendering Logic

1. Employees are displayed with their full name and title
2. Each employee is nested under their manager
3. When a manager has multiple reports, they are sorted alphabetically by last name as per the spec on the assignment