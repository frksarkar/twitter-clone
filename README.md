# 🐦 Twitter Clone

## 📖 Overview

This project is a full-stack **Twitter clone** application built with **Node.js**, **Express**, and **React.js**. It combines modern web technologies to deliver a complete social media experience, featuring secure user authentication, real-time messaging, robust data management, and an intuitive, responsive user interface.

## Table of Contents

-   [Features](#features)
-   [Installation](#installation)
-   [Dependencies](#dependencies)
-   [Development Dependencies](#development-dependencies)
-   [Project Structure](#project-structure)
-   [Author](#author)

## Features

### ✅ Backend (Express.js)

-   **User Authentication** – Secure registration/login using `bcrypt`.
-   **Real-Time Messaging** – Implemented with `Socket.io`.
-   **MongoDB Integration** – Structured data management using `Mongoose`.
-   **File Uploads** – Managed with `Multer` for user content like profile pictures.
-   **Session Handling** – Handled using `express-session`.
-   **Request Validation** – Performed via `express-validator`.
-   **HTTP Logging** – Implemented with `Morgan`.
-   **Firebase Integration** – For extended backend services.

### 💻 Frontend (React.js + TypeScript)

-   **Routing** – Managed with `React Router DOM`.
-   **State Management** – Powered by `Zustand`.
-   **Date Handling** – Handled using `date-fns`.
-   **Icon System** – Utilized `lucide-react` for scalable icons.
-   **Tailwind CSS** – Utility-first styling with `tailwind-merge` and `clsx`.
-   **Reusable Components** – Organized under `components/` with modular structure.
-   **Type Safety** – Maintained through full TypeScript support.

---

## Installation

To get started with the project, follow these steps:

1. **Clone the repository**:

    ```bash
    git clone https://github.com/frksarkar/twitter-clone.git
    cd twitter-clone
    ```

2. **Install dependencies & Start the application**:

### Backend Setup

    cd back-end
    npm install
    npm start

**Set up environment variables**: Create a `.env` file in the root directory and add your configuration variables (e.g., MongoDB URI, session secret, Firebase configuration).

### Frontend Setup

    cd front-end
    npm install
    npm run dev

## Dependencies

The project relies on several npm packages. Below is a summary of the main dependencies and their purposes:

### 🔧 Backend

-   **express**: Web framework for Node.js.
-   **mongoose**: MongoDB object modeling tool.
-   **firebase**: For integrating Firebase services.
-   **bcrypt**: Library for hashing passwords.
-   **body-parser**: Middleware to parse incoming request bodies.
-   **express-session**: Middleware for managing sessions.
-   **express-validator**: Middleware for validating request data.
-   **morgan**: HTTP request logger.
-   **multer**: Middleware for handling multipart/form-data (file uploads).
-   **socket.io**: Library for real-time web applications.

## Development Dependencies

-   **nodemon**: Tool that helps develop Node.js-based applications by automatically restarting the node application when file changes in the directory are detected.

### 💻 Frontend

-   **react**: JavaScript library for building user interfaces.
-   **react-dom**: Entry point to the DOM and server renderers for React.
-   **react-router-dom**: Routing library for React applications.
-   **zustand**: Lightweight state management library.
-   **date-fns**: Modern JavaScript date utility library.
-   **lucide-react**: Icon library for React.
-   **clsx**: Utility for constructing `className` strings conditionally.
-   **tailwind-merge**: Utility to intelligently merge Tailwind CSS classes.

## 📌 Notes

-   Ensure you have MongoDB running locally or configure your remote MongoDB URI in the backend configuration.
-   Firebase credentials should be properly set in your environment or configuration files.
-   Use environment variables (.env) for sensitive information like database URIs and Firebase config.

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
