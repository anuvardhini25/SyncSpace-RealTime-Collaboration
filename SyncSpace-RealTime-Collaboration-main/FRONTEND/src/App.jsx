import { Routes, Route, Navigate } from "react-router-dom";
import WorkspaceLayout from "./Components/WorkspaceLayout";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import RoomList from "./Components/RoomList";
import ProtectedRoute from "./Components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <RoomList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workspace/:roomId"
        element={
          <ProtectedRoute>
            <WorkspaceLayout />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}