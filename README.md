# Book Market Kit

> 🚀 A modern open-source intelligent bookmark management platform, built with Next.js & NestJS.

[中文版](./README.zh.md)

---

## Product Screenshots

> The following are sample UI screenshots

![Home Screenshot 1](https://pic1.imgdb.cn/item/6810b45c58cb8da5c8d45ebc.png)

![Home Screenshot 2](https://pic1.imgdb.cn/item/6810b45c58cb8da5c8d45ebd.png)

---

## Overview

Book Market Kit is a full-stack solution for web bookmark collection, smart categorization, and content summarization. It integrates AI-powered categorization, content summarization, tag-based filtering, and more, helping users efficiently manage and discover valuable web content.

---

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, Zustand, Zod
- **Backend**: Fastify 5, TypeScript, MongoDB (mongoose), Redis, Zod

---

## Key Features

- **Smart Bookmark Management**: Save web bookmarks with one click and auto-categorize
- **AI Categorization**: AI analyzes bookmark content and recommends categories
- **Content Summarization**: AI generates summaries for web content and extracts key information
- **Tag System**: Add multiple tags to bookmarks for easy filtering
- **Global Search**: Fuzzy search bookmarks, tags, and categories by name
- **Category Management**: Custom categories with add, edit, and delete
- **Responsive Design**: Works seamlessly on desktop and mobile

---

## Development Progress (TODO)

- [x] Smart bookmark management
- [x] Tag system
- [x] Responsive UI
- [x] Batch import/export bookmarks
- [ ] AI-powered categorization
- [ ] Content summarization

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
