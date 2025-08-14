## InkWell — Local‑first Markdown Blog

InkWell is a client‑side blogging app for creating, reading, editing, and deleting posts with images — all data lives in LocalStorage. No backend required. The UI embraces a hand‑drawn, vintage aesthetic with smooth motion.

### Features

- **Posts CRUD**: create, edit, delete
- **Content formats**: saves HTML from a lightweight WYSIWYG editor; falls back to simple Markdown
- **Images**: insert by URL or upload (stored as base64 data URLs)
- **Drafts**: autosave to LocalStorage while editing
- **Slugs**: generated and de‑duplicated; posts can be opened by slug or id
- **Auth gate**: simple username “login” stored locally
- **Routes**: list, single post view, new, edit
- **Toasts & dialogs**: inline feedback and confirm delete
- **Animations**: page transitions and ambient dust particles
- **Accessibility**: keyboard‑dismissible modals, labeled controls, focus rings

### Tech Stack

- React 19 + Vite 7
- React Router DOM 7
- Tailwind CSS v4 with custom utilities
- shadcn‑style primitives: `Button`, `Input`, `Card`
- Framer Motion (transitions), GSAP (background particles)
- `uuid` (ids), LocalStorage (persistence)
- `lucide-react`, Radix `Slot`, `class-variance-authority`, `tailwind-merge`

### Getting Started

Prereqs: Node 18+ and npm.

1. Install dependencies

```
npm install
```

2. Start dev server

```
npm run dev
```

Open the printed URL (usually `http://localhost:5173`).

3. Build for production

```
npm run build
```

4. Preview the production build

```
npm run preview
```

### Project Structure

```
src/
  components/
    ui/              # Button, Input, Card, Toast, ConfirmDialog
    motion/          # PageTransition, VintageBackdrop, DustParticles
    illustrations/   # Inline SVGs (e.g., InkIllustration)
    MarkdownRenderer.jsx
  pages/             # Landing, Home, PostsList, PostView, PostForm
  routes/            # RequireAuth
  state/             # AuthContext, PostsContext, postsStorage
  lib/               # utils (cn)
  index.css          # Tailwind theme + custom utilities
```

### Routing

- `/` → Landing (username login)
- `/app` → Home (requires auth)
- `/app/posts` → Posts list
- `/app/post/:slugOrId` → Single post view
- `/app/new` → Create post
- `/app/edit/:id` → Edit post

### Data Model

Post shape stored in LocalStorage (`inkwell_posts`):

```
{
  id: string,
  title: string,
  content: string,      // HTML produced by the editor or Markdown text
  author: string,
  slug: string,
  createdAt: ISOString,
  updatedAt: ISOString
}
```

### Architecture Notes

- **Auth**: `AuthContext` stores `currentUser` in LocalStorage (`inkwell_user`).
- **Posts**: `postsStorage.js` handles CRUD, slug generation and uniqueness.
- **State**: `PostsProvider` exposes posts and helpers via context.
- **Editor**: simple contentEditable with a minimal toolbar using `document.execCommand`; images can be inserted by URL or uploaded (base64). The viewer renders raw HTML when present, otherwise a lightweight Markdown renderer.
- **UI**: Tailwind v4 theme with custom utilities (paper texture, vignette, noise, sketch borders, scribble shadow).

### Accessibility & UX

- Keyboard‑dismissible overlays (Esc / outside click)
- Visible focus styles; labeled inputs and buttons with `aria-label`s
- Mobile‑first responsive layout

### Scripts

- `npm run dev` — start Vite dev server
- `npm run build` — build production bundle
- `npm run preview` — preview the prod build
- `npm run lint` — run ESLint
