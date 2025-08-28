### College App (React + Vite)

A simple, fast, and modern college website built with React and Vite. It showcases home, courses, faculty, campuses, and achievements pages using reusable UI components, React Router for navigation, and Tailwind CSS utilities for styling.

---

### Features
- **Home, Courses, Faculty, Campuses, Achievements pages** with a dedicated **Achievement Details** view
- **Reusable UI components**: cards, image slider, score cards, layout (navbar/footer)
- **Client-side routing** with `react-router-dom`
- **Tailwind CSS v4** utilities via `@tailwindcss/vite`
- **Iconography** via `lucide-react` and `react-icons`

---

### Tech Stack
- **Frontend**: React 19, Vite 6
- **Routing**: `react-router-dom`
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite` plugin)
- **UI/Media**: `react-slideshow-image`, `lucide-react`, `react-icons`
- **Linting**: ESLint 9

---

### Getting Started
Prerequisites:
- Node.js 18+ and npm

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Build and preview production build:

```bash
npm run build
npm run preview
```

Run linter:

```bash
npm run lint
```

---

### Available Scripts
- `npm run dev`: Start Vite dev server
- `npm run build`: Create production build
- `npm run preview`: Preview the production build locally
- `npm run lint`: Run ESLint

---

### Project Structure
```text
.
├─ eslint.config.js
├─ index.html
├─ index.css
├─ package.json
├─ vite.config.js
├─ public/
└─ src/
   ├─ App.jsx
   ├─ main.jsx
   ├─ assets/
   │  ├─ face.jpeg
   │  ├─ logo.png
   │  └─ logo2.png
   ├─ components/
   │  ├─ layout/
   │  │  ├─ Footer.jsx
   │  │  ├─ Navbar.jsx
   │  │  └─ PageLayout.jsx
   │  ├─ pages/
   │  │  ├─ Home.jsx
   │  │  ├─ Courses.jsx
   │  │  ├─ Faculty.jsx
   │  │  ├─ Campuses.jsx
   │  │  ├─ Achievements.jsx
   │  │  └─ AchievementDetails.jsx
   │  └─ ui/
   │     ├─ CourseCard.jsx
   │     ├─ FacultyCard.jsx
   │     ├─ ImageSlider.jsx
   │     └─ ScoreCard.jsx
   ├─ constants/
   │  └─ colors.js
   ├─ data/
   │  ├─ homeData.js
   │  ├─ courseData.js
   │  ├─ facultyData.js
   │  ├─ campusData.js
   │  ├─ achievementsData.js
   │  └─ detailedAchievements.js
   └─ utils/
      └─ helpers.js
```

---

### Routing
Pages under `src/components/pages/` are wired via `react-router-dom` (see `App.jsx`). Typical routes include:
- `/` → `Home`
- `/courses` → `Courses`
- `/faculty` → `Faculty`
- `/campuses` → `Campuses`
- `/achievements` → `Achievements`
- `/achievements/:id` → `AchievementDetails`

---

### Styling
- Tailwind CSS v4 is enabled through the `@tailwindcss/vite` plugin in `vite.config.js`.
- Global styles are in `index.css`. Use Tailwind utility classes directly in JSX.

---

### Data
Static content is organized in `src/data/`. Update or extend these `.js` files to modify displayed content:
- `homeData.js`, `courseData.js`, `facultyData.js`, `campusData.js`, `achievementsData.js`, `detailedAchievements.js`

---

### Build & Deploy
Create a production build with `npm run build`. The output in `dist/` can be served by any static host (e.g., Netlify, Vercel, GitHub Pages, Nginx). Test locally with `npm run preview`.

---

### Contributing
Issues and PRs are welcome. Please run `npm run lint` before submitting changes.

---

### License
Add a license for your project (e.g., MIT) in a `LICENSE` file.
