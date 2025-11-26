# 🛡️ Military Asset Management System (MAMS)

A full-stack, role-based web application for managing military assets including weapons, ammunition, and equipment across multiple bases. Built with modern technologies and featuring a premium military-themed UI.

## ✨ Features

### Core Functionality
- 🔐 **Secure JWT Authentication** - Token-based authentication with role verification
- 👥 **Role-Based Access Control (RBAC)** - Three distinct user roles with different permissions
- 📊 **Real-time Inventory Dashboard** - Track assets across multiple bases
- 💰 **Asset Purchase Management** - Record and track new asset acquisitions
- 🔄 **Inter-Base Transfers** - Transfer assets between different military bases
- 🎯 **Unit Assignments** - Assign assets to specific military units
- 📝 **Comprehensive Audit Logs** - Track all transactions and changes (Admin only)
- 📈 **Net Movement Calculations** - Automatic calculation of inventory changes

### UI/UX Features
- 🎨 **Premium Military-Themed Design** - Professional dark slate color scheme
- ✨ **Modern Login Page** - Split-screen layout with animated backgrounds
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile
- 🌊 **Smooth Animations** - Glassmorphism effects and micro-interactions
- ⚡ **Fast Performance** - Optimized with Vite and React 19
- 🎯 **Intuitive Navigation** - Role-based menu system

---

## 🚀 Tech Stack

### Frontend
- **Framework**: React 19.1.0
- **Build Tool**: Vite 7.0.4
- **Routing**: React Router DOM 7.7.0
- **Styling**: Tailwind CSS 4.1.11
- **HTTP Client**: Axios 1.11.0
- **Authentication**: JWT Decode 3.1.2

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB 8.16.4 (Mongoose ODM)
- **Authentication**: JSON Web Tokens (JWT) 9.0.2
- **Password Hashing**: bcrypt 6.0.0
- **Environment**: dotenv 17.2.0
- **Logging**: Morgan 1.10.1
- **CORS**: cors 2.8.5

### Development Tools
- **Backend Dev Server**: Nodemon 3.1.10
- **Linting**: ESLint 9.30.1
- **Code Quality**: Prettier (configured)

---

## 📸 Screenshots

### Login Page
Modern split-screen design with military branding and glassmorphic elements.

### Admin Dashboard
Full access to all features including inventory overview, purchases, transfers, assignments, and audit logs.

### Logistics Dashboard
Limited access to transfers and assignments for operational logistics management.

### Commander Dashboard
Read-only access to view inventory and asset status across all bases.

---

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn package manager

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/military-asset-management-system.git
cd military-asset-management-system
```

### Step 2: Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mams
JWT_SECRET=your_secret_key_here
```

### Step 3: Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

---

## 🎯 Usage

### Default Test Accounts

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | `admin@example.com` | `admin123` | Full Access |
| **Logistics** | `logi@example.com` | `admin123` | Limited Access |
| **Commander** | `commander@example.com` | `admin123` | Read-Only |

### First Time Setup

1. Navigate to `http://localhost:5173/login`
2. Login with one of the test accounts above
3. Explore the features based on your role

---

## 👥 User Roles

### 🔴 Admin
**Full System Access**
- ✅ View Dashboard
- ✅ Purchase Assets
- ✅ Transfer Assets
- ✅ Assign Assets to Units
- ✅ View Audit Logs
- ✅ Manage All Operations

### 🟡 Logistics
**Operational Management**
- ✅ View Dashboard
- ❌ Purchase Assets (Restricted)
- ✅ Transfer Assets
- ✅ Assign Assets to Units
- ❌ View Audit Logs (Restricted)

### 🟢 Commander
**Read-Only Access**
- ✅ View Dashboard
- ❌ Purchase Assets (Restricted)
- ❌ Transfer Assets (Restricted)
- ❌ Assign Assets to Units (Restricted)
- ❌ View Audit Logs (Restricted)

---

## 📁 Project Structure

```
military-asset-management-system/
├── backend/
│   ├── models/
│   │   ├── User.js              # User schema with roles
│   │   ├── Inventory.js         # Inventory schema
│   │   └── Log.js               # Audit log schema
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── inventory.js         # Inventory management
│   │   ├── purchase.js          # Purchase operations
│   │   ├── transfer.js          # Transfer operations
│   │   ├── assignment.js        # Assignment operations
│   │   └── logs.js              # Audit logs
│   ├── middleware/
│   │   └── auth.js              # JWT verification & RBAC
│   ├── server.js                # Express app entry point
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx       # Role-based navigation
│   │   ├── pages/
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── Dashboard.jsx    # Main dashboard
│   │   │   ├── Purchase.jsx     # Purchase management
│   │   │   ├── Transfer.jsx     # Transfer management
│   │   │   ├── Assignment.jsx   # Assignment management
│   │   │   └── Logs.jsx         # Audit logs
│   │   ├── api.js               # Axios instance
│   │   ├── App.jsx              # Main app component
│   │   ├── index.css            # Global styles
│   │   └── main.jsx             # Entry point
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## 🔌 API Documentation

### Authentication

#### Login
```http
POST /api/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}

Response:
{
  "token": "jwt_token_here",
  "role": "admin"
}
```

### Inventory

#### Get All Inventory
```http
GET /api/inventory
Authorization: Bearer {token}

Response:
[
  {
    "_id": "...",
    "base": "Base Alpha",
    "assetType": "Rifles",
    "quantity": 150,
    "closingBalance": 150
  }
]
```

### Purchases

#### Create Purchase
```http
POST /api/purchase
Authorization: Bearer {token}
Content-Type: application/json

{
  "base": "Base Alpha",
  "assetType": "Rifles",
  "quantity": 50,
  "date": "2025-11-26"
}
```

### Transfers

#### Create Transfer
```http
POST /api/transfer
Authorization: Bearer {token}
Content-Type: application/json

{
  "fromBase": "Base Alpha",
  "toBase": "Base Beta",
  "assetType": "Rifles",
  "quantity": 20,
  "date": "2025-11-26"
}
```

### Assignments

#### Create Assignment
```http
POST /api/assignment
Authorization: Bearer {token}
Content-Type: application/json

{
  "base": "Base Alpha",
  "assetType": "Rifles",
  "unit": "Unit 101",
  "quantity": 30,
  "date": "2025-11-26"
}
```

### Logs (Admin Only)

#### Get All Logs
```http
GET /api/logs
Authorization: Bearer {token}

Response:
[
  {
    "_id": "...",
    "action": "Purchase",
    "user": "admin@example.com",
    "details": "Purchased 50 Rifles at Base Alpha",
    "timestamp": "2025-11-26T10:30:00Z"
  }
]
```

---

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds for password security
- **Role-Based Middleware**: Server-side role verification
- **CORS Protection**: Configured CORS policies
- **Input Validation**: Server-side validation for all inputs
- **Token Expiration**: Automatic token expiration handling

---

## 🧪 Testing

The application has been thoroughly tested with:
- ✅ All three user roles (Admin, Logistics, Commander)
- ✅ Role-based access control verification
- ✅ Navigation and routing
- ✅ Authentication flows
- ✅ CRUD operations for all features
- ✅ Responsive design across devices

---

## 🛠️ Development

### Running in Development Mode

**Backend (with auto-reload):**
```bash
cd backend
npm run dev
```

**Frontend (with HMR):**
```bash
cd frontend
npm run dev
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



## 🙏 Acknowledgments

- Built as a demonstration of full-stack development capabilities
- Military-themed design inspired by modern defense systems
- Thanks to the open-source community for the amazing tools and libraries

<div align="center">
  <p>Made with ❤️ for military asset management</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
