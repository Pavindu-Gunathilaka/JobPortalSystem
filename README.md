# Job Portal System

A full-stack CRUD application for a job portal system built using the MERN (MongoDB, Express, React, Node.js) stack. This project follows DevOps practices, including CI/CD integration using GitHub Actions.


# Table of Contents
-   [Project Setup Instructions](#project-setup-instructions)
    
-   [CI/CD Pipeline Details](#cicd-pipeline-details)
    
-   [Backend Setup](#backend-setup)
    
-   [Frontend Setup](#frontend-setup)
    
-   [Authentication & Authorization](#authentication--authorization)
    
-   [GitHub Version Control & Branching Strategy](#github-version-control--branching-strategy)

## Project Setup Instructions

Prerequisites

-   **Node.js**: Install the latest version of Node.js from [here](https://nodejs.org/).
    
-   **MongoDB**: Make sure you have a MongoDB instance running. You can use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for cloud hosting or set up MongoDB locally.
    
-   **Git**: Install Git from [here](https://git-scm.com/).
### 1. Clone the repository

`git clone https://github.com/yourusername/job-portal-system.git`

`cd job-portal-system`

### 2. Backend Setup (Project Setup)
Navigate to the `backend` directory and install the dependencies.

`cd backend`

`npm install`


### 3. Frontend Setup (Project Setup)

Navigate to the `frontend` directory and install the dependencies.

`cd frontend`

`npm install`

### 4. Environment Variables

Create a `.env` file in the `backend` directory and add the following configuration:


`PORT=5001'
'MONGO_URI=<Your MongoDB URI>`
`JWT_SECRET=<Your JWT Secret>`

### 5. Running the Application

To run both the backend and frontend simultaneously in development mode, you can use `concurrently`:

`cd backend`

`npm run dev`

For the frontend:

`cd frontend`

`npm start`

### 6. Testing the Application

The backend tests can be run using:

`cd backend`

`npm test` 

## CI/CD Pipeline Details


### GitHub Actions

This project is integrated with **GitHub Actions** for Continuous Integration and Continuous Deployment. Here's a brief overview of the pipeline setup:

1.  **Continuous Integration**:
    
    -   Runs unit tests on every commit or pull request to ensure the code is stable.
        
        
2.  **Continuous Deployment**:
    
    -   Deploys the backend to **AWS EC2** automatically when changes are merged into the `main` branch.
        
    -  Deploys the frontend to **AWS EC2** automatically on changes to the `main` branch.
   
## Backend Setup

The backend is built using **Node.js**, **Express**, and **MongoDB**. It exposes RESTful APIs for user authentication, job posting, and job search. The server is set up with JWT authentication for secure access.

## Frontend Setup

The frontend is built using **React.js**. It interacts with the backend API and displays job listings in a user-friendly interface. It includes forms for adding, updating, and deleting job listings. It also features job application management.

## Authentication & Authorization

The application uses **JWT (JSON Web Tokens)** for user authentication and authorization. Users must be authenticated to perform any CRUD operations.

### Authentication Flow:

-   User logs in via the login form.
    
-   Upon successful login, a JWT token is returned.
    
-   The token is stored in local storage and sent in the `Authorization` header for protected API requests.

## GitHub Version Control & Branching Strategy

### Branching Strategy:

-   **main**: Stable, production-ready code.
    
-   **feature**: Each new feature is developed in its own branch.
   
### Pull Requests:

-   Create a pull request from a feature branch to `main`.
    
-   Review and approval process before merging into `main`.
