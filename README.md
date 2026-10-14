# CareerPilot — Resume Analyzer

CareerPilot is a web application that compares resume text with a job description and identifies matching and missing skills using keyword-based analysis.

## Features

- Resume and job description analysis
- Keyword match score
- Matched skills identification
- Missing skills identification
- Resume improvement suggestions
- Input validation using Jakarta Bean Validation
- REST API built with Spring Boot

## Tech Stack

**Frontend**
- HTML5
- CSS3
- JavaScript

**Backend**
- Java 24
- Spring Boot 3.5.6
- Maven
- REST API
- Jakarta Bean Validation

## Project Structure

```text
CAREERPILOT/
├── backend/
│   ├── src/
│   └── pom.xml
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Java Development Kit (JDK) 24
- Apache Maven 3.10.0
- A modern web browser
- Visual Studio Code (recommended)

### 1. Run the Backend

Open a terminal in the project directory and run:

```powershell
& "C:\Tools\apache-maven-3.10.0\bin\mvn.cmd" -f "D:\CAREERPILOT\backend\pom.xml" spring-boot:run
```

The backend starts on:

`http://localhost:8080`

### 2. Run the Frontend

Open the `frontend` folder in Visual Studio Code and launch `index.html` using the Live Server extension.

The frontend communicates with the backend at:

`http://localhost:8080/api/analyze`

### API Endpoint

**POST** `/api/analyze`

Example request:

```json
{
  "resumeText": "Java, Spring Boot, SQL, Git",
  "jobDescription": "Looking for a Java developer with Spring Boot, SQL, Git and REST API skills."
}
```

The API returns a keyword-based match score, matched skills, missing skills, and a note.

## Important Limitation

The match score is a basic keyword-based estimate. It is not an employer's actual Applicant Tracking System (ATS) score and does not predict hiring outcomes.

## Future Improvements

- Improve skill extraction and matching
- Add file upload support for resumes
- Add automated tests
- Improve error messages and accessibility
- Deploy the frontend and backend

## Author

**Manas Biswal**

GitHub: [Thecodingmindtm](https://github.com/Thecodingmindtm)