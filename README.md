# CT - Vocabulary Learning Application

A full-stack web application for vocabulary learning and task management, built with React (frontend) and Express.js (backend).

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **MongoDB** (local instance or connection string ready)

## 🚀 Quick Start

### 1. Install Dependencies

**Client:**
```bash
cd client
npm install
```

**Server:**
```bash
cd server
npm install
```

### 2. Environment Setup

Create `.env` file in the `/server` folder with your MongoDB connection string:
```env
MONGODB_URI=mongodb://localhost:27017
PORT=3000
```

### 3. Start the Application

**Start the Server (Terminal 1):**
```bash
cd server
npm run dev
```
Server runs on `http://localhost:3000`

**Start the Client (Terminal 2):**
```bash
cd client
npm run dev
```
Client runs on `http://localhost:5173` (Vite default)

## 📦 Project Structure

```
root/
├── client/          # React + TypeScript + Vite frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── server/          # Express.js + TypeScript backend
│   ├── src/
│   └── package.json
└── docs/           # Architecture & documentation
```

## Technology Stack

### Frontend
- **React** 19.x
- **TypeScript** 6.x
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS
- **Jest** - Testing framework
- **ESLint** - Code quality

### Backend
- **Express.js** 4.x
- **TypeScript** 6.x
- **MongoDB** - Database
- **Jest** - Testing framework

## 📝 Development Workflow

1. **Local Development**: Run both client and server in development mode for live reload
2. **Testing**: Write tests in `__tests__/` directories and run `npm run test`
3. **Linting**: Run `npm run lint` in client to check code quality
4. **Building**: Use `npm run build` to create production bundles

## 🧪 Running Tests

**Client Tests:**
```bash
cd client
npm run test                # Run all tests
npm run test:coverage       # With coverage report
```

**Server Tests:**
```bash
cd server
npm run test                # Run all tests
npm run test:coverage       # With coverage report
```

## 📚 Documentation

See the `/docs` folder for more information:
- `ARCHITECTURE.md` - System architecture overview
- `CONTRIBUTING.md` - Contribution guidelines
- `CONTEXT.md` - Project context

Happy coding! 🎉
