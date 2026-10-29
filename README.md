# REDDA — Real Estate Due Diligence Agent

REDDA is a full-stack real estate due diligence application designed to help users review property information, identify potential risks, and organize property assessment results in one place.

## Overview

Buying a property requires reviewing important information such as ownership, property taxes, building permits, zoning, and other property-related records. REDDA brings property information and risk assessment features together through a web-based application.

## Features

- **Dashboard:** Overview of properties, reports, risk assessments, and notifications.
- **Property Management:** View and manage property information.
- **Due Diligence:** Review available ownership, tax, permit, zoning, and other property records.
- **Risk Assessment:** Display property risk levels and assessment categories.
- **Reports:** View available due diligence reports and report history.
- **Comparable Properties:** Access property comparison features.
- **Monitoring:** Review available property notifications and updates.
- **Audit:** Review recorded user activities, API logs, and report history.

## Technology Stack

**Frontend**
- React
- JavaScript
- Vite
- CSS and Tailwind CSS

**Backend**
- Java
- Spring Boot
- Spring MVC and REST APIs
- Maven

**Database**
- PostgreSQL

## Project Structure

```text
REDDA/
├── Redda-frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── mvnw.cmd
├── .gitignore
├── LICENSE
└── README.md
```

## Getting Started

### Prerequisites

Install the following tools:
- Java Development Kit (JDK)
- Node.js and npm
- PostgreSQL
- Git

### 1. Configure the Database

Create a PostgreSQL database named `realestate_db`.

Configure the following environment variables for the backend. Use your own local credentials and never commit passwords or secrets to GitHub.

- `REAL_ESTATE_DB_USERNAME`
- `REAL_ESTATE_DB_PASSWORD`
- `REAL_ESTATE_MAIL_USERNAME`
- `REAL_ESTATE_MAIL_PASSWORD`

### 2. Run the Backend

Open a terminal in the `backend` directory.

Set the required environment variables, then run:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend is configured to run on port `8080`.

### 3. Run the Frontend

Open a separate terminal in the `Redda-frontend` directory and run:

```bash
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser, usually `http://localhost:5173`.

## Important Note

Property information and assessment results depend on the data available in the application. The project should not be considered a substitute for verification of official property records. Integration with authoritative external property data sources can be added as a future enhancement.

## Future Enhancements

- Integration with verified external property data sources.
- Expanded automated risk assessment.
- Improved property comparison and monitoring capabilities.
- Additional reporting and analysis features.

## Author

Developed as a full-stack real estate due diligence project using React, Spring Boot, and PostgreSQL.
