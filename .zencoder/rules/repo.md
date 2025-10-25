---
description: Repository Information Overview
alwaysApply: true
---

# CoffeeBara SPA Information

## Summary
CoffeeBara is a Single Page Application (SPA) for a coffee shop, built with React, TypeScript, and Vite. The project consists of a frontend React application and a backend Express.js server. The application allows users to browse the coffee shop menu, place orders, create accounts, and view their order history.

## Structure
- **src/**: React frontend application with TypeScript
  - **components/**: Reusable UI components
  - **pages/**: Application pages/routes
  - **context/**: React context providers (Auth)
  - **styles/**: CSS stylesheets
- **server/**: Express.js backend server
  - **server.js**: Main server entry point
- **public/**: Static assets and images

## Frontend (React SPA)

### Language & Runtime
**Language**: TypeScript/JavaScript
**Framework**: React 19
**Build System**: Vite 7
**Package Manager**: npm

### Dependencies
**Main Dependencies**:
- react: ^19.1.1
- react-dom: ^19.1.1
- react-router-dom: ^7.9.4

**Development Dependencies**:
- typescript: ~5.9.3
- @vitejs/plugin-react: ^5.0.4
- eslint: ^9.36.0
- vite: ^7.1.7

### Build & Installation
```bash
npm install
npm run dev    # Development server
npm run build  # Production build
```

## Backend (Express Server)

### Language & Runtime
**Language**: JavaScript (ES Modules)
**Framework**: Express 4
**Database**: MySQL
**Package Manager**: npm

### Dependencies
**Main Dependencies**:
- express: ^4.21.2
- mysql2: ^3.15.3
- bcrypt: ^6.0.0
- cors: ^2.8.5
- dotenv: ^16.6.1

**Development Dependencies**:
- nodemon: ^3.1.10

### Build & Installation
```bash
cd server
npm install
npm run dev    # Development server with nodemon
npm start      # Production server
```

### Database
**Type**: MySQL
**Configuration**: Environment variables in server/.env
- DB_HOST: Database host (default: localhost)
- DB_USER: Database username (default: root)
- DB_PASS: Database password
- DB_NAME: Database name (default: coffeebara)

**Tables**:
- users: User accounts with authentication
- orders: Customer orders with product details

## Application Features
- User authentication (signup/login)
- Coffee shop menu browsing
- Order placement system
- Order history tracking
- Responsive design

## Entry Points
**Frontend**: src/main.tsx (React application entry)
**Backend**: server/server.js (Express server entry)
**API Endpoints**:
- /api/signup: User registration
- /api/login: User authentication
- /api/orders: Order management