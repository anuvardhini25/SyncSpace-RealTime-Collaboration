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

<<<<<<< HEAD
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
=======
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
>>>>>>> 4ded11fe805d71be433c63fd73c53a026cf13668

---

# 🌐 About

<<<<<<< HEAD
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
=======
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
>>>>>>> 4ded11fe805d71be433c63fd73c53a026cf13668

---

# ❗ Problem Statement

<<<<<<< HEAD
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
=======
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
>>>>>>> 4ded11fe805d71be433c63fd73c53a026cf13668

---

# 💡 Solution

SyncSpace combines real-time communication with conflict-free synchronization.

<<<<<<< HEAD
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
=======
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
>>>>>>> 4ded11fe805d71be433c63fd73c53a026cf13668

---

# 🎯 Use Cases

## 👨‍💻 Technical Interviews

<<<<<<< HEAD
An interviewer can discuss a system architecture on the whiteboard while a candidate writes code simultaneously.
=======
An interviewer can discuss system architecture on the whiteboard while a candidate writes code simultaneously.
>>>>>>> 4ded11fe805d71be433c63fd73c53a026cf13668

## 🏗️ System Design

Teams can collaboratively create:

<<<<<<< HEAD
- System architecture diagrams
- Database designs
- API workflows
- Microservice diagrams
- Data-flow diagrams

## 👥 Distributed Engineering Teams

Remote developers can collaborate on technical designs and implementation from different locations.
=======
* System architecture diagrams
* Database designs
* API workflows
* Microservice diagrams
* Data-flow diagrams

## 👥 Distributed Engineering Teams

Remote developers can collaborate on technical designs and implementation.
>>>>>>> 4ded11fe805d71be433c63fd73c53a026cf13668

## 💻 Pair Programming

Multiple developers can edit the same code document simultaneously.

## 🎓 Remote Workshops

Teachers and students can collaboratively solve programming and system-design problems.

## 🧠 Brainstorming

Teams can visually explore ideas using the shared collaborative whiteboard.

---

# ✨ Key Features

## 🎨 Collaborative Whiteboard

<<<<<<< HEAD
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
=======
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
>>>>>>> 4ded11fe805d71be433c63fd73c53a026cf13668

---

## 💻 Collaborative Code Editor

SyncSpace integrates **Monaco Editor**, the editor technology behind Visual Studio Code.

Features include:

<<<<<<< HEAD
- Syntax highlighting
- Real-time code editing
- Concurrent editing
- Yjs shared document
- Remote cursor awareness
- User presence
- Conflict-free synchronization
=======
* Syntax highlighting
* Real-time code editing
* Concurrent editing
* Yjs shared document
* Remote cursor awareness
* User presence
* Conflict-free synchronization
>>>>>>> 4ded11fe805d71be433c63fd73c53a026cf13668

---

## 🧬 Yjs CRDT Synchronization

<<<<<<< HEAD
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
=======
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
>>>>>>> 4ded11fe805d71be433c63fd73c53a026cf13668

---

# ⚡ Real-Time Communication

<<<<<<< HEAD
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
=======
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
>>>>>>> 4ded11fe805d71be433c63fd73c53a026cf13668
```

---

# 👥 Live User Awareness

Users can see other collaborators through:

<<<<<<< HEAD
- 👤 User names
- 🎨 User colors
- 🟢 Online status
- 🖱️ Remote cursor positions
- 🔔 Join notifications
- 🔔 Leave notifications
- 👥 Active user indicators
=======
* 👤 User names
* 🎨 User colors
* 🟢 Online status
* 🖱️ Remote cursor positions
* 🔔 Join notifications
* 🔔 Leave notifications
* 👥 Active user indicators
>>>>>>> 4ded11fe805d71be433c63fd73c53a026cf13668

---

# 🏠 Room-Based Collaboration

Every collaborative session operates inside an isolated room.

```text
                    SyncSpace
<<<<<<< HEAD
                       │
          ┌────────────┴────────────┐
          │                         │
       Room A                    Room B
          │                         │
     ┌────┼────┐               ┌────┴────┐
     │    │    │               │         │
   User  User User           User      User
