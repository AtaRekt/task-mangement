# nextjs-lucia-postgres-shadcn-template

A template for building web applications with Next.js, Lucia for authentication, PostgreSQL database, Drizzle ORM, and shadcn/ui components.

## Features

- 🔐 Authentication with Lucia
- 📦 PostgreSQL Database
- 🛠 Drizzle ORM
- 🎨 shadcn/ui Components
- ⚡️ Next.js App Router

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/AtaRekt/nextjs-lucia-postgres-shadcn-template.git
cd nextjs-lucia-postgres-shadcn-template
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up your environment variables:
```bash
# Copy the example environment file
cp .env.example .env

# Open .env and update the POSTGRES_URL with your database credentials
POSTGRES_URL="postgresql://username:password@host:port/database"
```

4. Generate and run Drizzle migrations:
```bash
# Generate migration
npm run db:generate
# or
yarn db:generate
# or
pnpm db:generate

# Run migration
npm run db:migrate
# or
yarn db:migrate
# or
pnpm db:migrate
```

5. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## Environment Variables

Create a `.env` file in the root directory by copying `.env.example`:

```env
# Database
POSTGRES_URL="postgresql://username:password@host:port/database"

# Auth (optional)
# Add any other environment variables your authentication setup needs
```

## Available Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:generate  # Generate Drizzle migrations
npm run db:migrate   # Run migrations
npm run db:pull      # Pull database schema
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio

# Additional Commands
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## License

MIT
