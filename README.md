# ClassBridge

> An AI Academic Assistant that turns fragmented school announcements into one simple, actionable task view.

---

## About the Project

ClassBridge automates the messy information-gathering phase of student life. Instead of manually copying deadlines from Messenger group chats, LMS announcements, screenshots, and PDFs, students can upload a screenshot or paste raw text and let the app do the work.

The system simulates an AI extraction process that identifies deadlines, extracts subject names, and organizes tasks into a clean, prioritized dashboard. It features an intuitive upload interface, a processing state, a "Review & Confirm" screen for error prevention, and a main prioritized dashboard.

### The Problem It Solves

Standard apps like Notes and Google Calendar fail students because they are *manual* tools — they assume you already have complete, organized information. ClassBridge targets the **pre-organization phase**: it finds tasks hidden in scattered messages rather than just storing tasks you already know about.

---

## HCI Principles Applied

| Principle | Implementation |
|---|---|
| **Error Prevention** | A "Review & Confirm" step gives users final say before AI-extracted data enters the system |
| **Feedback** | Scanning animations and processing text confirm the system received the user's action |
| **Cognitive Load Reduction** *(Miller's Law)* | The dashboard chunks information to prevent mental overload |
| **Accessibility** *(WCAG 2.1 AA)* | High-contrast text; priority indicators use both icons and labels, not color alone |

---

## Tech Stack

- **Framework:** React.js + Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Deployment:** GitHub Pages or Vercel

---

## Getting Started

### Prerequisites

* Node.js
* npm (comes with Node.js)
* Git

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/yourusername/classbridge.git
   cd classbridge
```

2. **Install Client Dependencies**
```bash
   cd client
   npm install
```

3. **Install Server Dependencies**
```bash
   cd ../server
   npm install
```
4. **Start the Development Servers**

*Client:*
```bash
   cd client
   npm run dev
```

*Server:*
```bash
   cd server
   node index.js
```

5. Open your browser and navigate to `http://localhost:5173`.

---

## Project Structure
classbridge/
├── client/                 # React frontend
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # UI Components (Dashboard, Upload, etc.)
│   │   ├── App.jsx         # Main layout & state machine
│   │   └── main.jsx        # React entry point
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                 # Node.js backend
│   ├── index.js            # Server entry point
│   └── package.json
├── .gitignore
└── README.md
---

## Team

**Leighmarie Abigail Vicente** — Full Stack Developer / UI/UX Designer

Responsibilities: End-to-end development, HCI research application, UI prototyping, and front-end implementation.