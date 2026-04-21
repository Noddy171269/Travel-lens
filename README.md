# TravelLens — Trip Planner

TravelLens is a modern, full-stack trip planning and management application designed to help users organize their itineraries, manage travel budgets, and store essential documents. It features a highly polished dark-mode interface with glassmorphism design elements and a custom-built interactive cosmic canvas background.

## ✨ Features

- **Premium UI/UX:** A stunning dark-themed interface utilizing glassmorphism, smooth animations, and a rich "killer" cosmic background (complete with twinkling stars, shooting stars, aurora waves, and glowing particles with mouse repulsion).
- **Authentication System:** Secure sign up, login, and robust forgot-password flows powered by Firebase Authentication.
- **Trip Dashboard:** An intuitive dashboard for managing multiple trips.
- **Dedicated Trip Modules:**
  - **Budget Tracker:** Monitor and categorize travel expenses.
  - **Itinerary Planner:** Schedule and view day-by-day activities.
  - **Document Storage:** Manage tickets, itineraries, and other important files.
- **Client-side Routing:** Fast, seamless transitions between pages using React Router.

## 🛠️ Tech Stack

- **Frontend:** React 19, React Router v7
- **Build Tool:** Vite
- **Styling:** CSS (Vanilla + Tailwind configuration), custom Canvas API animations
- **Backend/Auth:** Firebase (Authentication, Firestore)
- **Icons:** Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Git
- A Firebase project setup

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Noddy171269/Travel-lens.git
   cd travel-lens
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a `.env` file in the root directory (or use `.env.local`).
   - Add your Firebase configuration keys (matching `src/services/firebase.js`):
     ```env
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   The app will be running at `http://localhost:5174/` (or another port if 5174 is in use).

## 🌍 Deployment

This project includes a `vercel.json` configuration file with rewrite rules to support Single Page Application (SPA) routing. It can be easily deployed to [Vercel](https://vercel.com/) with zero additional configuration.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
