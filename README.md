# Supreme Cal 🧮

A social media-inspired calculator app built with Next.js, TypeORM, and SQLite.

## Features

- 🧮 **Full Calculator** — Basic arithmetic, percentage, sign toggle, backspace
- 📜 **Calculation History** — Feed-style history of past calculations
- 📤 **Share Calculations** — Copy to clipboard, generate shareable links
- 🌙 **Dark Theme** — Modern social media aesthetic with purple/blue gradients
- 📱 **Mobile Responsive** — Fully responsive with tab-based navigation on mobile
- ⌨️ **Keyboard Support** — Full keyboard input support

## Tech Stack

- **Next.js 14** with App Router & TypeScript
- **TypeORM** with **better-sqlite3** for database
- **Tailwind CSS** for styling
- **Docker** for deployment

## Development

```bash
# Install dependencies
npm i

# Create data directory
mkdir -p data

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Copy `.env.example` to `.env` and adjust as needed:

```env
DATABASE_PATH=./data/supreme-cal.sqlite
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## Docker Deployment

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

The SQLite database is persisted in a Docker volume (`supreme-cal-data`).

## Coolify Deployment

1. Connect your repository to Coolify
2. Set build pack to **Docker Compose**
3. Set environment variables in Coolify dashboard
4. Deploy!

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/calculations` | Get all calculations (newest first) |
| POST | `/api/calculations` | Save a new calculation |
| POST | `/api/share` | Mark calculation as shared, get shareable URL |
