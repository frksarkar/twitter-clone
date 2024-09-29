# Twitter Clone Project

## Overview

This project is a full-stack Twitter clone application built using Node.js and Express. It incorporates various technologies and tools to provide a comprehensive social media experience, including user authentication, data storage, real-time updates, and a user-friendly interface.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Dependencies](#dependencies)
- [Development Dependencies](#development-dependencies)
- [Project Structure](#project-structure)
- [Author](#author)

## Features

- **User Authentication**: Secure user registration and login using bcrypt for password hashing.
- **Real-Time Communication**: Real-time messaging with Socket.io.
- **Data Management**: Data storage and retrieval with MongoDB via Mongoose.
- **File Uploads**: Handle user uploads such as profile pictures using Multer.
- **Session Management**: Manage user sessions with express-session.
- **Form Validation**: Validate user inputs with express-validator.
- **Template Engine**: Render dynamic views using Pug.
- **Logging**: HTTP request logging with Morgan.
- **Frontend**: Developed with Pug templates and integrated with backend routes and logic.

## Installation

To get started with the project, follow these steps:

1. **Clone the repository**:

    ```bash
    git clone https://github.com/frksarkar/twitter-clone.git
    cd twitter-clone
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Set up environment variables**: Create a `.env` file in the root directory and add your configuration variables (e.g., MongoDB URI, session secret, Firebase configuration).

4. **Start the application**:
    - For development:

      ```bash
      npm run test
      ```

    - For production:

      ```bash
      npm start
      ```

## Dependencies

The project relies on several npm packages. Below is a summary of the main dependencies and their purposes:

- **express**: Web framework for Node.js.
- **mongoose**: MongoDB object modeling tool.
- **firebase**: For integrating Firebase services.
- **bcrypt**: Library for hashing passwords.
- **body-parser**: Middleware to parse incoming request bodies.
- **express-session**: Middleware for managing sessions.
- **express-validator**: Middleware for validating request data.
- **morgan**: HTTP request logger.
- **multer**: Middleware for handling multipart/form-data (file uploads).
- **pug**: Template engine.
- **socket.io**: Library for real-time web applications.

## Development Dependencies

- **nodemon**: Tool that helps develop Node.js-based applications by automatically restarting the node application when file changes in the directory are detected.

## Project Structure

```plaintext
.
├── package.json
├── package-lock.json
├── server.js
├── .env
├── .gitignore
├── access.log
├── public
│   ├── css
│   ├── js
│   └── images
├── views
│   ├── index.pug
│   └── layout.pug
├── routes
│   ├── index.js
│   └── users.js
├── app
│   ├── config
│   │   └── database.js
│   ├── controller
│   │   ├── authController.js
│   │   ├── tweetController.js
│   │   └── userController.js
│   ├── middleware
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── module
│   │   ├── tweet.js
│   │   └── user.js
│   ├── util
│   │   └── helper.js
└── app_structure.text
```
    
- `app.js`: Main entry point for the application.</li>
- `public`: Contains static assets such as CSS, JavaScript, and images.</li>
- `views`: Contains Pug templates for rendering HTML.</li>
- `routes`: Contains route definitions for the application.</li>
  
## Author
**Faruk Sarkar**

Feel free to contribute to the project by opening issues or submitting pull requests. For significant changes, please open an issue first to discuss what you would like to change.
