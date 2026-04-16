import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { MdOutlineDashboard } from "react-icons/md";
import { FaRegMap } from "react-icons/fa";
import { GiEntryDoor } from "react-icons/gi";
import { ImExit } from "react-icons/im";
import { IoIosTimer } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { FaCar } from "react-icons/fa";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { label: "Dashboard", path: "/dashboard", icon: <MdOutlineDashboard /> },
    { label: "Slot Map", path: "/slots", icon: <FaRegMap /> },
    { label: "Entry", path: "/entry", icon: <GiEntryDoor /> },
    { label: "Exit", path: "/exit", icon: <ImExit /> },
    { label: "Logs", path: "/logs", icon: <IoIosTimer /> },
    { label: "Settings", path: "/settings", icon: <IoSettingsOutline /> },
  ];

  async function handleLogout() {
    await signOut(auth);
    navigate("/login");
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-6 z-50  bg-white  ">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>
            <FaCar />
          </span>
          <span className="text-blue-600 font-bold text-lg">
            SmartLot
            <p className="text-zinc-500 text-[12px]">Intelligent Parking</p>
          </span>
        </div>
        <button
          className="bg-blue-600 py-2 px-3 rounded  text-white text-sm hover:bg-blue-700 transition font-semibold"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Side bar */}
      <div className="fixed  h-screen w-50 shadow-lg flex flex-col py-4 px-3 z-99 gap-4">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                borderRadius: 8,
                border: "none",
                background: isActive ? "#3b82f6" : "transparent",
                color: isActive ? "#fff" : "#94a3b8",
                cursor: "pointer",
                fontSize: 14,
                textAlign: "left",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = "#1e293b";
                if (!isActive) e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
                if (!isActive) e.currentTarget.style.color = "#94a3b8";
              }}
            >
              <span style={{ fontSize: 16 }}>{link.icon}</span>
              <span>{link.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
