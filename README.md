# 🤝 CareCircle – Collaborative Platform for Social Service & Community Support

> A modern, full-stack **MERN (MongoDB, Express.js, React, Node.js)** platform connecting passionate volunteers with verified NGOs and grassroots community initiatives. Designed with a clean, light color palette and responsive architecture.

---

## 🌟 Executive Summary & Website Purpose
In every neighborhood and city, many civic-minded individuals want to contribute their skills and time to meaningful causes, while local non-governmental organizations (NGOs) and community groups constantly face shortages of reliable volunteers. 

**CareCircle** bridges this gap through a unified digital platform featuring transparent task creation, volunteer assignment, status tracking, volunteer gamification/rankings, and real-time community impact analytics.

---

## 📋 Features Checklist & Alignment with Project Rubric

### 1. Mandatory Requirements
- [x] **Volunteer Registration**: Profile creation with skills, interests, location, bio, and initial badge tier.
- [x] **NGO Registration**: Verified non-profit registration with organization name, registration number, and mission statement.
- [x] **Secure Authentication**: JWT-based authentication with bcrypt password hashing, role-based authorization (`volunteer` vs `ngo`), and 1-Click Demo Logins for instant evaluation.
- [x] **Task Creation (NGO)**: Rich form allowing NGOs to specify Title, Category, Location (or Remote), Date, Duration in Hours, Required Volunteers, Urgency, and Preferred Skills.
- [x] **Task Assignment**: Volunteers can enroll with a single click (instant spot reservation), and NGOs can review and manage applicant statuses (`applied`, `assigned`, `completed`, `rejected`).
- [x] **Task Status Lifecycle**: Full state management transitioning between `Open` ➔ `In Progress` ➔ `Completed` ➔ `Cancelled`.
- [x] **Interactive Dashboards**:
  - **NGO Dashboard**: Manage active listings, track volunteer signups, view applicant rosters, and trigger status updates.
  - **Volunteer Dashboard**: Track enrolled activities, view hours completed, log points, and check current badge tiers.
- [x] **Full MongoDB CRUD Operations**: Complete Create, Read, Update, and Delete endpoints for tasks and user profiles.

### 2. Additional Requirements
- [x] **6 Comprehensive Task Categories**:
  1. 📚 **Education**: Tutoring, STEM mentorship, digital literacy for youth.
  2. 🍲 **Food distribution**: Community kitchens, food drives, shelter meal delivery.
  3. 🌱 **Environment**: Tree plantation, lake cleanups, waste segregation.
  4. 👴 **Elder support**: Companionship, medical visits, smartphone workshops for seniors.
  5. 🚨 **Disaster support**: Flood relief kits, dry ration sorting, emergency logistics.
  6. 🏘️ **Community service**: Public park renovation, wall murals, civic drives.

### 3. Advanced Features
- [x] **Volunteer Ranking & Hall of Fame**:
  - Live leaderboard ranking volunteers based on cumulative **Impact Points**, **Hours Contributed**, and **Tasks Completed**.
  - Top-3 Olympic-style Podium (`🥇 Champion`, `🥈 Silver Star`, `🥉 Bronze Star`).
  - Dynamic Progression Badges: *Starter Samaritan* ➔ *Active Contributor* ➔ *Community Pillar* ➔ *Care Champion*.
- [x] **Real-Time Impact Dashboard**:
  - Aggregate statistics: Total Volunteers, Partner NGOs, Completed Drives, Volunteer Hours Dedicated, and Beneficiaries Impacted.
  - Visual Category Distribution Breakdown meters displaying task count and percentage.
  - Recent community success stories and impact notes.

---

## 🎨 Theme & UI/UX Design System
- **Light Color Palette**: Clean slate backgrounds (`#f8fafc`), pure white cards (`#ffffff`), fresh sky blue accents (`#0284c7`), soothing teals (`#0d9488`), and emerald highlights (`#10b981`).
- **Accessible Typography**: Crisp, modern font hierarchy powered by *Plus Jakarta Sans*.
- **Responsive Layout**: Fluid mobile drawer navigation, responsive grids, and clean badges.

---

## 🏗️ Architecture & Technology Stack

```
   ┌──────────────────────────────────────────────────────────────┐
   │                   React.js Frontend (Vite)                   │
   │  - React Router DOM v6       - Lucide Icons                  │
   │  - Light Design System       - Canvas Confetti & Toast alerts │
   │  - Context API Auth State    - Axios HTTP Client             │
   └──────────────────────────────┬───────────────────────────────┘
                                  │ JSON REST API
                                  ▼
   ┌──────────────────────────────────────────────────────────────┐
   │                  Express.js / Node.js API                    │
   │  - JWT Bearer Auth           - Role-Based Access Control     │
   │  - Mongoose ODM              - RESTful Endpoints             │
   │  - Static Asset Serving (Production Monolith for Render)    │
   └──────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
   ┌──────────────────────────────────────────────────────────────┐
   │                    MongoDB Atlas Cloud                       │
   │  - Users Collection (Volunteer & NGO Schemas)                │
   │  - Tasks Collection (Category, Applicant References & State) │
   │  - Aggregation Pipelines for Metrics & Leaderboard           │
   └──────────────────────────────────────────────────────────────┘
```

---

