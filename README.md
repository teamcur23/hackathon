# 💰 Expense Tracker

A modern, user-friendly expense tracking application to help you manage your finances effectively.

## 📋 Table of Contents

- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- **📊 Dashboard**: Visual overview of your spending patterns
- **💳 Transaction Management**: Add, edit, and delete expenses
- **📂 Categories**: Organize expenses by categories (Food, Transport, Entertainment, etc.)
- **📈 Analytics**: Charts and reports to track spending trends
- **💰 Budget Setting**: Set monthly budgets and get alerts
- **🔍 Search & Filter**: Find specific transactions quickly
- **📱 Responsive Design**: Works seamlessly on desktop and mobile
- **🌙 Dark Mode**: Toggle between light and dark themes
- **📤 Export**: Export your data to CSV format

## 🖼️ Screenshots

*[Add screenshots of your application here]*

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Data visualization
- **React Router** - Client-side routing

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Development Tools
- **Vite** - Fast build tool
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/expense-tracker.git
   cd expense-tracker
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Create .env file in backend directory
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/expense-tracker
   JWT_SECRET=your-secret-key
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB (if running locally)
   mongod
   ```

5. **Run the application**
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend (in a new terminal)
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📖 Usage

### Getting Started

1. **Sign Up/Login**: Create an account or log in to your existing account
2. **Add Categories**: Set up expense categories that match your spending habits
3. **Set Budget**: Define monthly budgets for different categories
4. **Track Expenses**: Start adding your daily expenses
5. **Monitor Progress**: Check the dashboard for spending insights

### Key Features

#### Adding an Expense
1. Click the "Add Expense" button
2. Fill in the amount, category, description, and date
3. Save the transaction

#### Setting Budgets
1. Navigate to the Budget section
2. Set monthly limits for each category
3. Receive notifications when approaching limits

#### Viewing Reports
1. Go to the Analytics section
2. Select date range and categories
3. View spending patterns and trends

## 🔌 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### POST /api/auth/login
Login user
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Expense Endpoints

#### GET /api/expenses
Get all expenses for the authenticated user
```json
{
  "expenses": [
    {
      "id": "1",
      "amount": 25.50,
      "category": "Food",
      "description": "Lunch at restaurant",
      "date": "2024-01-15"
    }
  ]
}
```

#### POST /api/expenses
Add a new expense
```json
{
  "amount": 25.50,
  "category": "Food",
  "description": "Lunch at restaurant",
  "date": "2024-01-15"
}
```

#### PUT /api/expenses/:id
Update an expense
```json
{
  "amount": 30.00,
  "category": "Food",
  "description": "Dinner at restaurant",
  "date": "2024-01-15"
}
```

#### DELETE /api/expenses/:id
Delete an expense

### Category Endpoints

#### GET /api/categories
Get all categories
```json
{
  "categories": [
    {
      "id": "1",
      "name": "Food",
      "color": "#FF6B6B"
    }
  ]
}
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests**
   ```bash
   npm test
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons from [Heroicons](https://heroicons.com/)
- Charts powered by [Chart.js](https://www.chartjs.org/)
- UI components inspired by modern design systems

## 📞 Support

If you have any questions or need help:

- 📧 Email: support@expensetracker.com
- 🐛 Report bugs: [GitHub Issues](https://github.com/yourusername/expense-tracker/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/expense-tracker/discussions)

---

**Made with ❤️ by [Your Name]** 