=======
                        │
              ┌─────────┴─────────┐
              │                   │
           Room A              Room B
              │                   │
        ┌─────┼─────┐         ┌───┴───┐
        │     │     │         │       │
      User  User  User      User    User
>>>>>>> 4ded11fe805d71be433c63fd73c53a026cf13668
```

Users inside one room receive collaboration updates from their own session without mixing data from other rooms.

---

# 🔐 Authentication

<<<<<<< HEAD
SyncSpace uses secure authentication mechanisms including:

- JWT authentication
- bcrypt password hashing
- Protected REST APIs
- Authenticated Socket.IO connections
- Room membership authorization
=======
SyncSpace implements secure authentication using:

* JWT authentication
* bcrypt password hashing
* Protected REST APIs
* Authenticated Socket.IO connections
* Room membership authorization
>>>>>>> 4ded11fe805d71be433c63fd73c53a026cf13668

Authentication flow:

```text
              User
<<<<<<< HEAD
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
=======
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
>>>>>>> 4ded11fe805d71be433c63fd73c53a026cf13668
```

---

# 💾 Persistence

MongoDB is used for persistent application data.

<<<<<<< HEAD
The database can store information related to:

- 👤 Users
- 🏠 Rooms
- 🎨 Whiteboards
- 💻 Code documents
- 🧬 Collaborative document state
- 📜 Session history

Persistence allows important data to survive server restarts.
=======
The system stores information related to:

* 👤 Users
* 🏠 Rooms
* 🎨 Whiteboards
* 💻 Code documents
* 🧬 Collaborative document state
* 📜 Session history

Persistence allows important application data to survive server restarts.
>>>>>>> 4ded11fe805d71be433c63fd73c53a026cf13668

---

# 🎬 Session Replay

<<<<<<< HEAD
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

=======
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

>>>>>>> 4ded11fe805d71be433c63fd73c53a026cf13668
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

<<<<<<< HEAD
---

=======
>>>>>>> 4ded11fe805d71be433c63fd73c53a026cf13668
## 💻 Code Collaboration

```text
User A
<<<<<<< HEAD
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
=======
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
>>>>>>> 4ded11fe805d71be433c63fd73c53a026cf13668
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
<<<<<<< HEAD
                           ┌────────────────┐
                           │    Socket.IO   │
                           │   WebSockets   │
                           └───────┬────────┘
                                   │
                                   ▼
=======
                            ┌────────────────┐
                            │    Socket.IO   │
                            │   WebSockets   │
                            └───────┬────────┘
                                    │
                                    ▼
>>>>>>> 4ded11fe805d71be433c63fd73c53a026cf13668
                         ┌────────────────────┐
                         │ Node.js + Express  │
                         │                    │
                         │ Authentication     │
                         │ Room Management    │
                         │ Socket Handlers    │
                         │ Yjs Synchronization│
                         └─────────┬──────────┘
                                   │
<<<<<<< HEAD
                    ┌──────────────┴──────────────┐
                    │                             │
                    ▼                             ▼
              ┌──────────┐                  ┌──────────┐
              │   Yjs    │                  │ MongoDB  │
              │   CRDT   │                  │          │
              └──────────┘                  └──────────┘
=======
                       ┌───────────┴───────────┐
                       │                       │
                       ▼                       ▼
                 ┌──────────┐             ┌──────────┐
                 │   Yjs    │             │ MongoDB  │
                 │   CRDT   │             │          │
                 └──────────┘             └──────────┘
>>>>>>> 4ded11fe805d71be433c63fd73c53a026cf13668
```

---

# 🧰 Tech Stack

<<<<<<< HEAD
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
=======
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
>>>>>>> 4ded11fe805d71be433c63fd73c53a026cf13668

---

# 🧬 CRDT Architecture

SyncSpace uses a Yjs shared document to maintain collaborative code state.

```text
                         Y.Doc
                           │