## 🚀 Setup & Run Locally in VS Code

### Prerequisites
- **Node.js** (v18 or higher recommended; v20/v24 tested)
- **NPM** (v9 or higher)
- **VS Code** (Visual Studio Code)

---

### Step-by-Step Instructions

#### 1. Open the Project in VS Code
1. Launch **Visual Studio Code**.
2. Go to **File ➔ Open Folder...** and select the `CareCircle` folder.
3. Open a new Terminal in VS Code (**Terminal ➔ New Terminal** or press `Ctrl + \``).

---

#### 2. Configure Environment Variables
A `.env` file is already created in the project root and in `server/.env`.
Ensure your `server/.env` contains:

```env
PORT=5000
MONGODB_URI=mongodb+srv://nivasrithirumeni24_db_user:WEUsPG5vF7jOOHf1@cluster0.sjoy5jx.mongodb.net/carecircle?retryWrites=true&w=majority
JWT_SECRET=carecircle_super_secure_jwt_secret_key_2025_social_impact
NODE_ENV=development
```

> [!IMPORTANT]
> **MongoDB Atlas IP Whitelist (Essential Step)**:
> In MongoDB Atlas, clusters restrict inbound network access by default.
> 1. Open [MongoDB Atlas Dashboard](https://cloud.mongodb.com).
> 2. Navigate to **Network Access** under the **Security** tab in the left sidebar.
> 3. Click **+ ADD IP ADDRESS**.
> 4. Choose **Allow Access from Anywhere** (`0.0.0.0/0`) and click **Confirm**.
> 5. Wait 1-2 minutes for MongoDB Atlas to apply changes.

---

#### 3. Install Dependencies
In the VS Code terminal root folder, execute:

```powershell
npm run install:all
```
*(This installs dependencies for both the backend server and the React client).*

---

#### 4. Seed the Database with Realistic Demo Data
Populate your database with sample NGOs, volunteers, task listings across all 6 categories, and leaderboard points:

```powershell
npm run seed
```

You should see:
```
✅ Created 3 sample NGOs
✅ Created 5 sample Volunteers
✅ Created 8 sample Tasks across all categories
✨ Database Seeding Completed Successfully!
```

---

#### 5. Run the Application in Development Mode

You have two convenient options:

**Option A (Single unified command with concurrent logs):**
```powershell
npm run dev
```

**Option B (Two split terminals in VS Code):**
- **Terminal 1 (Backend API):**
  ```powershell
  cd server
  npm run dev
  ```
  *(Server runs at http://localhost:5000)*

- **Terminal 2 (Frontend Client):**
  ```powershell
  cd client
  npm run dev
  ```
  *(Vite client runs at http://localhost:5173)*

Open your browser and navigate to **http://localhost:5173**.

---

### 🔑 Demo Login Credentials for Viva / Quick Testing
You can use the 1-Click Demo buttons on the Login page, or enter:

| Role | Email | Password |
|---|---|---|
| **NGO Organizer** | `asha.foundation@carecircle.org` | `password123` |
| **Volunteer Leader** | `nivasri@carecircle.org` | `password123` |
| **New Volunteer** | `priya@carecircle.org` | `password123` |

---

## 📡 Complete REST API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a Volunteer or NGO.
- `POST /api/auth/login` - Authenticate user and issue JWT token.
- `GET /api/auth/me` - Retrieve current authenticated user profile (Private).
- `PUT /api/auth/update-profile` - Update bio, phone, location, skills, NGO mission (Private).

### Tasks (`/api/tasks`)
- `GET /api/tasks` - List all tasks with query filters (`?category=Education&status=Open&search=tutoring`).
- `GET /api/tasks/:id` - Fetch comprehensive details of a task and its applicants.
- `POST /api/tasks` - Create a new community service task (Private - NGO only).
- `PUT /api/tasks/:id` - Edit task details (Private - Task Creator NGO only).
- `DELETE /api/tasks/:id` - Delete a task (Private - Task Creator NGO only).
- `POST /api/tasks/:id/apply` - Volunteer registers/enrolls in a task (Private - Volunteer only).
- `POST /api/tasks/:id/withdraw` - Volunteer withdraws from a task (Private - Volunteer only).
- `PATCH /api/tasks/:id/status` - Transition task status between `Open`, `In Progress`, `Completed`, `Cancelled` (Private - NGO only).
- `PATCH /api/tasks/:id/applicants/:userId` - Update volunteer applicant status to `assigned`, `completed` (awards points and hours), or `rejected` (Private - NGO only).
- `GET /api/tasks/ngo/my-tasks` - Retrieve tasks created by the logged-in NGO (Private).
- `GET /api/tasks/volunteer/my-tasks` - Retrieve tasks enrolled by the logged-in Volunteer (Private).

### Analytics & Leaderboard (`/api/stats`)
- `GET /api/stats/leaderboard` - Top volunteers ranked by impact points, hours, and completed tasks.
- `GET /api/stats/impact` - Aggregate community impact metrics, category breakdown percentages, and recent success stories.
- `GET /api/health` - Health check status and MongoDB connection verification.
## DEMO LINK: https://carecircle-platform.onrender.com/
## 🛡️ License
This project is open-source and created for educational, social service, and community empowerment purposes. Built with the MERN Stack.
