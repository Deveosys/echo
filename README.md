# Echo - Backup Management System

A modern, full-stack backup management application built with Laravel and React that allows you to create, manage, and monitor file backups to various destinations including AWS S3.

## 🚀 Features

- **Backup Creation & Management**: Create and manage backup configurations with ease
- **Source File Selection**: Choose specific files and directories to backup
- **Multiple Destination Support**: Configure various backup destinations (AWS S3, local storage, etc.)
- **Scheduled Backups**: Set up automated backups with flexible scheduling options
    - Daily, weekly, monthly, and yearly schedules
    - Custom cron expressions for advanced scheduling
- **Backup Instance Tracking**: Monitor individual backup executions and their status
- **Automatic Rotation**: Intelligent cleanup of old backups to manage storage space
- **Real-time Monitoring**: Track backup progress and receive notifications
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- **User Authentication**: Secure user management with email verification
- **Queue Processing**: Background job processing for reliable backup operations

## 🛠️ Tech Stack

### Backend

- **Laravel 12** - PHP framework for robust backend development
- **PHP 8.2+** - Modern PHP with enhanced performance
- **MySQL/PostgreSQL** - Database support
- **Redis** - Caching and queue management
- **AWS SDK for PHP** - Cloud storage integration

### Frontend

- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe JavaScript development
- **Inertia.js** - Seamless SPA experience
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons

### Development Tools

- **Vite** - Fast build tool and dev server
- **Pest** - Testing framework
- **Laravel Sail** - Docker development environment
- **ESLint & Prettier** - Code quality and formatting

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **PHP 8.2 or higher**
- **Composer** (PHP package manager)
- **Node.js 18+** and **npm**
- **MySQL 8.0+** or **PostgreSQL 13+**
- **Redis** (for queue processing)
- **Git**

## 🚀 Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd echo
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

5. **Configure your environment**
   Edit `.env` file with your database, Redis, and AWS credentials:

    ```env
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=echo_backup
    DB_USERNAME=your_username
    DB_PASSWORD=your_password

    REDIS_HOST=127.0.0.1
    REDIS_PASSWORD=null
    REDIS_PORT=6379

    AWS_ACCESS_KEY_ID=your_aws_key
    AWS_SECRET_ACCESS_KEY=your_aws_secret
    AWS_DEFAULT_REGION=us-east-1
    AWS_BUCKET=your_backup_bucket
    ```

6. **Run database migrations**

    ```bash
    php artisan migrate
    ```

7. **Build frontend assets**

    ```bash
    npm run build
    ```

8. **Start the development server**

    ```bash
    # Using Laravel's built-in server
    php artisan serve

    # Or use the development script for full stack
    composer run dev
    ```

## 🐳 Docker Development

For a complete development environment with Docker:

```bash
# Start all services
./vendor/bin/sail up -d

# Install dependencies
./vendor/bin/sail composer install
./vendor/bin/sail npm install

# Run migrations
./vendor/bin/sail artisan migrate

# Build assets
./vendor/bin/sail npm run build
```

## 📁 Project Structure

```
echo/
├── app/
│   ├── Http/Controllers/     # API and web controllers
│   ├── Jobs/                 # Background job classes
│   ├── Models/               # Eloquent models
│   ├── Services/             # Business logic services
│   └── Providers/            # Service providers
├── database/
│   ├── migrations/           # Database schema migrations
│   ├── seeders/              # Database seeders
│   └── factories/            # Model factories
├── resources/
│   └── js/
│       ├── components/       # React components
│       ├── pages/            # Page components
│       ├── layouts/          # Layout components
│       └── types/            # TypeScript type definitions
├── routes/                   # Application routes
├── storage/                  # File storage
└── tests/                    # Test files
```

## 🔧 Configuration

### Backup Destinations

Configure backup destinations in the application:

1. **AWS S3**: Set up S3 bucket credentials in `.env`
2. **Local Storage**: Configure local storage paths
3. **Custom Destinations**: Extend the destination system for other cloud providers

### Queue Configuration

For reliable backup processing, configure your queue driver:

```env
QUEUE_CONNECTION=redis
```

Start the queue worker:

```bash
php artisan queue:work
```

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
composer test

# Run tests with coverage
composer test -- --coverage

# Run specific test file
./vendor/bin/pest tests/Feature/BackupTest.php
```

## 📦 Production Deployment

1. **Optimize for production**

    ```bash
    composer install --optimize-autoloader --no-dev
    npm run build
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    ```

2. **Set up queue workers**

    ```bash
    php artisan queue:work --daemon
    ```

3. **Configure web server** (Apache/Nginx) to point to the `public/` directory

4. **Set up SSL certificates** for secure HTTPS access

## 🔒 Security

- All user inputs are validated and sanitized
- CSRF protection enabled
- SQL injection prevention through Eloquent ORM
- XSS protection with proper output escaping
- Secure file upload handling
- Authentication with email verification

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/echo/issues) page
2. Create a new issue with detailed information
3. Include error logs and steps to reproduce

## 🗺️ Roadmap

- [ ] Support for additional cloud providers (Google Cloud, Azure)
- [ ] Backup encryption
- [ ] Incremental backup support
- [ ] Backup verification and integrity checks
- [ ] Webhook notifications
- [ ] Backup analytics and reporting
- [ ] Multi-tenant support
- [ ] API for third-party integrations

---

**Echo** - Making backup management simple and reliable. 🔄
