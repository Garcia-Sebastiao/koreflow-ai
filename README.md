# Kore Flow 🚀

**Kore Flow** is a modern productivity and team management platform designed to bridge the gap between task execution and performance evaluation. Built for speed and scalability, it allows organizations to manage multiple workspaces, track real-time task progress, and generate data-driven performance insights.

## ✨ MVP Features

- **Authentication**: Secure login/signup using Firebase Auth (Email/Password & Google Provider).
- **Workspace Multi-tenancy**: Create and manage multiple organizations with custom logos and unique slugs.
- **Role-Based Access Control (RBAC)**: Secure permissions for Admins, Leaders, Devs, and QAs managed via Firestore Security Rules.
- **Task Management (Boards)**: Interactive boards for tracking tasks through "To Do", "Doing", and "Done" states.
- **Performance Analytics**: Automated evaluation of team members based on task completion rates and deadlines.

## 🛠 Tech Stack

- **Frontend**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn/UI](https://ui.shadcn.com/)
- **Backend/BaaS**: [Firebase](https://firebase.google.com/) (Auth, Firestore, Storage)
- **State Management**: [Zustand](https://docs.pmnd.rs/zustand/)
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Yup](https://github.com/jquense/yup)

## 🏗 Architecture & Security

Kore Flow uses a highly secure **Multi-tenant architecture** at the database level:

- **Atomic Writes**: Workspaces and Admin memberships are created simultaneously using `Firestore Write Batches` to ensure data integrity.
- **Composite IDs**: Member permissions are indexed by `${userId}_${workspaceId}` for $O(1)$ permission checks in Security Rules.
- **Optimistic UI**: Utilizing TanStack Query's `onMutate` for instant UI feedback during workspace and task operations.

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone (https://github.com/Garcia-Sebastiao/koreflow-ai.git)

2. **Install dependencies**
   ```bash
   npm install

3. **Configure Environment Variables**
    ```bash
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     VITE_FIREBASE_APP_ID=your_app_id

4. **Launch Development Server**
   ```bash
     npm run dev

## 📜 License
This project is licensed under the MIT License - see the LICENSE file for details.
