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

- [🌐 About](#-about)
- [❗ Problem Statement](#-problem-statement)
- [💡 Solution](#-solution)
- [🎯 Use Cases](#-use-cases)
- [✨ Key Features](#-key-features)
- [🔄 How It Works](#-how-it-works)
- [🏗️ System Architecture](#️-system-architecture)
- [🧰 Tech Stack](#-tech-stack)
- [🧬 CRDT Architecture](#-crdt-architecture)
- [🔐 Authentication](#-authentication)
- [💾 Persistence](#-persistence)
- [📂 Project Structure](#-project-structure)
- [🚀 Installation](#-installation)
- [🧪 Testing](#-testing)
- [📈 Development Roadmap](#-development-roadmap)
- [👥 Team Members](#-team-members)
- [🔮 Future Enhancements](#-future-enhancements)
- [📜 License](#-license)

---

# 🌐 About

**SyncSpace** is a real-time collaborative workspace designed for modern engineering teams.

It provides a shared environment where multiple users can simultaneously work on:

- 🎨 Whiteboard diagrams
- 💻 Source code
- 🏗️ System architecture
- 👥 Collaborative technical discussions
- 🧠 Problem-solving sessions

The platform uses **WebSockets and Yjs CRDT technology** to synchronize changes between connected users with minimal latency.

### Workspace Overview

```text
┌───────────────────────────────────────────────────────────────┐
│                         🚀 SyncSpace                          │
├──────────────────────────────┬────────────────────────────────┤
│                              │                                │
│       🎨 WHITEBOARD          │        💻 CODE EDITOR          │
│                              │                                │
│  ✏️ Draw diagrams            │  • Monaco Editor               │
│  ▭ Create shapes             │  • Syntax highlighting         │
│  📝 Add text                 │  • Yjs synchronization          │
│  🧽 Erase                    │  • Remote cursors               │
│  ↶ Undo / Redo               │  • Concurrent editing           │
│                              │                                │
└──────────────────────────────┴────────────────────────────────┘
```

Multiple users can join the same room and collaborate simultaneously.

---

# ❗ Problem Statement

Standard web applications operate mainly using a request/response model.

Building a system where multiple users can simultaneously:

- Draw on the same canvas
- Edit the same code document
- See changes instantly
- Avoid race conditions
- Prevent accidental overwrites
- Maintain a consistent shared state

requires advanced synchronization mechanisms.

A simple last-write-wins approach can cause updates to be lost when multiple users modify the same content at nearly the same time.

```text
User A ─────────────┐
                    │
                    ▼
                 Server
                    │
                    ▼
             Last Write Wins
                    │
                    ▼
              ❌ Lost Update
```

This becomes particularly difficult when two users modify the same line of code or draw simultaneously.

---

# 💡 Solution

SyncSpace combines real-time communication with conflict-free synchronization.

### Core Technologies

```text
React
  │
  ├── Interactive Whiteboard
  │
  └── Monaco Code Editor
          │
          ▼
       Yjs CRDT
          │
          ▼
     Socket.IO
          │
          ▼
   Node.js + Express
          │
          ▼
       MongoDB
```

Yjs maintains a shared document state while Socket.IO provides low-latency communication between connected clients.

This allows concurrent changes to be merged into a consistent state.

---

# 🎯 Use Cases

## 👨‍💻 Technical Interviews

An interviewer can discuss a system architecture on the whiteboard while a candidate writes code simultaneously.

## 🏗️ System Design

Teams can collaboratively create:

- System architecture diagrams
- Database designs
- API workflows
- Microservice diagrams
- Data-flow diagrams

## 👥 Distributed Engineering Teams

Remote developers can collaborate on technical designs and implementation from different locations.

## 💻 Pair Programming

Multiple developers can edit the same code document simultaneously.

## 🎓 Remote Workshops

Teachers and students can collaboratively solve programming and system-design problems.

## 🧠 Brainstorming

Teams can visually explore ideas using the shared collaborative whiteboard.

---

# ✨ Key Features

## 🎨 Collaborative Whiteboard

The whiteboard provides interactive drawing capabilities including:

- ✏️ Pencil
- 🧽 Eraser
- ─ Line
- ▭ Rectangle
- ◯ Circle
- 📝 Text
- ↶ Undo
- ↷ Redo
- 🗑️ Clear
- 📥 PNG Download
- ⚡ Real-time synchronization

When one user draws on the canvas, the drawing updates are transmitted to other users in the same room.

---

## 💻 Collaborative Code Editor

SyncSpace integrates **Monaco Editor**, the editor technology behind Visual Studio Code.

Features include:

- Syntax highlighting
- Real-time code editing
- Concurrent editing
- Yjs shared document
- Remote cursor awareness
- User presence
- Conflict-free synchronization

---

## 🧬 Yjs CRDT Synchronization

Yjs provides **Conflict-free Replicated Data Types (CRDTs)** for collaborative document editing.

Instead of simply replacing the entire document when an update arrives, concurrent updates can be merged into a consistent shared state.

```text
             ┌─────────────────┐
User A ─────►│                 │
             │    Yjs CRDT     │
User B ─────►│                 │
             │                 │
             └────────┬────────┘
                      │
                      ▼
             Consistent Document
```

This helps prevent accidental overwrites during simultaneous editing.

---

# ⚡ Real-Time Communication

SyncSpace uses **Socket.IO** for low-latency, bidirectional communication.

Socket communication supports:

- Room events
- Whiteboard synchronization
- Yjs synchronization
- User presence
- Awareness updates
- Join / leave events
- Connection status

```text
Client A
    │
    │ WebSocket
    ▼
┌──────────────┐
│   Socket.IO  │
│    Server    │
└──────┬───────┘
       │
       ├──────────────► Client B
       │
       └──────────────► Client C
```

---

# 👥 Live User Awareness

Users can see other collaborators through:

- 👤 User names
- 🎨 User colors
- 🟢 Online status
- 🖱️ Remote cursor positions
- 🔔 Join notifications
- 🔔 Leave notifications
- 👥 Active user indicators

---

# 🏠 Room-Based Collaboration

Every collaborative session operates inside an isolated room.

```text
                    SyncSpace
                       │
          ┌────────────┴────────────┐
          │                         │
       Room A                    Room B
          │                         │
     ┌────┼────┐               ┌────┴────┐
     │    │    │               │         │
   User  User User           User      User
```

Users inside one room receive collaboration updates from their own session without mixing data from other rooms.

---

# 🔐 Authentication

SyncSpace uses secure authentication mechanisms including:

- JWT authentication
- bcrypt password hashing
- Protected REST APIs
- Authenticated Socket.IO connections
- Room membership authorization

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
       ┌───────┴───────┐
       │               │
       ▼               ▼
   REST APIs       Socket.IO
       │               │
       ▼               ▼
 Protected        JWT Verification
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

The database can store information related to:

- 👤 Users
- 🏠 Rooms
- 🎨 Whiteboards
- 💻 Code documents
- 🧬 Collaborative document state
- 📜 Session history

Persistence allows important data to survive server restarts.

---

# 🎬 Session Replay

SyncSpace is designed to support session history and replay functionality.

Planned replay capabilities include:

- 🎨 Whiteboard evolution
- 💻 Code changes
- 👥 Collaboration history
- ⏱️ Timeline-based navigation
- 📊 Interview/session review

```text
00:00 ────────────────●──────────────── 05:30
                      ▲
                   Current

      ◀ Previous     ▶ Play     Next ▶
```

> 🚧 Session replay functionality is currently under development.

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

---

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
                    ┌──────────────┴──────────────┐
                    │                             │
                    ▼                             ▼
              ┌──────────┐                  ┌──────────┐
              │   Yjs    │                  │ MongoDB  │
              │   CRDT   │                  │          │
              └──────────┘                  └──────────┘
```

---

# 🧰 Tech Stack

| Layer | Technology |
|---|---|
| 🎨 Frontend | React 19 |
| ⚡ Build Tool | Vite |
| 🖌️ Whiteboard | HTML5 Canvas |
| 💻 Code Editor | Monaco Editor |
| 🔄 Synchronization | Yjs CRDT |
| 📡 Real-Time | Socket.IO / WebSockets |
| 🖥️ Backend | Node.js |
| 🌐 API | Express.js |
| 🗄️ Database | MongoDB |
| 🧩 ODM | Mongoose |
| 🔐 Authentication | JWT |
| 🔑 Password Security | bcryptjs |
| 🧭 Routing | React Router |
| 🎨 Styling | Tailwind CSS |
| 🖼️ Icons | Lucide React |

---

# 🧬 CRDT Architecture

SyncSpace uses a Yjs shared document to maintain collaborative code state.

```text
                         Y.Doc
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
           Y.Text        Y.Map        Y.Array
              │
              ▼
        Monaco Editor
```

When users edit simultaneously:

```text
                  ┌──────────────┐
User A ──────────►│              │
                  │   Yjs CRDT   │
                  │              │
User B ──────────►│              │
                  └──────┬───────┘
                         │
                         ▼
                 Shared Consistent
                      State
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
WHITEBOARD-main/
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
│   │   │   ├── UI/
│   │   │   └── ...
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── .gitignore
└── README.md
```

---

# 🚀 Installation

## Prerequisites

Install:

- Node.js 22+
- npm
- MongoDB
- Git

---

## 1️⃣ Clone Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd WHITEBOARD-main
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

Expected:

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

Expected:

```text
Tab A
  │
Monaco
  │
Yjs
  │
Socket.IO
  │
Tab B
  │
Code Synchronized
```

---

## Test 4 — Concurrent Editing

Both users edit the same document simultaneously.

Expected:

```text
User A ──┐
         ├──► Yjs CRDT ──► Shared Consistent State
User B ──┘
```

---

# 📈 Development Roadmap

## Week 1 — Foundation

- [x] React + Vite setup
- [x] Express backend
- [x] Socket.IO infrastructure
- [x] Room creation
- [x] Room joining
- [x] Split-screen workspace
- [x] Dashboard
- [x] Navigation

---

## Week 2 — Real-Time Collaboration

- [x] Yjs CRDT integration
- [x] Socket.IO synchronization
- [x] Monaco Editor
- [x] Collaborative code editing
- [x] Whiteboard drawing
- [x] Remote cursor awareness
- [x] User presence
- [x] Real-time canvas synchronization

---

## Week 3 — Persistence

- [x] MongoDB integration
- [x] Code persistence
- [x] Whiteboard persistence
- [ ] Yjs binary state persistence
- [ ] Complete session recovery

---

## Week 4 — Security & Replay

- [x] JWT authentication
- [x] Protected routes
- [x] Socket authentication
- [ ] Socket room-membership authorization
- [ ] Session history
- [ ] Whiteboard replay
- [ ] Code replay
- [ ] Replay timeline

---

## Final Review

- [ ] Replay polishing
- [ ] Connection-state improvements
- [ ] Error handling
- [ ] Reconnection handling
- [ ] Final integration testing
- [ ] Production deployment

> **Note:** Roadmap items should be marked complete only after implementation and testing.

---

# 👥 Team Members

SyncSpace is developed as a collaborative team project by:

| # | Team Member |
|---|---|
| 1 | **Anuvardhini T** |
| 2 | **Tarun Singh** |
| 3 | **Shreya Kumari** |
| 4 | **Chamarthi Venkatapathi Raju** |
| 5 | **M. Devi Akshya Priya** |
| 6 | **Aman Panda** |

### 🤝 Team Collaboration

```text
                    🚀 SYNCSpace TEAM
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
      Frontend          Backend         Real-Time
          │                │                │
          ▼                ▼                ▼
     React / UI       Node / Express    Socket.IO / Yjs
          │                │                │
          └────────────────┼────────────────┘
                           │
                           ▼
                      Integration
                           │
                           ▼
                    Final Platform
```

---

# 🔮 Future Enhancements

Future versions of SyncSpace can include:

- 🎥 Video conferencing
- 🎙️ Voice communication
- 🖥️ Screen sharing
- 🤖 AI-powered interview assistant
- 🧠 AI code review
- 🏗️ AI architecture suggestions
- ▶️ Secure code execution
- 📊 Interview analytics
- 📝 Session reports
- 👥 Team management
- 🔑 Role-based permissions
- ☁️ Cloud deployment
- 📈 Redis-based Socket.IO scaling
- 🐳 Docker support
- ☸️ Kubernetes deployment

---

# 🏆 Project Highlights

SyncSpace demonstrates practical implementation of:

| Area | Technology |
|---|---|
| ⚡ Real-Time Communication | WebSockets / Socket.IO |
| 🧬 Conflict Resolution | Yjs CRDT |
| 🎨 Collaborative Drawing | HTML5 Canvas |
| 💻 Collaborative Coding | Monaco Editor |
| 🔐 Security | JWT + bcrypt |
| 🏠 Session Isolation | Room-Based Architecture |
| 💾 Data Persistence | MongoDB |
| 👥 User Awareness | Yjs Awareness + Presence |
| 🔄 State Synchronization | Yjs + Socket.IO |

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
