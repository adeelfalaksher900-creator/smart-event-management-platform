# EVENTOS: Smart Event Management Platform

> **Unifying the hackathon lifecycle into one intelligent, high-performance workspace.**

Eventos is a comprehensive Smart Event Management Platform designed to eliminate the friction of organizing large-scale tech events. By consolidating registration, team matchmaking, judging, and live analytics into a single dashboard, Eventos empowers organizers, judges, and participants to focus on what matters most: innovation.

---

## 🏗️ System Architecture & UX Flow

Eventos operates on a strict **Role-Based Access Control (RBAC)** architecture, ensuring users only see data and actions relevant to their persona.

```text
[ Landing Page ] ──> [ Role Selection ] ──> [ RBAC Router (AppShell) ]
                                                   │
     ┌─────────────────────────────────────────────┼─────────────────────────────────────────────┐
     ▼                                             ▼                                             ▼
[ Participant Workspace ]                 [ Judge Workspace ]                          [ Organizer Workspace ]
 • Dashboard (Stats, Feed)                 • Dashboard (Queue, Feed)                    • Dashboard (Live Analytics)
 • Team Matchmaking (Join/Create)          • Judging Portal (Rubrics, Scoring)          • Event Management
 • Project Submission                      • Leaderboard (Read-only)                    • Leaderboard (Manage)
 • Leaderboard (Read-only)
```

---

## 🎯 Chosen Vertical
**Smart Event Management Platform**

---

## 🧠 Approach and Logic

### Smart Team Matchmaking
The matchmaking algorithm (`src/utils/matchmaking.ts`) uses a multi-factor scoring system to suggest ideal teammates. It prioritizes:
1. **Skill Compatibility (40%)**: Identifies overlapping technical context or complementary tech stacks.
2. **Role Complementarity (25%)**: Prioritizes filling missing roles (e.g., matching a Frontend Dev with a Backend Dev).
3. **Project Interest Similarity (20%)**: Aligns participants based on shared vertical interests (e.g., AI, UX, Data).
4. **Experience Compatibility (10%)**: Matches participants with similar experience levels or potential mentor/mentee dynamics.

### Deterministic Leaderboard Ranking
The leaderboard (`src/utils/leaderboard.ts`) employs a deterministic sorting algorithm to prevent UI flickering during live updates. It ranks teams by:
1. Highest total score.
2. Highest percentage of judging completed.
3. Alphabetical fallback for absolute consistency.

---

## 🚀 How the Solution Works

1. **Onboarding**: Users arrive at the landing page and enter the interactive Role Selection phase.
2. **Workspace Generation**: Based on the selected role (Participant, Judge, Organizer), the `AppShell` dynamically constructs the navigation and dashboard views.
3. **The Participant Journey**: Participants use the Matchmaking portal to find teams using the smart algorithm, view live announcements, and submit projects.
4. **The Judge Journey**: Judges receive a secure queue of assigned projects, evaluate them using structured rubrics, and submit scores.
5. **The Organizer Journey**: Organizers monitor live analytics (engagement, remaining time, system status) and broadcast announcements to the real-time feed.

---

## 🛡️ Security & Quality Measures

To satisfy strict enterprise and hackathon requirements, Eventos implements:

### Security
*   **XSS Prevention**: All simulated text inputs are passed through a custom `sanitizeText` utility (`src/utils/security.ts`) to escape dangerous characters before rendering.
*   **Role-Based Access Control (RBAC)**: Route guarding prevents Participants from accessing the Judging or Organizer analytics portals.
*   **Input Validation**: Strict schema validation ensures required fields (e.g., emails) are correctly formatted before processing.

### Code Quality & Efficiency
*   **Pure Functions**: Core logic (matchmaking, scoring, ranking, validation) is decoupled into pure, side-effect-free TypeScript functions in `src/utils/`, ensuring 100% testability.
*   **Component Modularity**: The UI is built using atomic design principles, separating layout shells, views, and reusable UI components (Buttons, Cards, Badges, Inputs).
*   **Tailwind Optimization**: Uses the modern Tailwind CSS v4 `@theme` directive for precise, zero-runtime variable management.

### Accessibility (a11y)
*   **Semantic HTML**: Proper use of `<header>`, `<main>`, `<nav>`, `<aside>`, and heading hierarchies.
*   **Keyboard Navigation**: All interactive elements (`<button>`, `<a>`, `<input>`) are fully focusable and usable via keyboard, with clear `:focus-visible` ring indicators.
*   **Contrast Ratios**: The "Obsidian Kinetic" dark theme adheres to WCAG AA contrast standards.

---

## 📝 Assumptions Made

*   **Mock Backend**: All state changes and data fetches are currently simulated via local state or mocked data structures to fulfill the Frontend Heavy SPA constraint.
*   **Authentication Flow**: Real OAuth/JWT authentication is bypassed in favor of a simulated `localStorage` role flag to demonstrate the RBAC UI logic seamlessly.
*   **Data Persistence**: Reloading the page may reset transient mock state, though the user role is persisted in local storage.

---

## 💻 Local Setup & Deployment Instructions

### Prerequisites
*   Node.js (v18 or higher)
*   npm or yarn

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Development
Start the local development server:
```bash
npm run dev
```

### Testing
Run the Vitest suite to validate the core logic algorithms:
```bash
npm run test
```

### Deployment (Vercel / GitHub Pages)
The project is optimized for instant deployment. Build the production assets:
```bash
npm run build
```
The output will be available in the `dist` directory, ready to be served by any static hosting provider.
