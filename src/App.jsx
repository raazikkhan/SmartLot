import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SlotMap from "./pages/SlotMap";
import VehicleEntry from "./pages/VehicleEntry";
import VehicleExit from "./pages/ VehicleExit";
import Logs from "./pages/Logs";
import Settings from "./pages/Settings";
import { useAuth } from "./context/AuthContext";

function Layout({ children }) {
  const { currentUser } = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {currentUser && !isLoginPage && <Navbar />}
      <div
        style={{
          marginLeft: currentUser && !isLoginPage ? 200 : 0,
          marginTop: currentUser && !isLoginPage ? 60 : 0,
          minHeight: "calc(100vh - 60px)",
          overflowY: "auto",
          padding: currentUser && !isLoginPage ? "24px" : "0",
        }}
      >
        {children}
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
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
      </Layout>
    </BrowserRouter>
  );
}
