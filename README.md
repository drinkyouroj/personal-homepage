# Personal Homepage

A modern, customizable personal homepage with social media integration, built with Next.js, TypeScript, and Prisma. Features a visual page builder, real-time social media feeds, and full Docker support.

## Features

- 🎨 **Visual Page Builder** - Drag-and-drop interface to customize your homepage
- 📱 **Mobile-First Design** - Responsive grid layout that looks great on all devices
- 🔄 **Real-Time Updates** - Automatic syncing of social media activity
- 📊 **Social Media Integration** - Support for Twitter, GitHub, YouTube, Facebook, Instagram, Substack, Discord, and Steam
- 🔐 **Password-Protected Admin** - Secure authentication for managing your site
- 🎯 **SEO Optimized** - Built-in SEO support with meta tags, Open Graph, and sitemap
- 📈 **Analytics Ready** - Support for Google Analytics and Plausible
- 🐳 **Docker Support** - Easy deployment with Docker Compose
- 🔧 **Extensible** - Easy to add new pages and sections

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Deployment**: Docker

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- Docker and Docker Compose (for containerized deployment)
- PostgreSQL (if not using Docker)

### Installation

1. **Clone the repository** (or use the files you have)

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   - `DATABASE_URL` - PostgreSQL connection string
   - `NEXTAUTH_SECRET` - Generate a random secret (e.g., `openssl rand -base64 32`)
   - `NEXTAUTH_URL` - Your site URL (e.g., `http://localhost:3000`)
   - Social media API keys (optional, add as needed)

4. **Set up the database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Create an admin user**:
   ```bash
   # You can use the API endpoint or create directly in the database
   curl -X POST http://localhost:3000/api/users \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com","password":"your-password","name":"Admin"}'
   ```

6. **Run the development server**:
   ```bash
   npm run dev
   ```

7. **Access the application**:
   - Public homepage: http://localhost:3000
   - Admin panel: http://localhost:3000/admin

## Docker Deployment

1. **Build and start containers**:
   ```bash
   docker-compose up -d
   ```

2. **Set up the database** (first time only):
   ```bash
   docker-compose exec app npx prisma db push
   ```

3. **Create an admin user**:
   ```bash
   docker-compose exec app node -e "
     const { createUser } = require('./lib/auth');
     createUser('admin@example.com', 'your-password', 'Admin').then(() => console.log('User created'));
   "
   ```

4. **Access the application**:
   - Public homepage: http://localhost:3000
   - Admin panel: http://localhost:3000/admin

## Usage

### Admin Panel

1. Log in at `/admin/login` with your credentials
2. Use the **Page Builder** tab to:
   - Add sections (Social Feed, About, Stats, Custom)
   - Drag and drop to reorder sections
   - Edit section content and styling
   - Show/hide sections

3. Use the **Social Media** tab to:
   - Enable/disable platforms
   - Configure API keys and credentials
   - Manually sync social media data

4. Use the **Settings** tab to:
   - Configure site title and description
   - Set up analytics (Google Analytics, Plausible)
   - Manage SEO settings

### Social Media Integration

#### GitHub
- Get a personal access token from GitHub Settings → Developer settings → Personal access tokens
- Add token and username in the admin panel

#### YouTube
- Get an API key from Google Cloud Console
- Get your Channel ID from YouTube Studio
- Add both in the admin panel

#### Twitter/X
- Requires Twitter API v2 credentials
- OAuth 2.0 implementation needed (currently placeholder)

#### Other Platforms
- Facebook, Instagram, Substack, Discord, and Steam integrations are placeholders
- Implement according to each platform's API documentation

### Adding Custom Pages

The system is extensible - you can add new pages by:
1. Creating a new page in the database (via admin panel or API)
2. Adding routes in `app/[slug]/page.tsx` (already set up)
3. Customizing sections as needed

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   └── [slug]/            # Dynamic page routes
├── components/            # React components
│   ├── admin/            # Admin components
│   ├── sections/         # Section components
│   └── ui/               # UI components
├── lib/                   # Utility functions
├── prisma/               # Database schema
└── types/               # TypeScript types
```

## Environment Variables

See `.env.example` for all available environment variables. Key ones:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - Your site URL
- `NEXTAUTH_SECRET` - Secret for NextAuth (generate a random string)
- Social media API keys (optional)

## Development

```bash
# Run development server
npm run dev

# Generate Prisma client
npm run db:generate

# Push database schema changes
npm run db:push

# Open Prisma Studio (database GUI)
npm run db:studio
```

## Production Deployment

1. Update environment variables in production
2. Build the application:
   ```bash
   npm run build
   ```
3. Start the production server:
   ```bash
   npm start
   ```

Or use Docker:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Security Notes

- Change default database passwords in production
- Use strong `NEXTAUTH_SECRET` in production
- Store API keys securely (consider encryption)
- Enable HTTPS in production
- Regularly update dependencies

## License

MIT

## Contributing

Feel free to submit issues and enhancement requests!

