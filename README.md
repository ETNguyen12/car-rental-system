# React + Flask Full-Stack Template

A boilerplate template for building modern web applications with React on the frontend and Flask on the backend, which provides seamless integration between the two frameworks.

---

## Features

- **Frontend**: Built with React for a modern, responsive user interface.
- **Backend**: Flask for a lightweight and scalable API backend.
- **Development Proxy**: Streamlines local development by proxying API requests from the frontend to the backend.
- **Modular Design**: Organized structure for easy scalability.
- **Virtual Environment**: Isolated Python environment for managing backend dependencies.
- **Reusable**: Ready-to-use template for rapid project initialization.

---

## Directory Structure

```
react-flask-template/
├── backend/             # Flask backend
│   ├── run.py           # Main entry point for Flask
│   ├── requirements.txt # Backend dependencies
│   ├── venv/            # Python virtual environment (not included in repo)
│   └── ...
├── frontend/            # React frontend
│   ├── public/          # Static files
│   ├── src/             # React components and logic
│   ├── package.json     # Frontend dependencies
│   └── ...
└── README.md            # Documentation
```

---

## Prerequisites

Ensure the following are installed on your system:

- Python 3.7+
- Node.js (with npm or yarn)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd react-flask-template
```

### 2. Backend Setup (Flask)

1. Navigate to the `backend` directory:

   ```bash
   cd backend
   ```

2. Create a virtual environment:

   ```bash
   python3 -m venv venv
   ```

3. Activate the virtual environment:

   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```

4. Install required dependencies:

   ```bash
   pip install -r requirements.txt
   ```

5. Start the Flask server:

   ```bash
   flask run
   ```

   The backend will be running at `http://127.0.0.1:5000`.

---

### 3. Frontend Setup (React)

1. Open a new terminal window and navigate to the `frontend` directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the React development server:

   ```bash
   npm start
   ```

   The frontend will be running at `http://localhost:3000`.

   > **Note**: During development, API calls from React will be proxied to the Flask backend automatically.

---

## Future Enhancements

- Add database integration (e.g., SQLite, PostgreSQL).
- Include authentication and authorization.
- Dockerize the project for containerized deployments.