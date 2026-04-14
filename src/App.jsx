// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import SlotMap from "./pages/SlotMap.jsx";
import VehicleEntry from "./pages/VehicleEntry.jsx";
import VehicleExit from "./pages/ VehicleExit.jsx";
import Logs from "./pages/Logs.jsx";
import Settings from "./pages/Settings.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/slots"
          element={
            <PrivateRoute>
              <SlotMap />
            </PrivateRoute>
          }
        />
        <Route
          path="/entry"
          element={
            <PrivateRoute>
              <VehicleEntry />
            </PrivateRoute>
          }
        />
        <Route
          path="/exit"
          element={
            <PrivateRoute>
              <VehicleExit />
            </PrivateRoute>
          }
        />
        <Route
          path="/logs"
          element={
            <PrivateRoute>
              <Logs />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}
