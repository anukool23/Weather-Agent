# 🌟 Weather Assistant — Full‑Stack (React 19 + Node 20) with Docker

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind v4" />
  <img src="https://img.shields.io/badge/Vite-Fast-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Node.js-20-43853D?logo=node.js&logoColor=white" alt="Node 20" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white" alt="Docker" />
</p>

**Weather Assistant** is an AI-powered app with a **React (Vite) frontend** and a **Node.js (Express) backend**.  
It uses **OpenAI (GPT)** for natural language understanding and a **Weather API** to fetch real-time conditions.  
The assistant follows a **plan → action → observation → output** JSON workflow for tool use.

---

## ✨ Features

- 🧠 **AI Assistant** — OpenAI GPT for intelligent, contextual answers
- 🌦️ **Live Weather** — Fetches current conditions via Weather API
- 🧩 **Structured Reasoning** — JSON-based plan/action/observation/output
- 🎨 **Modern UI** — React 19 + Vite + TailwindCSS v4
- 🐳 **Containerized** — Dockerfiles for client & server + Docker Compose
- ♻️ **Dev Friendly** — Optional server hot reload via bind-mount

---

## 📦 Monorepo Layout

```
project-root/
│── docker-compose.yml
│
├── client/                       # React 19 + Vite + Tailwind v4 (served by Nginx in prod)
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── src/...
│
└── server/                       # Node.js + Express backend
    ├── Dockerfile
    ├── package.json
    └── server.js
```

---

## 🚀 Quick Start

### Option A — Run with Docker (recommended)

```bash
docker-compose up --build
```
- Frontend → http://localhost:8080  
- Backend  → http://localhost:3000

> Ensure your environment variables are set (see **Environment Variables**).

### Option B — Run locally (without Docker)

**Backend**
```bash
cd server
npm install
# create server/.env with OPENAI_API_KEY and WEATHER_API_KEY
node server.js
# server listens on http://localhost:3000
```

**Frontend**
```bash
cd client
npm install
# create client/.env with VITE_API_BASE_URL=http://localhost:3000
npm run dev
# app served by Vite (default http://localhost:5173)
```

---

## 🌐 API

**Endpoint**
```
POST /api/weather
```

**Request**
```json
{ "query": "What is weather in Delhi" }
```

**Response (example)**
```json
{ "answer": "The current weather in Chunar is 33.4°C." }
```

> If your backend is currently using a different route (e.g., `/weather` or `/ask`), update the frontend `axios.post` URL or align the server route to `/api/weather` for consistency.

---

## ⚙️ Backend (server)

**Tech**: Node.js 20, Express, Axios, OpenAI SDK

**Environment variables (`server/.env`)**
```env
OPENAI_API_KEY=your_openai_api_key
WEATHER_API_KEY=your_weather_api_key
```

**Dockerfile (Server)**

```dockerfile
# Use Node.js base image
FROM node:20

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port 3000 inside the container
EXPOSE 3000

# Run the server
CMD [ "node", "server.js" ]
```

**Example server route**

```js
// POST /api/weather
// req.body = { query: "What is weather in Delhi" }
app.post("/api/weather", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Query is required" });

    const answer = await getWeatherInfo(query); // your GPT+Weather orchestration
    res.status(200).json({ answer });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});
```

---

## 🖥️ Frontend (client)

**Tech**: React 19, Vite, TailwindCSS v4, Axios

**Environment variables (`client/.env`)**
```env
VITE_API_BASE_URL=http://localhost:3000
```

## 🐳 Dockerfiles

### Client (React + Vite + Nginx)

```dockerfile
# Stage 1: Build React app
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code
COPY . .

# Build Vite app
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
```

### Server (Node.js Backend)

```dockerfile
# Use Node.js base image
FROM node:20

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port 3000 inside the container
EXPOSE 3000

# Run the server
CMD [ "node", "server.js" ]
```

---

## 🧩 Docker Compose

```yaml
version: "3.9"

services:
  server:
    build:
      context: ./server
      dockerfile: Dockerfile
    container_name: myapp-server
    ports:
      - "3000:3000"
    volumes:
      - ./server:/usr/src/app          # optional: hot reload in dev
      - /usr/src/app/node_modules
    environment:
      - NODE_ENV=development
    restart: always

  client:
    build:
      context: ./client
      dockerfile: Dockerfile
    container_name: myapp-client
    ports:
      - "8080:80"                       # frontend at http://localhost:8080
    depends_on:
      - server
    restart: always
```

> If your backend needs secrets at runtime inside Docker, pass them via
> `--env-file server/.env` or add an `env_file` section in `docker-compose.yml`.

---

## 🔐 Environment Variables

**Backend**
```env
# server/.env
OPENAI_API_KEY=your_openai_api_key
WEATHER_API_KEY=your_weather_api_key
```

**Frontend**
```env
# client/.env
VITE_API_BASE_URL=http://localhost:3000
```

---

## 🧭 Example Workflows

**Backend only (CLI/API)**
```bash
cd server && node server.js
# POST http://localhost:3000/api/weather
# body: { "query": "What is weather in Delhi" }
```

**Full stack (Docker)**
```bash
docker-compose up --build
# Open http://localhost:8080 and ask: "What is weather in Delhi"
```

---

## 🧰 Troubleshooting

### Tailwind v4 / Vite
- **Error**: `Cannot find package '@tailwindcss/vite'`  
  **Fix**: `npm i -D @tailwindcss/vite` and add it to `vite.config.js`.

- **Error**: `Cannot find module '@tailwindcss/postcss'` or  
  **Error**: `It looks like you're trying to use tailwindcss directly as a PostCSS plugin`  
  **Fix**: Tailwind v4 does **not** require `postcss.config.js`. Remove it; rely on `@tailwindcss/vite`.

### React / Bundler
- **Error**: `React is not defined at main.jsx:7`  
  **Fix**: Ensure React plugin in Vite and optionally add `import React from "react";` to `main.jsx` if your setup requires it.

### Chrome Extension snippet (if used)
- **Error**: `chrome.runtime.onMessage.addListner is not a function`  
  **Fix**: Typo. Use `addListener` (with **e**).

### Docker / Server
- **Error**: `OPENAI_API_KEY environment variable is missing` in container  
  **Fix**: Run with env file:  
  `docker run --env-file server/.env ...` or add `env_file` to compose.

---

## 🙌 Acknowledgments

- **[OpenAI](https://openai.com/)** — GPT models  
- **[Weather API](https://www.weatherapi.com/)** — Real-time weather data  
- **[React](https://react.dev/)**, **[Vite](https://vitejs.dev/)**, **[TailwindCSS](https://tailwindcss.com/)**

---

## 📜 License

MIT © 2025 Your Name
