# Wechi - Simple Expense Tracking

Wechi is a modern, intuitive expense tracking web application built with Laravel and React. It helps you manage your finances with ease by tracking expenses, analyzing spending patterns, and providing insights to take control of your budget.

## Features

- 📊 **Dashboard Overview** - Get a quick snapshot of your financial health
- 💰 **Expense Tracking** - Add and categorize your expenses
- 📈 **Reports & Analytics** - Visualize your spending patterns
- 🎯 **Budget Management** - Set and monitor budget goals
- 🔍 **Search & Filter** - Easily find specific transactions
- 📱 **Responsive Design** - Works seamlessly on all devices

## Tech Stack

- **Backend**: Laravel 12 with PHP 8.2+
- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Radix UI
- **Authentication**: Laravel WorkOS
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js 18+ and npm
- SQLite (or MySQL/PostgreSQL)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wechi-expense-tracker
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Database setup**
   ```bash
   php artisan migrate
   ```

6. **Start the development server**
   ```bash
   # Start Laravel server
   php artisan serve
   
   # In another terminal, start Vite
   npm run dev
   ```

7. **Visit the application**
   Open your browser and navigate to `http://localhost:8000`

## Usage

### Dashboard
- View your total expenses for the current month
- See budget remaining and spending trends
- Quick access to recent transactions
- Financial insights and tips

### Expenses
- Add new expenses with categories
- Search and filter transactions
- View detailed expense history
- Categorize spending for better analysis

### Reports
- Analyze spending by category
- View monthly spending trends
- Get AI-powered financial insights
- Export reports for external analysis

## Project Structure

```
wechi-expense-tracker/
├── app/                    # Laravel application logic
├── resources/
│   └── js/
│       ├── components/     # React components
│       ├── pages/          # Page components
│       ├── layouts/        # Layout components
│       └── ui/             # UI component library
├── routes/                 # Application routes
├── database/               # Migrations and seeders
└── public/                 # Public assets
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need support, please open an issue on GitHub.

---

Built with ❤️ using Laravel and React 