# API Playground

A production-ready, frontend-only API Tester web application built with React, Tailwind CSS, and Zustand.

## Features

- **Request Builder**: Support for GET, POST, PUT, PATCH, DELETE.
- **Dynamic Variable Resolution**: Use `{{VARIABLE_NAME}}` in URLs, Headers, and JSON bodies.
- **Environment Management**: Switch between Development, Production, or custom environments.
- **Monaco Editor**: High-performance JSON editing with syntax highlighting and validation.
- **Collections & History**: Save your favorite requests and access recent ones.
- **Beautiful Response Viewer**: Status codes, response time, payload size, and pretty-printed JSON.
- **Dark Mode**: Sleek developer-centric UI.
- **Keyboard Shortcuts**: Press `Ctrl + Enter` to send a request quickly.

## Tech Stack

- **React (Vite)**
- **Tailwind CSS** (Theming via CSS variables)
- **Zustand** (Global state & Persistence)
- **Axios** (API requests)
- **Monaco Editor** (Code editing)
- **Lucide React** (Icons)

## Getting Started

### Installation

```bash
npm install
```

### Running Locally

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

## Environment Variables

You can define variables in the Sidebar under the "Environment" section.
Example:

- Key: `BASE_URL`
- Value: `https://jsonplaceholder.typicode.com`

Then use it in your request: `{{BASE_URL}}/users`

## License

MIT
