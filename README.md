````markdown
# 🚀 SyncSpace

## Real-Time Collaborative Whiteboard & Code Editor

<p align="center">
  <b>Collaborate • Code • Design • Connect — In Real Time</b>
</p>

<p align="center">
  SyncSpace is a real-time collaborative engineering workspace that combines
  an interactive whiteboard and a collaborative code editor into one unified platform.
</p>

<p align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-5-000000?style=for-the-badge&logo=express&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Yjs](https://img.shields.io/badge/Yjs-CRDT-FF6B35?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

</p>

---

## 📑 Table of Contents

- [About](#-about)
- [Problem Statement](#-problem-statement)
- [Solution](#-solution)
- [Use Cases](#-use-cases)
- [Key Features](#-key-features)
- [How It Works](#-how-it-works)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [CRDT Architecture](#-crdt-architecture)
- [Authentication](#-authentication)
- [Persistence](#-persistence)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [Testing](#-testing)
- [Development Roadmap](#-development-roadmap)
- [Team Members](#-team-members)
- [Future Enhancements](#-future-enhancements)
- [License](#-license)

---

# 🌐 About

**SyncSpace** is a real-time collaborative workspace designed for:

- Technical interviews
- Pair programming
- System design discussions
- Distributed engineering teams
- Remote workshops
- Collaborative brainstorming
- Architecture planning

The platform provides a split-screen collaborative environment where users can work on a whiteboard and code editor simultaneously.

```text
┌──────────────────────────────────────────────────────────────┐
│                         SYNCSpace                             │
├─────────────────────────────┬────────────────────────────────┤
│                             │                                │
│       🎨 WHITEBOARD         │        💻 CODE EDITOR          │
│                             │                                │
│  • Draw diagrams            │  • Write code                  │
│  • Create shapes            │  • Monaco Editor               │
│  • Add text                 │  • Yjs CRDT                    │
│  • Erase                    │  • Remote cursors              │
│  • Undo / Redo              │  • Real-time editing            │
│                             │                                │
└─────────────────────────────┴────────────────────────────────┘
````

Multiple users can work inside the same room while their actions are synchronized in real time.

---

# ❗ Problem Statement

Traditional web applications mainly follow a request/response model.

Building a system where multiple users can simultaneously:

* Draw on the same canvas
* Edit the same code document
* See changes instantly
* Avoid race conditions
* Prevent accidental overwrites
* Maintain consistent shared state

requires advanced synchronization techniques.

A simple last-write-wins approach can result in:

```text
User A ─────────┐
                │
                ▼
             Server
                │
                ▼
          Last Write Wins
                │
                ▼
        ❌ Changes Lost
```

This becomes especially challenging when multiple users modify the same line of code or draw simultaneously.

---

# 💡 Solution

SyncSpace solves this problem by combining:

```text
React
   +
Socket.IO / WebSockets
   +
Yjs CRDT
   +
Monaco Editor
   +
Interactive Canvas
   +
Node.js + Express
   +
MongoDB
   +
JWT Authentication
```

The architecture enables low-latency communication while Yjs handles conflict-free collaborative document editing.

```text
                    ┌─────────────────┐
                    │    SyncSpace    │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
       🎨 Whiteboard                  💻 Code Editor
              │                             │
              ▼                             ▼
       Canvas Events                       Yjs
              │                             │
              └──────────────┬──────────────┘
                             ▼
                        Socket.IO
                             │
                             ▼
                     Node.js Backend
                             │
                             ▼
                          MongoDB
```

---

# 🎯 Use Cases

## 👨‍💻 Technical Interviews

An interviewer can discuss an architecture diagram while a candidate writes and edits code in the same collaborative session.

## 🏗️ System Design

Teams can collaboratively create:

* System architecture diagrams
* Database designs
* API workflows
* Microservice diagrams
* Data-flow diagrams

## 👥 Distributed Engineering Teams

Developers working remotely can collaborate on design and implementation without being physically present.

## 💻 Pair Programming

Multiple developers can edit the same code document simultaneously.

## 🎓 Remote Workshops

Teachers and students can collaboratively solve programming and system design problems.

## 🧠 Brainstorming

Teams can visually explore ideas using the shared whiteboard.

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
* 🗑️ Clear
* 📥 Download as PNG
* ⚡ Real-time drawing synchronization

Changes made by one user are broadcast to other users in the same room.

---

## 💻 Collaborative Code Editor

SyncSpace integrates **Monaco Editor**, the editor engine behind Visual Studio Code.

Features include:

* Syntax highlighting
* Real-time editing
* Multiple users editing simultaneously
* Shared Yjs document
* Remote cursor awareness
* User presence
* Conflict-free synchronization

---

## 🧬 Yjs CRDT Synchronization

Yjs provides conflict-free replicated data structures for collaborative editing.

Instead of simply replacing the document whenever a new update arrives, concurrent changes can be merged into a consistent shared state.

```text
User A ──> Update A ──┐
                      │
                      ▼
                   Yjs CRDT
                      │
                      ▼
               Conflict Resolution
                      │
                      ▼
              Consistent Document
                      ▲
                      │
User B ──> Update B ──┘
```

---

## ⚡ Real-Time Communication

Socket.IO provides low-latency bidirectional communication.

It is responsible for:

* Room events
* Whiteboard synchronization
* Code synchronization support
* User presence
* Awareness
* Connection events
* Join / leave events

---

## 👥 Live User Awareness

Users can see other collaborators through:

* User names
* User colors
* Online status
* Remote cursor positions
* Active user indicators
* Join / leave notifications

---

## 🏠 Room-Based Collaboration

Each team gets an isolated collaboration room.

```text
Room A
├── Candidate
├── Interviewer
└── Observer

Room B
├── Developer
└── Reviewer
```

Users from one room do not receive collaboration events from another room.

---

## 🔐 Authentication & Authorization

SyncSpace uses:

* JWT authentication
* Password hashing with bcrypt
* Protected REST APIs
* Socket authentication
* Room membership validation

This ensures that only authorized users can access collaborative sessions.

---

## 💾 Persistent Data

MongoDB is used to store important application and collaboration information.

Persistence includes:

* Users
* Rooms
* Whiteboard data
* Code data
* Collaborative document state
* Session history

---

## 🎬 Session Replay

SyncSpace supports session history and replay functionality for reviewing how a collaborative session evolved.

```text
00:00 ─────────────●────────────── 05:30
                   ▲
                Current

▶ Play     ⏸ Pause     ⏮ Restart
```

Replay can be used to review:

* Whiteboard evolution
* Code changes
* Collaboration history
* Interview progress

The replay view is isolated from the current live collaboration state.

---

# 🔄 How It Works

## Whiteboard Collaboration

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
      ├──────────────┐
      ▼              ▼
   User B          User C
      │              │
      ▼              ▼
Canvas Update    Canvas Update
```

## Code Collaboration

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

| Layer                | Technology             |
| -------------------- | ---------------------- |
| 🎨 Frontend          | React 19               |
| ⚡ Build Tool         | Vite                   |
| 🖌️ Whiteboard       | HTML Canvas            |
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

SyncSpace uses Yjs to maintain a shared collaborative document.

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
                  ┌─────────────┐
User A ──────────>│             │
                  │    Yjs      │
                  │    CRDT     │
                  │             │
User B ──────────>│             │
                  └──────┬──────┘
                         │
                         ▼
                 Consistent State
```

This approach reduces the risk of conflicting updates and lost edits.

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

# 🔐 Authentication Flow

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
              ┌──────┴──────┐
              ▼             ▼
        REST API        Socket.IO
              │             │
              ▼             ▼
       Protected       JWT Verification
         Routes              │
                             ▼
                     Room Membership
                             │
                             ▼
                       Collaboration
```

---

# 💾 Persistence Architecture

MongoDB stores persistent application and collaboration data.

```text
                        MongoDB
                           │
            ┌──────────────┼──────────────┐
            │              │              │
            ▼              ▼              ▼
          Users          Rooms       Whiteboards
                                          
                           │
                           ▼
                      Code State
                           │
                           ▼
                    Session History
```

This allows important collaboration data to survive server restarts.

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

Install the following:

* Node.js 22+
* npm
* MongoDB
* Git

---

## 1️⃣ Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd WHITEBOARD-main
```

---

# ⚙️ Backend Setup

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

# 💻 Frontend Setup

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

Open SyncSpace in two browser tabs.

## Test 1 — Room Collaboration

```text
Tab A ─────────┐
               ├── Same Room
Tab B ─────────┘
```

## Test 2 — Whiteboard

Draw in Tab A.

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
Drawing appears
```

## Test 3 — Code Editor

Type in Tab A.

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
Code synchronized
```

## Test 4 — Concurrent Editing

Both users edit the same document simultaneously.

Expected:

```text
User A ──┐
         ├──> Yjs CRDT ──> Shared Consistent State
User B ──┘
```

---

# 📈 Development Roadmap

## Week 1 — Foundation

* [x] React + Vite setup
* [x] Express backend
* [x] Socket.IO infrastructure
* [x] Room creation
* [x] Room joining
* [x] Split-screen workspace
* [x] Dashboard
* [x] Navigation

## Week 2 — Real-Time Collaboration

* [x] Yjs CRDT integration
* [x] Socket.IO synchronization
* [x] Monaco Editor
* [x] Collaborative code editing
* [x] Whiteboard drawing
* [x] Remote cursor awareness
* [x] User presence
* [x] Real-time canvas synchronization

## Week 3 — Persistence

* [x] MongoDB integration
* [x] Code persistence
* [x] Whiteboard persistence
* [ ] Yjs binary state persistence
* [ ] Complete session recovery

## Week 4 — Security & Replay

* [x] JWT authentication
* [x] Protected routes
* [x] Socket authentication
* [ ] Socket room membership authorization
* [ ] Session history
* [ ] Whiteboard replay
* [ ] Code replay
* [ ] Replay timeline

## Final Review

* [ ] Replay polishing
* [ ] Connection-state improvements
* [ ] Error handling
* [ ] Reconnection handling
* [ ] Final integration testing
* [ ] Production deployment

> **Note:** Features should be marked complete only after implementation and testing.

---

# 👥 Team Members

SyncSpace is developed as a collaborative team project by:

| # | Team Member                     |
| - | ------------------------------- |
| 1 | **Anuvardhini T**               |
| 2 | **Tarun Singh**                 |
| 3 | **Shreya Kumari**               |
| 4 | **Chamarthi Venkatapathi Raju** |
| 5 | **M. Devi Akshya Priya**        |
| 6 | **Aman Panda**                  |

## 🤝 Team Collaboration

```text
                    SYNCSpace TEAM
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
     Frontend          Backend          Real-Time
        │                 │                 │
        ▼                 ▼                 ▼
   React / UI        Node / Express     Socket.IO / Yjs
        │                 │                 │
        └─────────────────┼─────────────────┘
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
* 🔑 Role-based permissions
* ☁️ Cloud deployment
* 📈 Redis-based Socket.IO scaling
* 🐳 Docker support
* ☸️ Kubernetes deployment

---

# 🏆 Project Highlights

SyncSpace demonstrates practical implementation of:

```text
┌───────────────────────────────────────┐
│       DISTRIBUTED COLLABORATION       │
├───────────────────────────────────────┤
│                                       │
│  ⚡ WebSockets                        │
│  🧬 CRDTs                             │
│  🎨 Interactive Canvas                │
│  💻 Collaborative Code Editing        │
│  🔐 JWT Authentication                │
│  🏠 Room-Based Architecture           │
│  💾 MongoDB Persistence               │
│  👥 User Awareness                    │
│  🔄 Real-Time Synchronization         │
│                                       │
└───────────────────────────────────────┘
```

---

# 📜 License

This project is developed for educational, academic, and demonstration purposes.

---

<p align="center">

# 🚀 SyncSpace

### Collaborate • Code • Design • Connect

**A real-time collaborative engineering workspace.**

</p>
```
