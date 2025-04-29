# Book Market Kit

> 🚀 A modern open-source intelligent bookmark management platform, built with Next.js & NestJS.

---

> 中文版请见: [README.zh.md](./README.zh.md)

---

## Overview

Book Market Kit is a full-stack solution for web bookmark collection, smart categorization, and content summarization. It integrates AI-powered categorization, content summarization, tag-based filtering, and more, helping users efficiently manage and discover valuable web content.

---

## Key Features

- **Smart Bookmark Management**: Save web bookmarks with one click and auto-categorize
- **Tag System**: Add multiple tags to bookmarks for easy filtering
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Batch Import/Export**: Import and export bookmarks in bulk (coming soon)
- **AI Categorization**: AI analyzes bookmark content and recommends categories (coming soon)
- **Content Summarization**: AI generates summaries for web content and extracts key information (coming soon)
- **Global Search**: Fuzzy search bookmarks, tags, and categories by name
- **Category Management**: Custom categories with add, edit, and delete

---

## Development Progress (TODO)

- [x] Smart bookmark management
- [x] Tag system
- [x] Responsive UI
- [ ] Batch import/export bookmarks
- [ ] AI-powered categorization
- [ ] Content summarization

---

## Product Screenshots

> The following are sample UI screenshots. Replace with real screenshots for production use.

![Home Screenshot 1](https://pic1.imgdb.cn/item/6810b1dd58cb8da5c8d45d72.png)
![Home Screenshot 2](https://pic1.imgdb.cn/item/6810b20d58cb8da5c8d45d87.jpg)

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
