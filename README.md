<div>
    <h1>Twitter Clone Project</h1>
    <h2>Overview</h2>
    <p>
        This project is a full-stack Twitter clone application built using Node.js and Express. It incorporates various technologies and tools to provide a comprehensive social media experience, including user authentication, data storage,
        real-time updates, and a user-friendly interface.
    </p>
    <h2>Table of Contents</h2>
    <ul>
        <li><a href="#Features">Features</a></li>
        <li><a href="#Installation">Installation</a></li>
        <li><a href="#Dependencies">Dependencies</a></li>
        <li><a href="#Development-Dependencies">Development Dependencies</a></li>
        <li><a href="#Project-Structure">Project Structure</a></li>
        <li><a href="#License">License</a></li>
        <li><a href="#Author">Author</a></li>
    </ul>
    <h2>Features</h2>
    <ul>
        <li><strong>User Authentication</strong>: Secure user registration and login using bcrypt for password hashing.</li>
        <li><strong>Real-Time Communication</strong>: Real-time messaging with Socket.io.</li>
        <li><strong>Data Management</strong>: Data storage and retrieval with MongoDB via Mongoose.</li>
        <li><strong>File Uploads</strong>: Handle user uploads such as profile pictures using Multer.</li>
        <li><strong>Session Management</strong>: Manage user sessions with express-session.</li>
        <li><strong>Form Validation</strong>: Validate user inputs with express-validator.</li>
        <li><strong>Template Engine</strong>: Render dynamic views using Pug.</li>
        <li><strong>Logging</strong>: HTTP request logging with Morgan.</li>
        <li><strong>Frontend</strong>: Developed with Pug templates and integrated with backend routes and logic.</li>
    </ul>
    <h2>Installation</h2>
    <p>To get started with the project, follow these steps:</p>
    <ol>
        <li>
            <p><strong>Clone the repository</strong>:</p>
            <pre><code >git <span>clone</span> https://github.com/yourusername/twitter-clone.git<span>cd</span> twitter-clone</code></pre>
        </li>
        <li>
            <p><strong>Install dependencies</strong>:</p>
            <pre><code>npm install</code></pre>
        </li>
        <li>
            <p><strong>Set up environment variables</strong>: Create a <code>.env</code> file in the root directory and add your configuration variables (e.g., MongoDB URI, session secret, Firebase configuration).</p>
        </li>
        <li>
            <p><strong>Start the application</strong>: For development:</p>
            <pre><code>npm run <span>test</span></code></pre>
            <p>For production:</p>
            <pre><code>npm start</code></pre>
        </li>
    </ol>
    <h2>Dependencies</h2>
    <p>The project relies on several npm packages. Below is a summary of the main dependencies and their purposes:</p>
    <ul>
        <li><strong>express</strong>: Web framework for Node.js.</li>
        <li><strong>mongoose</strong>: MongoDB object modeling tool.</li>
        <li><strong>firebase</strong>: For integrating Firebase services.</li>
        <li><strong>bcrypt</strong>: Library for hashing passwords.</li>
        <li><strong>body-parser</strong>: Middleware to parse incoming request bodies.</li>
        <li><strong>express-session</strong>: Middleware for managing sessions.</li>
        <li><strong>express-validator</strong>: Middleware for validating request data.</li>
        <li><strong>morgan</strong>: HTTP request logger.</li>
        <li><strong>multer</strong>: Middleware for handling multipart/form-data (file uploads).</li>
        <li><strong>pug</strong>: Template engine.</li>
        <li><strong>socket.io</strong>: Library for real-time web applications.</li>
    </ul>
    <h2>Development Dependencies</h2>
    <ul>
        <li><strong>nodemon</strong>: Tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.</li>
    </ul>
    <h2>Project Structure</h2>
    <pre><code>.
├── <span>package</span>.json
├── server.js
├── .env
├── <span>public</span>
│   ├── css
│   ├── js
│   └── images
├── views
│   ├── index.pug
│   └── layout.pug
└── routes
    ├── index.js
    └── users.js
</code></pre>
    <ul>
        <li><code>server.js</code>: Main entry point for the application.</li>
        <li><code>public</code>: Contains static assets such as CSS, JavaScript, and images.</li>
        <li><code>views</code>: Contains Pug templates for rendering HTML.</li>
        <li><code>routes</code>: Contains route definitions for the application.</li>
    </ul>
    <h2>License</h2>
    <p>This project is licensed under the ISC License - see the <a rel="noreferrer" href="LICENSE">LICENSE</a> file for details.</p>
    <h2>Author</h2>
    <p><strong>Faruk Sarkar</strong></p>
    <p>Feel free to contribute to the project by opening issues or submitting pull requests. For significant changes, please open an issue first to discuss what you would like to change.</p>
</div>
