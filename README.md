# Habit Tracker

A modern, responsive web application to help you build and maintain good habits. Track your daily routines, visualize your progress, and stay motivated.

## Features

- ✅ **Create & Manage Habits** – Add habits with a name, category, color, and goal type (binary or quantitative).
- 📅 **Daily Tracking** – Mark habits as done for any date; see your daily progress at a glance.
- 🔥 **Streak Calculation** – Automatically tracks your current streak for each habit.
- 📊 **Statistics & Calendar** – Visualize your performance with a heatmap calendar and charts (last 7/30 days).
- 🌓 **Dark Mode** – Switch between light and dark themes.
- 💾 **Local Storage** – All data is saved in your browser; no sign-up required.
- 📤 **Export / Import** – Backup your data as JSON.
- 📱 **Mobile Friendly** – Fully responsive design.

## Tech Stack

- **Frontend:** React (Vite), TypeScript, React Router, Redux Toolkit (or Zustand), React Hook Form
- **Styling:** CSS Modules / Tailwind CSS (choose one)
- **Date Handling:** date-fns
- **Charts:** Recharts / Chart.js
- **Icons:** React Icons & custom SVGs
- **Storage:** localStorage (with persistence layer)

## Demo

[Live Demo](https://your-demo-link.vercel.app) – try it out!

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Web-Zhaba/HabTrack.git
   cd habit-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

The project follows a feature-based architecture, which organizes code by business domains rather than by technical roles. This makes the codebase more scalable and maintainable as the application grows.

```
src/
├── app/               # App-wide setup: providers, router, global styles, store configuration
├── assets/            # Static files (images, fonts, icons)
├── features/          # Feature modules, each containing all code for a specific domain
│   ├── habits/        # Everything related to habit management (CRUD, types, hooks)
│   ├── settings/      # User preferences, theme toggles, data export/import
│   └── statistics/    # Calendar, charts, progress visualization
├── pages/             # Page components that compose features into full pages
├── shared/            # Reusable UI components, helpers, hooks, and types used across features
└── main.tsx           # Application entry point
```

## Contributing

Contributions are welcome! If you have ideas for improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Vite](https://vitejs.dev/) and [React](https://reactjs.org/).

---

*Happy habit building!*