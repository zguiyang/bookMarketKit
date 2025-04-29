# Book Market Kit

> 🚀 A modern open-source intelligent bookmark management platform, built with Next.js & NestJS.

---

> 中文版请见: [README.zh.md](./README.zh.md)

---

## Overview

Book Market Kit is a full-stack solution for web bookmark collection, smart categorization, and content summarization. It features AI-powered categorization, content summarization, tag-based filtering, and more, helping users efficiently manage and discover valuable web content.

---

## Key Features

- **Smart Bookmark Management**: Save web bookmarks with one click and auto-categorize
- **AI Categorization**: AI analyzes bookmark content and recommends categories
- **Content Summarization**: AI generates summaries for web content and extracts key information
- **Multi-Tag System**: Add multiple tags to bookmarks for easy filtering
- **Global Search**: Search by title, URL, description, tags, and more
- **Category Management**: Custom categories with drag-and-drop, edit, and delete
- **Responsive Design**: Works seamlessly on desktop and mobile

---

## Development Progress (TODO)

- [x] Smart bookmark management
- [x] AI-powered categorization (beta)
- [x] Content summarization (beta)
- [x] Tag system
- [x] Responsive UI
- [ ] User profile & authentication
- [ ] Batch import/export bookmarks
- [ ] Notification system
- [ ] Admin dashboard
- [ ] Replace UI placeholders with real screenshots

---

## Product Screenshots

> The following are sample UI placeholders. Replace with real screenshots for production use.

### Bookmark Home & Browsing

![Home Screenshot](https://via.placeholder.com/900x500?text=Home+Page+Placeholder)

### Smart Bookmark & AI Summary

![AI Summary Screenshot](https://via.placeholder.com/900x500?text=AI+Summary+Placeholder)

### Category & Tag Management

![Category Management Screenshot](https://via.placeholder.com/900x500?text=Category+Management+Placeholder)

---

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Shadcn UI, Zustand, SWR, Zod
- **Backend**: NestJS, TypeScript, PostgreSQL, MongoDB, Drizzle ORM, Redis, Zod

---

## Getting Started

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Start development**
   ```bash
   # Start both frontend and backend
   pnpm dev

   # Frontend only
   pnpm client:dev

   # Backend only
   pnpm backend:dev
   ```

3. **Build & Production**
   ```bash
   pnpm build
   pnpm start
   ```

---

## Contributing

We welcome community contributions! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## License

[ISC](./LICENSE)