<<<<<<< HEAD
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
           Y.Text        Y.Map        Y.Array
              │
              ▼
        Monaco Editor
```

When users edit simultaneously:
=======
               ┌───────────┼───────────┐
               │           │           │
               ▼           ▼           ▼
            Y.Text       Y.Map       Y.Array
               │
               ▼
         Monaco Editor
```

When multiple users edit simultaneously:
>>>>>>> 4ded11fe805d71be433c63fd73c53a026cf13668

```text
                  ┌──────────────┐
User A ──────────►│              │
                  │   Yjs CRDT   │
<<<<<<< HEAD
                  │              │
=======
>>>>>>> 4ded11fe805d71be433c63fd73c53a026cf13668
User B ──────────►│              │
                  └──────┬───────┘
                         │
                         ▼
<<<<<<< HEAD
                 Shared Consistent
                      State
=======
                Shared Consistent State
>>>>>>> 4ded11fe805d71be433c63fd73c53a026cf13668
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
<<<<<<< HEAD
WHITEBOARD-main/
=======
SyncSpace-RealTime-Collaboration/
>>>>>>> 4ded11fe805d71be433c63fd73c53a026cf13668
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
<<<<<<< HEAD
│   │   │   ├── UI/
│   │   │   └── ...
=======
│   │   │   └── UI/
>>>>>>> 4ded11fe805d71be433c63fd73c53a026cf13668
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
<<<<<<< HEAD
=======
├── docs/
│   └── screenshots/
│       ├── dashboard.png
│       ├── login.png
│       ├── room.png
│       ├── whiteboard.png
│       ├── code-editor.png
│       └── collaboration.png
│
>>>>>>> 4ded11fe805d71be433c63fd73c53a026cf13668
├── .gitignore
└── README.md
```

---

# 🚀 Installation

## Prerequisites

Install:

<<<<<<< HEAD
- Node.js 22+
- npm
- MongoDB
- Git
=======
* Node.js 22+
* npm
* MongoDB
* Git
>>>>>>> 4ded11fe805d71be433c63fd73c53a026cf13668

---

## 1️⃣ Clone Repository

```bash
<<<<<<< HEAD
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd WHITEBOARD-main
=======
git clone https://github.com/anuvardhini25/SyncSpace-RealTime-Collaboration.git
cd SyncSpace-RealTime-Collaboration
>>>>>>> 4ded11fe805d71be433c63fd73c53a026cf13668
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

<<<<<<< HEAD
Expected:
=======
Expected result:
>>>>>>> 4ded11fe805d71be433c63fd73c53a026cf13668

```text
Tab A
  │
  ▼
<<<<<<< HEAD
Draw
=======
 Draw
>>>>>>> 4ded11fe805d71be433c63fd73c53a026cf13668
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

<<<<<<< HEAD
Expected:
=======
Expected result:
>>>>>>> 4ded11fe805d71be433c63fd73c53a026cf13668

```text
Tab A
  │
<<<<<<< HEAD
Monaco
  │
Yjs
  │
Socket.IO
  │
Tab B
  │
=======
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
>>>>>>> 4ded11fe805d71be433c63fd73c53a026cf13668
Code Synchronized
```

---

## Test 4 — Concurrent Editing

Both users edit the same document simultaneously.

<<<<<<< HEAD
Expected:
=======
Expected result:
>>>>>>> 4ded11fe805d71be433c63fd73c53a026cf13668

```text
User A ──┐
         ├──► Yjs CRDT ──► Shared Consistent State
User B ──┘
```

---

<<<<<<< HEAD
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
=======
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
>>>>>>> 4ded11fe805d71be433c63fd73c53a026cf13668

---

# 👥 Team Members

<<<<<<< HEAD
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
=======
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
>>>>>>> 4ded11fe805d71be433c63fd73c53a026cf13668

---

# 🏆 Project Highlights

SyncSpace demonstrates practical implementation of:

<<<<<<< HEAD
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
=======
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
>>>>>>> 4ded11fe805d71be433c63fd73c53a026cf13668

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
