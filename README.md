# 🚀 SyncSpace

## Real-Time Collaborative Whiteboard & Code Editor

<p align="center">
  <strong>Collaborate • Code • Design • Connect — In Real Time</strong>
</p>

<p align="center">
  A real-time collaborative engineering workspace that combines an interactive
  whiteboard and collaborative code editor into one unified platform.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Node.js-22+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-5-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/Socket.IO-4-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.IO">
  <img src="https://img.shields.io/badge/Yjs-CRDT-FF6B35?style=for-the-badge" alt="Yjs">
  <img src="https://img.shields.io/badge/MongoDB-8-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT">
</p>

---

## 📑 Table of Contents

* [🌐 About](#-about)
* [❗ Problem Statement](#-problem-statement)
* [💡 Solution](#-solution)
* [🎯 Use Cases](#-use-cases)
* [✨ Key Features](#-key-features)
* [📸 Project Screenshots](#-project-screenshots)
* [🔄 How It Works](#-how-it-works)
* [🏗️ System Architecture](#️-system-architecture)
* [🧰 Tech Stack](#-tech-stack)
* [🧬 CRDT Architecture](#-crdt-architecture)
* [🔐 Authentication](#-authentication)
* [💾 Persistence](#-persistence)
* [🎬 Session Replay](#-session-replay)
* [📂 Project Structure](#-project-structure)
* [🚀 Installation](#-installation)
* [🧪 Testing](#-testing)
* [📈 Development Journey](#-development-journey)
* [👥 Team Members](#-team-members)
* [🔮 Future Enhancements](#-future-enhancements)
* [📜 License](#-license)

---

# 🌐 About

**SyncSpace** is a real-time collaborative engineering workspace designed for modern development teams, technical interviews, system-design discussions, pair programming, and remote collaboration.

The platform combines:

* 🎨 Collaborative Whiteboard
* 💻 Collaborative Code Editor
* ⚡ Real-Time Communication
* 🧬 Yjs CRDT Synchronization
* 👥 Live User Awareness
* 🏠 Room-Based Collaboration
* 🔐 Secure Authentication
* 💾 Persistent Data Storage
* 🎬 Session Replay

Multiple users can join the same room and simultaneously work on diagrams and source code while seeing changes in real time.

---

# ❗ Problem Statement

Traditional web applications primarily follow a request/response model.

Building a system where multiple users can simultaneously:

* Draw on the same canvas
* Edit the same code document
* See changes instantly
* Avoid race conditions
* Prevent accidental overwrites
* Maintain consistent shared state

requires advanced real-time synchronization mechanisms.

A simple last-write-wins approach can cause updates to be lost when multiple users modify the same content at nearly the same time.

SyncSpace addresses this problem using **WebSockets, Socket.IO, and Yjs CRDT technology**.

---

# 💡 Solution

SyncSpace combines real-time communication with conflict-free synchronization.

```text
                    SyncSpace
                        │
        ┌───────────────┴────────────────┐
        │                                │
        ▼                                ▼
  🎨 Whiteboard                    💻 Code Editor
        │                                │
        │                                │
        └───────────────┬────────────────┘
                        │
                        ▼
                  🧬 Yjs CRDT
                        │
                        ▼
                 📡 Socket.IO
                        │
                        ▼
                Node.js + Express
                        │
                        ▼
                    MongoDB
```

Yjs maintains shared collaborative document state, while Socket.IO provides low-latency bidirectional communication between connected clients.

---

# 🎯 Use Cases

## 👨‍💻 Technical Interviews

An interviewer can discuss system architecture on the whiteboard while a candidate writes code simultaneously.

## 🏗️ System Design

Teams can collaboratively create:

* System architecture diagrams
* Database designs
* API workflows
* Microservice diagrams
* Data-flow diagrams

## 👥 Distributed Engineering Teams

Remote developers can collaborate on technical designs and implementation.

## 💻 Pair Programming

Multiple developers can edit the same code document simultaneously.

## 🎓 Remote Workshops

Teachers and students can collaboratively solve programming and system-design problems.

## 🧠 Brainstorming

Teams can visually explore ideas using the shared collaborative whiteboard.

---

# ✨ Key Features

## 🎨 Collaborative Whiteboard

The interactive whiteboard supports:

* ✏️ Pencil
* 🧽 Eraser
* ─ Line
* ▭ Rectangle
* ◯ Circle
* 📝 Text
* ↶ Undo
* ↷ Redo
* 🗑️ Clear Canvas
* 📥 PNG Download
* ⚡ Real-Time Synchronization

Changes made by one user are immediately synchronized with other users in the same room.

---

## 💻 Collaborative Code Editor

SyncSpace integrates **Monaco Editor**, the editor technology behind Visual Studio Code.

Features include:

* Syntax highlighting
* Real-time code editing
* Concurrent editing
* Yjs shared document
* Remote cursor awareness
* User presence
* Conflict-free synchronization

---

## 🧬 Yjs CRDT Synchronization

SyncSpace uses **Yjs Conflict-free Replicated Data Types (CRDTs)** to handle concurrent document editing.

```text
             ┌──────────────────┐
 User A ────►│                  │
             │    Yjs CRDT      │
 User B ────►│                  │
             │                  │
             └────────┬─────────┘
                      │
                      ▼
             Shared Consistent State
```

Concurrent updates are merged into a consistent shared state instead of simply overwriting previous changes.

---

# 📸 Project Screenshots

> **Add your actual SyncSpace screenshots to `docs/screenshots/` and use the filenames below.**

## 🏠 Dashboard

![SyncSpace Dashboard](docs/screenshots/dashboard.png)

---

## 🎨 Collaborative Whiteboard

![SyncSpace Whiteboard](docs/screenshots/whiteboard.png)

---

## 💻 Collaborative Code Editor

![SyncSpace Code Editor](docs/screenshots/code-editor.png)

---

## 👥 Real-Time Collaboration

![Real-Time Collaboration](docs/screenshots/collaboration.png)

---

## 🔐 Login / Authentication

![SyncSpace Login](docs/screenshots/login.png)

---

## 🏠 Collaborative Room

![SyncSpace Room](docs/screenshots/room.png)

---

### 📁 Recommended Screenshot Folder

Create this structure inside your project:

```text
SyncSpace-RealTime-Collaboration/
│
├── BACKEND/
├── FRONTEND/
├── docs/
│   └── screenshots/
│       ├── dashboard.png
│       ├── login.png
│       ├── room.png
│       ├── whiteboard.png
│       ├── code-editor.png
│       └── collaboration.png
│
├── .gitignore
└── README.md
```

Then GitHub will automatically render the screenshots in the README.

---

# ⚡ Real-Time Communication

SyncSpace uses **Socket.IO** for low-latency bidirectional communication.

Socket communication supports:

* Room events
* Whiteboard synchronization
* Yjs synchronization
* User presence
* Awareness updates
* Join / leave events
* Connection status
* Remote cursor updates

```text
Client A
   │
   │ WebSocket
   ▼
┌────────────────┐
│   Socket.IO    │
│     Server     │
└───────┬────────┘
        │
        ├──────────────► Client B
        │
        └──────────────► Client C
```

---

# 👥 Live User Awareness

Users can see other collaborators through:

* 👤 User names
* 🎨 User colors
* 🟢 Online status
* 🖱️ Remote cursor positions
* 🔔 Join notifications
* 🔔 Leave notifications
* 👥 Active user indicators

---

# 🏠 Room-Based Collaboration

Every collaborative session operates inside an isolated room.

```text
                    SyncSpace
                        │
              ┌─────────┴─────────┐
              │                   │
           Room A              Room B
              │                   │
        ┌─────┼─────┐         ┌───┴───┐
        │     │     │         │       │
      User  User  User      User    User
```

Users inside one room receive collaboration updates from their own session without mixing data from other rooms.

---

# 🔐 Authentication

SyncSpace implements secure authentication using:

* JWT authentication
* bcrypt password hashing
* Protected REST APIs
* Authenticated Socket.IO connections
* Room membership authorization

Authentication flow:

```text
              User
                │
                ▼
          Register / Login
                │
                ▼
        Backend Validation
                │
                ▼
             JWT Token
                │
        ┌───────┴────────┐
        │                │
        ▼                ▼
    REST APIs        Socket.IO
        │                │
        ▼                ▼
  Protected       JWT Verification
   Routes                │
                        ▼
                 Room Validation
                        │
                        ▼
                  Collaboration
```

---

# 💾 Persistence

MongoDB is used for persistent application data.

The system stores information related to:

* 👤 Users
* 🏠 Rooms
* 🎨 Whiteboards
* 💻 Code documents
* 🧬 Collaborative document state
* 📜 Session history

Persistence allows important application data to survive server restarts.

---

# 🎬 Session Replay

SyncSpace includes session history and replay capabilities.

Replay functionality supports:

* 🎨 Whiteboard evolution
* 💻 Code changes
* 👥 Collaboration history
* ⏱️ Timeline-based navigation
* 📊 Interview/session review

```text
00:00 ────────────────●──────────────── 05:30
                       ▲
                     Current

          ◀ Previous    ▶ Play    Next ▶
```

---

# 🔄 How It Works

## 🎨 Whiteboard Collaboration

```text
User A Draws
      │
      ▼
HTML Canvas
      │
      ▼
Drawing Event
      │
      ▼
Socket.IO
      │
      ▼
Backend Room
      │
      ├───────────────┐
      ▼               ▼
   User B           User C
      │               │
      ▼               ▼
Canvas Update     Canvas Update
```

## 💻 Code Collaboration

```text
User A
  │
  ▼
Monaco Editor
  │
  ▼
Y.Doc
  │
  ▼
Yjs Update
  │
  ▼
Socket.IO
  │
  ▼
Node.js Backend
  │
  ▼
Other Clients
  │
  ▼
Yjs Merge
  │
  ▼
Monaco Editor
```

---

# 🏗️ System Architecture

```text
                         ┌─────────────────────┐
                         │       CLIENTS       │
                         │                     │
                         │    React + Vite     │
                         └──────────┬──────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
             🎨 WHITEBOARD                     💻 CODE EDITOR
                    │                               │
                    └───────────────┬───────────────┘
                                    │
                                    ▼
                            ┌────────────────┐
                            │    Socket.IO   │
                            │   WebSockets   │
                            └───────┬────────┘
                                    │
                                    ▼
                         ┌────────────────────┐
                         │ Node.js + Express  │
                         │                    │
                         │ Authentication     │
                         │ Room Management    │
                         │ Socket Handlers    │
                         │ Yjs Synchronization│
                         └─────────┬──────────┘
                                   │
                       ┌───────────┴───────────┐
                       │                       │
                       ▼                       ▼
                 ┌──────────┐             ┌──────────┐
                 │   Yjs    │             │ MongoDB  │
                 │   CRDT   │             │          │
                 └──────────┘             └──────────┘
```

---

# 🧰 Tech Stack

| Layer                | Technology             |
| -------------------- | ---------------------- |
| 🎨 Frontend          | React 19               |
| ⚡ Build Tool         | Vite                   |
| 🖌️ Whiteboard       | HTML5 Canvas           |
| 💻 Code Editor       | Monaco Editor          |
| 🔄 Synchronization   | Yjs CRDT               |
| 📡 Real-Time         | Socket.IO / WebSockets |
| 🖥️ Backend          | Node.js                |
| 🌐 API               | Express.js             |
| 🗄️ Database         | MongoDB                |
| 🧩 ODM               | Mongoose               |
| 🔐 Authentication    | JWT                    |
| 🔑 Password Security | bcryptjs               |
| 🧭 Routing           | React Router           |
| 🎨 Styling           | Tailwind CSS           |
| 🖼️ Icons            | Lucide React           |

---

# 🧬 CRDT Architecture

SyncSpace uses a Yjs shared document to maintain collaborative code state.

```text
                         Y.Doc
                           │
               ┌───────────┼───────────┐
               │           │           │
               ▼           ▼           ▼
            Y.Text       Y.Map       Y.Array
               │
               ▼
         Monaco Editor
```

When multiple users edit simultaneously:

```text
                  ┌──────────────┐
User A ──────────►│              │
                  │   Yjs CRDT   │
User B ──────────►│              │
                  └──────┬───────┘
                         │
                         ▼
                Shared Consistent State
```

---

# 📡 Socket.IO Events

## Room Events

```text
room:join
room:leave
room:users
room:state
```

## Whiteboard Events

```text
whiteboard:join
whiteboard:startDrawing
whiteboard:drawing
whiteboard:endDrawing
whiteboard:clear
```

## Editor Events

```text
joinEditor
yjsSync
yjsAwareness
```

---

# 📂 Project Structure

```text
SyncSpace-RealTime-Collaboration/
│
├── BACKEND/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── sockets/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   │
│   └── package.json
│
├── FRONTEND/
│   ├── src/
│   │   ├── api/
│   │   ├── Components/
│   │   │   ├── Login/
│   │   │   ├── Signup/
│   │   │   ├── Workspace/
│   │   │   ├── whiteboard/
│   │   │   └── UI/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── docs/
│   └── screenshots/
│       ├── dashboard.png
│       ├── login.png
│       ├── room.png
│       ├── whiteboard.png
│       ├── code-editor.png
│       └── collaboration.png
│
├── .gitignore
└── README.md
```

---

# 🚀 Installation

## Prerequisites

Install:

* Node.js 22+
* npm
* MongoDB
* Git

---

## 1️⃣ Clone Repository

```bash
git clone https://github.com/anuvardhini25/SyncSpace-RealTime-Collaboration.git
cd SyncSpace-RealTime-Collaboration
```

---

## 2️⃣ Backend Setup

```bash
cd BACKEND
npm install
```

Create a `.env` file:

```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/syncspace
JWT_SECRET=your_secure_jwt_secret
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

Backend:

```text
http://localhost:5001
```

---

## 3️⃣ Frontend Setup

Open another terminal:

```bash
cd FRONTEND
npm install
```

Start the frontend:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🧪 Testing

## Test 1 — Room Collaboration

Open SyncSpace in two browser tabs and join the same room.

```text
Tab A ─────────┐
               ├── Same Room
Tab B ─────────┘
```

---

## Test 2 — Whiteboard

Draw a shape or freehand stroke in Tab A.

Expected result:

```text
Tab A
  │
  ▼
 Draw
  │
  ▼
Socket.IO
  │
  ▼
Tab B
  │
  ▼
Drawing Appears
```

---

## Test 3 — Code Editor

Type code in Tab A.

Expected result:

```text
Tab A
  │
  ▼
Monaco
  │
  ▼
Yjs
  │
  ▼
Socket.IO
  │
  ▼
Tab B
  │
  ▼
Code Synchronized
```

---

## Test 4 — Concurrent Editing

Both users edit the same document simultaneously.

Expected result:

```text
User A ──┐
         ├──► Yjs CRDT ──► Shared Consistent State
User B ──┘
```

---

# 📈 Development Journey

## Week 1 — Foundation ✅

* [x] React + Vite setup
* [x] Express backend
* [x] Socket.IO infrastructure
* [x] Room creation
* [x] Room joining
* [x] Split-screen workspace
* [x] Dashboard
* [x] Navigation

## Week 2 — Real-Time Collaboration ✅

* [x] Yjs CRDT integration
* [x] Socket.IO synchronization
* [x] Monaco Editor
* [x] Collaborative code editing
* [x] Whiteboard drawing
* [x] Remote cursor awareness
* [x] User presence
* [x] Real-time canvas synchronization

## Mid-Project Review ✅

* [x] Multi-client synchronization testing
* [x] Whiteboard synchronization testing
* [x] Remote cursor verification
* [x] User awareness verification

## Week 3 — Persistence ✅

* [x] MongoDB integration
* [x] Code persistence
* [x] Whiteboard persistence
* [x] Collaborative document persistence
* [x] Session recovery

## Week 4 — Security & Replay ✅

* [x] JWT authentication
* [x] Protected routes
* [x] Socket authentication
* [x] Room membership authorization
* [x] Session history
* [x] Whiteboard replay
* [x] Code replay
* [x] Replay timeline

## Final Review ✅

* [x] Real-time collaboration
* [x] Conflict-free synchronization
* [x] Whiteboard integration
* [x] Collaborative code editor
* [x] Authentication
* [x] Persistence
* [x] Session replay
* [x] Error handling
* [x] Reconnection handling
* [x] Integration testing

---

# 👥 Team Members

SyncSpace is developed as a collaborative team project.

| # | Team Member                     |
| - | ------------------------------- |
| 1 | **Anuvardhini T**               |
| 2 | **Tarun Singh**                 |
| 3 | **Shreya Kumari**               |
| 4 | **Chamarthi Venkatapathi Raju** |
| 5 | **M. Devi Akshya Priya**        |
| 6 | **Aman Panda**                  |

> Add the 7th team member here if your final team contains seven members.

---

# 🏆 Project Highlights

SyncSpace demonstrates practical implementation of:

| Area                      | Technology               |
| ------------------------- | ------------------------ |
| ⚡ Real-Time Communication | WebSockets / Socket.IO   |
| 🧬 Conflict Resolution    | Yjs CRDT                 |
| 🎨 Collaborative Drawing  | HTML5 Canvas             |
| 💻 Collaborative Coding   | Monaco Editor            |
| 🔐 Security               | JWT + bcrypt             |
| 🏠 Session Isolation      | Room-Based Architecture  |
| 💾 Data Persistence       | MongoDB                  |
| 👥 User Awareness         | Yjs Awareness + Presence |
| 🔄 State Synchronization  | Yjs + Socket.IO          |
| 🎬 Session Replay         | Replay Timeline          |

---

# 🔮 Future Enhancements

Possible future improvements include:

* 🎥 Video conferencing
* 🎙️ Voice communication
* 🖥️ Screen sharing
* 🤖 AI-powered interview assistant
* 🧠 AI code review
* 🏗️ AI architecture suggestions
* ▶️ Secure code execution
* 📊 Interview analytics
* 📝 Session reports
* 👥 Team management
* 🔑 Advanced role-based permissions
* ☁️ Cloud deployment
* 📈 Redis-based Socket.IO scaling
* 🐳 Docker support
* ☸️ Kubernetes deployment

---

# 📜 License

This project is developed for educational, academic, and demonstration purposes.

---

<p align="center">
  <strong>🚀 SyncSpace</strong>
</p>

<p align="center">
  Collaborate • Code • Design • Connect
</p>

<p align="center">
  <em>A real-time collaborative engineering workspace.</em>
</p>
