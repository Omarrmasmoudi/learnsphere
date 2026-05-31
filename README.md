# LearnSphere 🎓

LearnSphere is a modern, full-stack E-learning platform designed to empower educators and students through a seamless, interactive learning experience. Built with the latest technologies, it offers a robust foundation for scalable educational applications.

## 🚀 Key Features

- **Dynamic Course Discovery:** Explore a wide range of courses across various categories with real-time filtering.
- **Teacher Dashboard:** Comprehensive tools for instructors to create, manage, and edit course content.
- **Interactive Course Player:** Structured learning with sections and high-quality video integration.
- **Secure Authentication:** Custom JWT-based authentication system ensuring user data privacy.
- **Seamless Media Management:** Integrated with UploadThing for fast and reliable image/video uploads.
- **Responsive Design:** A polished, mobile-first UI built with Tailwind CSS and Radix UI (Shadcn UI).

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) / [Shadcn UI](https://ui.shadcn.com/)
- **Authentication:** Custom JWT with `jose` & `bcrypt`
- **File Uploads:** [UploadThing](https://uploadthing.com/)
- **State Management:** React Hooks & Server Actions

## 📖 Getting Started

### Prerequisites

- Node.js (v18.17 or later)
- PostgreSQL database
- Environment variables configured (see `.env.example`)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/learnsphere.git
   cd learnsphere
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up the database:**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Project Structure

- `app/`: Next.js pages and API routes.
- `components/`: Reusable UI and layout components.
- `lib/`: Core logic, server actions, and shared utilities.
- `prisma/`: Database schema and migrations.
- `hooks/`: Custom React hooks for shared logic.

## 🛡️ Security & Performance

- **Optimized Images:** Utilizing `next/image` for automatic image optimization and faster LCP.
- **Type Safety:** 100% TypeScript coverage for reliable and maintainable code.
- **Secure Auth:** JWT-based sessions with hashed passwords and protected routes.

---

*This project was developed to demonstrate full-stack engineering proficiency and a commitment to modern web development standards.*
