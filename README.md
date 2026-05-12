# Project Camp Backend

A RESTful API service for collaborative project management enabling teams to organize projects, manage tasks with subtasks, maintain project notes, and handle user authentication with role-based access control.

**Version:** 1.0.0  
**Author:** Anas Taha

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [User Roles & Permissions](#user-roles--permissions)
- [Authentication](#authentication)
- [File Management](#file-management)

---

## ✨ Features

### User Authentication & Authorization

- User registration with email verification
- Secure JWT-based authentication with refresh tokens
- Password management (change, forgot, reset)
- Role-based access control (Admin, Project Admin, Member)

### Project Management

- Create, read, update, and delete projects
- Project member management and role assignment
- View all projects with member count
- Role-based project access

### Task Management

- Create and manage tasks with title, description, and assignee
- Three-state task status (Todo, In Progress, Done)
- File attachments support for tasks
- Task assignment to team members

### Subtask Management

- Create and manage subtasks within tasks
- Track subtask completion status
- Hierarchical task organization

### Project Notes

- Create and manage project-level notes
- Admin-only note creation and deletion

### System Health

- Health check endpoint for API monitoring

---

## 🛠️ Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js 5.2.1
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **Email Service:** Nodemailer + Mailgen
- **Middleware:** CORS
- **Development:** Nodemon, Prettier
- **Environment:** dotenv

---

## 📁 Project Structure

```
project-management/
├── src/
│   ├── app.js                 # Express app configuration
│   ├── index.js              # Server entry point
│   ├── controllers/
│   │   ├── auth.controllers.js
│   │   └── healthcheck.controller.js
│   ├── models/
│   │   └── user.models.js     # User schema and methods
│   ├── routes/
│   │   ├── auth.route.js
│   │   └── healthcheck.routes.js
│   ├── db/
│   │   └── index.js           # MongoDB connection
│   ├── middlewares/           # Custom middleware
│   ├── utils/
│   │   ├── api-error.js       # Error handling
│   │   ├── api-response.js    # Response formatting
│   │   ├── async-handler.js   # Async wrapper
│   │   ├── constants.js       # App constants
│   │   └── mail.js            # Email service
│   └── validators/            # Input validation
├── public/
│   └── images/                # File uploads
├── .env                       # Environment variables
├── package.json
└── PRD.md                     # Product requirements
```

---

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd project-management
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables** (see [Environment Setup](#environment-setup))

---

## ⚙️ Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=8000
CORS_ORIGIN=*

# Database
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>

# JWT Tokens
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

# Mailtrap Email Service
MAILTRAP_API_TOKEN=your_mailtrap_api_token
MAILTRAP_SMTP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_SMTP_PORT=2525
MAILTRAP_SMTP_USER=your_mailtrap_user
MAILTRAP_SMTP_PASS=your_mailtrap_password
```

### Environment Variable Descriptions

| Variable               | Description                            |
| ---------------------- | -------------------------------------- |
| `PORT`                 | Server port (default: 8000)            |
| `CORS_ORIGIN`          | Allowed CORS origins (comma-separated) |
| `MONGO_URI`            | MongoDB connection string              |
| `ACCESS_TOKEN_SECRET`  | Secret for JWT access tokens           |
| `ACCESS_TOKEN_EXPIRY`  | Access token expiration time           |
| `REFRESH_TOKEN_SECRET` | Secret for JWT refresh tokens          |
| `REFRESH_TOKEN_EXPIRY` | Refresh token expiration time          |
| `MAILTRAP_*`           | Email service credentials              |

---

## 🚀 Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start at `http://localhost:8000`

---

## 🔌 API Endpoints

### Health Check

```
GET /api/v1/healthcheck/
```

### Authentication Routes (`/api/v1/auth/`)

| Method | Endpoint                     | Description               | Auth Required |
| ------ | ---------------------------- | ------------------------- | ------------- |
| POST   | `/register`                  | User registration         | ✗             |
| POST   | `/login`                     | User login                | ✗             |
| POST   | `/logout`                    | User logout               | ✓             |
| GET    | `/current-user`              | Get current user info     | ✓             |
| POST   | `/change-password`           | Change password           | ✓             |
| POST   | `/refresh-token`             | Refresh access token      | ✗             |
| GET    | `/verify-email/:token`       | Verify email              | ✗             |
| POST   | `/forgot-password`           | Request password reset    | ✗             |
| POST   | `/reset-password/:token`     | Reset password            | ✗             |
| POST   | `/resend-email-verification` | Resend verification email | ✓             |

### Project Routes (`/api/v1/projects/`)

| Method | Endpoint                      | Description          | Auth Required |
| ------ | ----------------------------- | -------------------- | ------------- |
| GET    | `/`                           | List user projects   | ✓             |
| POST   | `/`                           | Create project       | ✓             |
| GET    | `/:projectId`                 | Get project details  | ✓             |
| PUT    | `/:projectId`                 | Update project       | ✓             |
| DELETE | `/:projectId`                 | Delete project       | ✓             |
| GET    | `/:projectId/members`         | List project members | ✓             |
| POST   | `/:projectId/members`         | Add project member   | ✓             |
| PUT    | `/:projectId/members/:userId` | Update member role   | ✓             |
| DELETE | `/:projectId/members/:userId` | Remove member        | ✓             |

### Task Routes (`/api/v1/tasks/`)

| Method | Endpoint                         | Description        | Auth Required |
| ------ | -------------------------------- | ------------------ | ------------- |
| GET    | `/:projectId`                    | List project tasks | ✓             |
| POST   | `/:projectId`                    | Create task        | ✓             |
| GET    | `/:projectId/t/:taskId`          | Get task details   | ✓             |
| PUT    | `/:projectId/t/:taskId`          | Update task        | ✓             |
| DELETE | `/:projectId/t/:taskId`          | Delete task        | ✓             |
| POST   | `/:projectId/t/:taskId/subtasks` | Create subtask     | ✓             |
| PUT    | `/:projectId/st/:subTaskId`      | Update subtask     | ✓             |
| DELETE | `/:projectId/st/:subTaskId`      | Delete subtask     | ✓             |

### Note Routes (`/api/v1/notes/`)

| Method | Endpoint                | Description        | Auth Required |
| ------ | ----------------------- | ------------------ | ------------- |
| GET    | `/:projectId`           | List project notes | ✓             |
| POST   | `/:projectId`           | Create note        | ✓             |
| GET    | `/:projectId/n/:noteId` | Get note details   | ✓             |
| PUT    | `/:projectId/n/:noteId` | Update note        | ✓             |
| DELETE | `/:projectId/n/:noteId` | Delete note        | ✓             |

---

## 👥 User Roles & Permissions

The system implements a three-tier role-based access control:

### Role Hierarchy

| Feature                    | Admin | Project Admin | Member |
| -------------------------- | ----- | ------------- | ------ |
| Create Projects            | ✓     | ✗             | ✗      |
| Update/Delete Projects     | ✓     | ✗             | ✗      |
| Manage Project Members     | ✓     | ✗             | ✗      |
| Create/Update/Delete Tasks | ✓     | ✓             | ✗      |
| View Tasks                 | ✓     | ✓             | ✓      |
| Update Subtask Status      | ✓     | ✓             | ✓      |
| Create/Delete Subtasks     | ✓     | ✓             | ✗      |
| Create/Update/Delete Notes | ✓     | ✗             | ✗      |
| View Notes                 | ✓     | ✓             | ✓      |

### Role Descriptions

- **Admin:** Full system access, manages all projects, users, and permissions
- **Project Admin:** Project-level administrative access, can manage tasks and content within assigned projects
- **Member:** Basic project member access, can view projects and update task completion status

---

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

### Token Types

- **Access Token:** Short-lived token for API requests (expires in 1 day)
- **Refresh Token:** Long-lived token for obtaining new access tokens (expires in 10 days)

### Usage

1. Register or login to obtain tokens
2. Include the access token in request headers:
   ```
   Authorization: Bearer <access_token>
   ```
3. Use the refresh token to get a new access token before expiry

---

## 📎 File Management

- **Upload Location:** `public/images/`
- **Supported:** Multiple file attachments on tasks
- **Security:** Secure file upload handling via Multer middleware
- **Metadata:** File URL, MIME type, and size tracking

---

## 📝 API Response Format

### Success Response

```json
{
  "statusCode": 200,
  "data": { ... },
  "message": "Success message",
  "success": true
}
```

### Error Response

```json
{
  "statusCode": 400,
  "message": "Error message",
  "errors": [],
  "success": false
}
```

---

## 🔒 Security Features

- JWT-based authentication with refresh tokens
- Role-based authorization middleware
- Input validation on all endpoints
- Email verification for account security
- Secure password reset functionality
- File upload security with Multer middleware
- CORS configuration for cross-origin requests
- Password hashing with bcrypt

---

## 📧 Email Notifications

The system uses Mailgen and Nodemailer for sending emails:

- **Account Verification:** Email confirmation link on registration
- **Password Reset:** Secure password reset via email token
- **Resend Verification:** Option to resend verification email

Email configuration uses Mailtrap (sandbox) for development and testing.

---

## 🤝 Contributing

This project was created for learning purposes. Feel free to fork and modify as needed.

---

## 📄 License

ISC License - See package.json for details

---

## 👨‍💻 Author

**Anas Taha**

---

## 📚 Additional Resources

For detailed API specifications and requirements, refer to [PRD.md](PRD.md)

---

## ✅ Success Criteria

- ✓ Secure user authentication and authorization system
- ✓ Complete project lifecycle management
- ✓ Hierarchical task and subtask organization
- ✓ Role-based access control implementation
- ✓ File attachment capability for enhanced collaboration
- ✓ Email notification system for user verification and password reset
- ✓ Comprehensive API structure and documentation
