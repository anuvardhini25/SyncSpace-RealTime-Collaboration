# 🚀 SyncSpace

### Real-Time Collaborative Whiteboard & Code Editor

<p align="center">
  <b>Collaborate. Code. Design. In Real Time.</b>
</p>

<p align="center">
  A real-time collaborative workspace that combines an interactive whiteboard,
  Monaco code editor, WebSockets, and Yjs CRDT synchronization into one seamless platform.
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
- [Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Real-Time Synchronization](#-real-time-synchronization)
- [CRDT Architecture](#-crdt-architecture)
- [Authentication](#-authentication)
- [Persistence](#-persistence)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [Testing](#-testing)
- [Development Roadmap](#-development-roadmap)
- [Future Enhancements](#-future-enhancements)
- [Contributors](#-contributors)

---

# 🌐 About

**SyncSpace** is a real-time collaborative engineering workspace designed for technical interviews, distributed development teams, architecture discussions, coding sessions, and remote workshops.

Unlike traditional request/response applications, SyncSpace allows multiple users to work on the same workspace simultaneously.

The platform provides two synchronized working areas:

```text
┌─────────────────────────────────────────────────────────────┐
│                         SyncSpace                            │
├────────────────────────────┬────────────────────────────────┤
│                            │                                │
│      🎨 WHITEBOARD         │        💻 CODE EDITOR          │
│                            │                                │
│  Draw diagrams             │  Write and edit code           │
│  Create shapes             │  Monaco Editor                 │
│  Add text                  │  Yjs CRDT                      │
│  Collaborate in real time  │  Remote cursors                │
│                            │  Real-time synchronization      │
│                            │                                │
└────────────────────────────┴────────────────────────────────┘
