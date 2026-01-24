# Fintech Dashboard

A minimal monorepo skeleton for a fintech dashboard project. Back-end provides sample API endpoints; front-end consumes data to render a simple dashboard.

## 🚀 Getting Started

### Prerequisites
- Node.js v18+ (recommended v20+)
- npm v9+ or yarn v1.22+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/fintech-dashboard.git
cd fintech-dashboard

# Install dependencies
npm install
```

### Running the Project

#### Development Mode

```bash
# Start both backend and frontend in development mode
npm start

# Or start individually
npm run -w backend dev    # Backend on http://localhost:3001
npm run -w frontend dev   # Frontend on http://localhost:5173
```

#### Production Build

```bash
# Build both backend and frontend
npm run build

# Start the backend (frontend needs to be served separately)
npm run -w backend start
```

## 📂 Project Structure

```
fintech-dashboard/
├── packages/
│   ├── backend/       # Express.js backend with TypeScript
│   │   ├── src/        # Source code
│   │   ├── tests/      # API tests
│   │   └── package.json
│   └── frontend/      # React frontend with Vite
│       ├── src/        # React components and views
│       └── package.json
├── scripts/           # Utility scripts
├── .github/           # GitHub configuration
├── .gitignore
├── package.json       # Root workspace config
└── README.md
```

## 🔧 Available Scripts

### Root Level
- `npm install` - Install all dependencies
- `npm start` - Start both backend and frontend in dev mode
- `npm run build` - Build both packages
- `npm run lint` - Run linting for both packages
- `npm test` - Run API smoke tests

### Backend (from root)
- `npm run -w backend dev` - Start backend in dev mode
- `npm run -w backend build` - Build backend
- `npm run -w backend start` - Start production backend
- `npm run -w backend lint` - Lint backend code

### Frontend (from root)
- `npm run -w frontend dev` - Start frontend in dev mode
- `npm run -w frontend build` - Build frontend
- `npm run -w frontend preview` - Preview production build
- `npm run -w frontend lint` - Lint frontend code

## 📦 API Endpoints

### Accounts
- `GET /accounts` - Get all accounts
- `GET /accounts/:id` - Get specific account

### Transactions
- `GET /transactions` - Get all transactions
- `GET /transactions?accountId=A-001` - Filter by account
- `GET /transactions?startDate=2023-01-01&endDate=2023-12-31` - Filter by date range
- `GET /transactions?category=groceries` - Filter by category
- `GET /transactions?minAmount=100&maxAmount=1000` - Filter by amount range

### Health Check
- `GET /health` - Health check endpoint

## 🧪 Testing

```bash
# Run API smoke tests
npm test

# Run backend tests specifically
npm run -w backend test
```

## 🛠 Tech Stack

### Backend
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: SQLite (with sqlite3)
- **API Docs**: Swagger UI
- **Validation**: Custom middleware
- **Error Handling**: Custom error classes

### Frontend
- **Framework**: React 18
- **Bundler**: Vite 5
- **Language**: TypeScript
- **Routing**: React Router v6
- **Styling**: CSS modules

### Tooling
- **Package Manager**: npm workspaces
- **Linting**: ESLint with TypeScript and React plugins
- **Formatting**: Prettier
- **Testing**: Jest (backend), React Testing Library (frontend)

## 🔒 Environment Variables

Create a `.env` file in the backend package:

```env
# Backend configuration
PORT=3001
DATABASE_URL=./fintech.db
NODE_ENV=development
```

## 📝 Code Style & Quality

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured with TypeScript and React plugins
- **Prettier**: Standard configuration
- **Commit Messages**: Follow conventional commits

## 🚀 Deployment

### Docker (coming soon)
```bash
# Build and run with Docker
docker-compose up --build
```

### Manual Deployment
1. Build both frontend and backend
2. Serve frontend static files (e.g., with nginx, Vercel, Netlify)
3. Run backend on a Node.js server (e.g., AWS, Heroku, Render)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## 📜 License

MIT License - see the LICENSE file for details.

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---
