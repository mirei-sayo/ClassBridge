# ClassBridge

> An AI Academic Assistant that turns fragmented school announcements into one simple, actionable task view.

---

## About the Project

ClassBridge automates the messy information-gathering phase of student life. Instead of manually copying deadlines from Messenger group chats, LMS announcements, screenshots, and PDFs, students can upload a screenshot or paste raw text and let the app do the work.

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
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Authentication
- **Deployment:** Vercel

---

## Getting Started

### Prerequisites

* Node.js
* npm (comes with Node.js)
* Git

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/mirei-sayo/ClassBridge.git
   cd ClassBridge
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

5. After running `npm run dev`, Vite will display a local URL in your terminal (e.g. `http://localhost:5173`). Open that URL in your browser. The port number may vary depending on your machine.

---

## Project Structure

```text
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
```
---

## Team

**Leighmarie Abigail Vicente** — Full Stack Developer / UI/UX Designer

Responsibilities: End-to-end development, HCI research application, UI prototyping, and front-end implementation.