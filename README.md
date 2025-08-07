# Phonebook Application

This repository contains the backend and the production build of the frontend for the Phonebook application. The app is a practice project for Part 3 of the Fullstack Open course by the University of Helsinki, Finland.

## About the Project

The Phonebook is a simple fullstack CRUD application that allows users to:

- View existing contacts

- Add new contacts (with validation)

- Delete contacts

- Update existing contact information

The frontend is built with React and Vite, and the backend uses Express.

## Links

The backend (with the bundled frontend) is deployed on Render: **[myphonebook-j6gf](https://myphonebook-j6gf.onrender.com)**

## Project Structure

```plaintext
.
|-- dist/ # Production-ready frontend build (served by Express)
|-- index.js # Express server entry point
|-- requests/requests.rest  # Sample API requests for testing with VS Code  REST Client
|-- package.json # Backend dependencies and scripts
|-- package-lock.json # Automatically generated lockfile for npm dependencies.
|-- .gitignore # Defines untracked files (e.g., node_modules, logs).
```

## Deployment Notes

- Frontend is built with React and Vite, using npm run build, and the resulting static files are served by the Express backend from the dist/ folder
- Express serves the static frontend using express.static('dist')
- The project is deployed to Render, with the dist/ folder included in the repo (not gitignored).

## Development

To run the project locally:

1. Clone the repo
2. Install dependencies:
npm install
3. Start the server:
npm run dev

Use the requests/requests.rest file with the REST Client extension in VS Code to test the API.
