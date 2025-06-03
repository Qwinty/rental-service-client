# Six Cities Rental Client

A modern single-page application for browsing short‑term rental offers across multiple European cities. Built with **React 19**, **TypeScript**, **Vite** and **Redux Toolkit**, the client consumes a REST API and provides an Airbnb‑like experience with interactive maps, favourites and reviews.

## Features

* 🔍 **City switcher** – quickly browse offers in different cities via tab navigation.
* 🗺️ **Interactive map** powered by Leaflet – highlights the active offer and nearby places.
* 🧑‍💼 **Authentication & roles** – registration, login and protected routes for authorised users.
* ⭐ **Favourites** – bookmark offers and keep them in sync across devices.
* 💬 **Reviews** – read and post ratings with real‑time validation.
* ⚡ **Skeleton loaders & tooltips** for a polished perceived performance.
* 📱 **Responsive design** – works great on mobile, tablet and desktop.

## Tech stack

| Layer   | Library / Tool                  |
| ------- | ------------------------------- |
| UI      | React 19, React Router DOM 7    |
| State   | Redux Toolkit 2 + React‑Redux 9 |
| Styling | CSS Modules (vanilla CSS)       |
| Maps    | Leaflet 1.9 & @types/leaflet    |
| Tooling | Vite 6, TypeScript 5, ESLint    |

> The dev server runs on **[http://localhost:3000](http://localhost:3000)** and proxies API requests to **[http://localhost:5000](http://localhost:5000)** out of the box ("/api" & "/static" paths) – see `vite.config.ts`.

## Getting started

```bash
# 1. Clone the repository
git clone https://github.com/your-org/your-repo.git
cd your-repo

# 2. Install dependencies
npm install         # or pnpm install / yarn

# 3. Provide API url (optional)
echo "VITE_API_URL=https://api.example.com" > .env.local

# 4. Start development server
npm run dev
```

### Available scripts

| Command           | Purpose                                |
| ----------------- | -------------------------------------- |
| `npm run dev`     | Start Vite dev server with HMR         |
| `npm run build`   | Production build (type‑check + bundle) |
| `npm run preview` | Preview built assets                   |
| `npm run lint`    | Lint all source files                  |

## Folder structure

```folder_structure
src/
├── components/      # Re‑usable UI blocks
├── pages/           # Route‑level components
├── hooks/           # Typed hooks for Redux
├── services/        # API wrappers (REST)
├── store/           # Redux root reducer & actions
├── types/           # Shared TypeScript types
└── utils.ts         # Pure utility functions
public/              # Static assets & icons
```

## Environment variables

| Variable       | Default                     | Description              |
| -------------- | --------------------------- | ------------------------ |
| `VITE_API_URL` | `http://localhost:5000/api` | Base URL for backend API |

## Contributing

1. Fork the repository
2. Create a feature branch `git checkout -b feature/amazing`
3. Commit your changes (`npm run lint` must pass)
4. Open a Pull Request

## License

MIT – see `LICENSE` file for details.
