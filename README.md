# My To-Do App 📝
**Web Development Internship — Level 2 Project**
Built by **Chetali Kumbhare**

---

## About the Project

This is a simple but fully-featured To-Do web application built as part of my Level 2 web development internship. I built it using only HTML, CSS, and vanilla JavaScript — no frameworks, no libraries.

The goal was to practice DOM manipulation, localStorage, event listeners, and writing clean, readable code.

---

## Folder Structure

```
todo-app/
│
├── index.html       → Page structure and markup
├── style.css        → All styles and responsive layout
├── script.js        → All JavaScript logic
└── README.md        → This file
```

---

## Features

### Core
- Add tasks via input field or pressing Enter
- Mark tasks as complete (toggleable)
- Edit task text in-place
- Delete tasks with a confirmation modal
- Task counters for pending and completed
- Empty state messages when lists are empty

### Bonus
- **localStorage** — tasks persist on page refresh
- **Timestamps** — shows when each task was created and completed
- **Filter buttons** — view All / Pending / Completed tasks
- **Search** — live search filters tasks as you type
- **Motivational quote** — random quote shown in the header each time

---

## JavaScript Logic Explained

### Data Model
Each task is a plain JavaScript object:
```js
{
  id:          "unique string",
  text:        "Task description",
  done:        false,
  createdAt:   1719123456789,   // timestamp (milliseconds)
  completedAt: null             // filled in when marked done
}
```

All tasks live in an array called `tasks`. This array is the "source of truth."

### How Rendering Works
The `renderTasks()` function is the heart of the app. Every time something changes (add, complete, edit, delete, filter, search), we:
1. Clear both list elements in the DOM
2. Filter the `tasks` array based on the active filter + search
3. Loop through and create new `<li>` elements for each task
4. Append them to the correct list

This "clear and rebuild" approach is simple and easy to understand.

### localStorage
Two small helper functions handle persistence:
- `saveTasksToStorage()` — converts the array to JSON and saves it
- `loadTasksFromStorage()` — reads JSON from storage and parses it back

Called after every change, and once at startup.

### Event Flow
1. User types in input → presses Enter or clicks "Add Task"
2. `addTask()` runs → creates a task object → adds to `tasks` array
3. `saveTasksToStorage()` saves it
4. `renderTasks()` redraws the UI

---

## How to Run

No build step needed. Just open `index.html` in any browser.

If you want to run it locally with live-reload:
```bash
# Using VS Code Live Server extension, or:
npx serve .
```

---

## Design Decisions

- **Color palette** — warm neutrals with an earthy green accent. No neon, no dark mode forced on you.
- **Typography** — system font stack. Loads fast, looks native.
- **No glassmorphism** — kept it clean and practical.
- **Soft shadows** — used `box-shadow` to give cards depth without being heavy.
- **Mobile-first** — layout collapses cleanly on small screens.

---

## Future Improvement Ideas

1. **Due dates** — Let users set a deadline for each task
2. **Priority levels** — High / Medium / Low with color tags
3. **Drag to reorder** — Reorder tasks by dragging them
4. **Categories / Tags** — Group tasks by project or context
5. **Dark mode** — Toggle with CSS variables
6. **Export to CSV** — Download your task list
7. **Keyboard shortcuts** — Power user shortcuts (e.g. `Ctrl+Enter` to add)
8. **Task notes** — Expandable description field per task
9. **Progress bar** — Visual % complete across all tasks
10. **Backend sync** — Connect to a real database so tasks sync across devices

---

## What I Learned

- How to manage app state in a plain JS array
- The "render from state" pattern (similar to what React does, but manual)
- Working with `localStorage` for persistence
- Building reusable DOM creation functions
- Handling modals, confirmation dialogs, and inline editing
- Writing CSS that works on both desktop and mobile

---

*This project was built as part of a Level 2 Web Development Internship.*
*All code written by hand — no generators, no copy-paste from templates.*
