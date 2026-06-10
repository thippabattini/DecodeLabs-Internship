Focus Board — Responsive Task Manager

Focus Board is a clean, modern, and highly responsive web-based task management application. Built from scratch with a strong focus on semantics, accessibility, and modern CSS techniques (such as CSS Grid, Flexbox, and Container Queries), it provides a clutter-free and accessible workspace to keep you organized.

Running Locally
Clone or download this repository.
Open 
index.html
 directly in any modern web browser.
Alternative: Serve the files using a local development server for hot-reloading:
VS Code: Install the Live Server extension and click Go Live.
2. Open [index.html](index.html) directly in any modern web browser.
3. *Alternative:* Serve the files using a local development server for hot-reloading:
   - **VS Code**: Install the **Live Server** extension and click **Go Live**.
   - **Python**: Run `python -m http.server 8000` in the directory.
   - **Node.js**: Run `npx live-server` in the directory.


Technical Breakdown
1. index.html
Defines the DOM structure, including a <template> element for rendering task list items dynamically. It handles accessibility attributes and outlines the shell containing the sidebar, main content area, and task input form.

2. styles.css
Declares the global design system tokens using CSS Variables (colors, typography, spacing, border radiuses, and transitions). Features a responsive design powered by:

CSS Grid for the overall layout.
Flexbox for alignment inside the header, task forms, and sidebar controls.
CSS Container Queries (@container task-card (min-width: 420px)) to adapt card layouts automatically as screen widths shift.
3. app.js
Contains the JavaScript logic for the app. Key duties include:

State Management: Keeps track of active filters, sidebar drawer state, and the array of task objects.
Local Storage Utilities: Reads and writes task data safely with try/catch exception blocks.
Render Loop: Implements a clean, state-driven rendering logic using modern APIs (replaceChildren and <template> cloning) to prevent XSS vulnerability injection while maintaining high performance.
Event Listeners: Handles form submissions, buttons clicks, resizing triggers, and keyboard events (like hitting the Escape key to close the mobile menu).

📁 Project Structure
The project is structured simply and cleanly as a vanilla frontend application:
Task 1/
├── index.html     # Semantic structure and HTML template for tasks
├── styles.css     # CSS Custom Properties, layout design, responsive rules, container queries
└── app.js         # JavaScript application state, rendering logic, localStorage synchronization

✨ Features
📝 Task Management: Create tasks with validation limits (up to 200 characters), toggle completion states, and delete tasks instantly.
🔄 State Persistence: Uses browser localStorage to save your task list and completion states automatically across page reloads.
📊 Progress Tracker: An interactive, SVG-based circular progress ring visualizes your completion rate in real-time.
🔍 Dynamic Filtering: Filter tasks by All, Active, or Completed statuses, each with live badge counts showing how many tasks fall under that category.
🧼 Bulk Cleanup: Easily clear all completed tasks with the click of a button.
📱 Responsive & Mobile-First: Features a collapsible sidebar/drawer on mobile viewports (< 768px) controlled via a responsive hamburger menu, and a clean two-column layout on larger tablet and desktop screens.
🧩 Container Queries: Employs CSS container queries to let individual task cards dynamically restructure their layout based on their parent container's width, rather than the viewport size.

♿ Accessibility (a11y) & Best Practices
Focus Board was designed with modern accessibility guidelines in mind:

Semantic HTML: Built using appropriate landmark elements (<header>, <aside>, <main>, <footer>, <section>) and interactive controls.
Skip Link: Includes a hidden-by-default "Skip to main content" link for keyboard/screen-reader users.
Screen Reader Friendly: Uses .sr-only utility classes to hide visual-only elements and provides appropriate labeling (e.g., aria-expanded and aria-controls for the mobile navigation drawer).
Reduced Motion: Responsive styling adapts transitions to respect system-level user preferences (prefers-reduced-motion: reduce).
Focus Indicators: Clear focus outlines are visible on all interactive elements.

🛠️ Built With
HTML5: Semantic tags, validation, templates.
CSS3: Variables, Grid, Flexbox, Media Queries, Container Queries.
Vanilla JavaScript: Modern ES6+ syntax, LocalStorage API, dynamic DOM manipulation.






