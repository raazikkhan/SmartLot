// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [slots, setSlots] = useState([]);
  const [price, setPrice] = useState(0);
  const [gridConfig, setGridConfig] = useState({ rows: 0, cols: 0 });
  const navigate = useNavigate();

  // Load settings (price + grid config)
  useEffect(() => {
    async function fetchSettings() {
      const snap = await getDoc(doc(db, "settings", "config"));
      if (snap.exists()) {
        const data = snap.data();
        setPrice(data.pricePerHour);
        setGridConfig({ rows: data.rows || 0, cols: data.cols || 0 });
      }
    }
    fetchSettings();
  }, []);

  // Real-time slot listener
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "parkingSlots"), (snapshot) => {
      setSlots(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const total = gridConfig.rows * gridConfig.cols;
  const occupied = slots.filter((s) => s.status === "taken").length;
  const available = total - occupied;

  const navBtnStyle = {
    padding: "10px 20px",
    borderRadius: 8,
    border: "none",
    background: "#3b82f6",
    color: "#fff",
    cursor: "pointer",
    fontSize: 12,
  };

  return (
    <div className="max-w-5/12 m-auto px-3  ">
      <div className="flex justify-between items-center  mb-12">
        <h2 className="font-semibold text-3xl ">Dashboard Overview</h2>
        <span className="text-lg">Charge ₹{price}/hr</span>
      </div>

      {/* Stats */}
      <div
        style={{ display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap" }}
      >
        <div className="bg-blue-500 text-white font-bold rounded-2xl py-12 px-5 shadow-xl text-center">
          <div className="text-3xl font-400">{total}</div>
          <div className="mt-4 font-semibold">Total Verified Slots</div>
        </div>
        <div className="bg-red-500 text-white font-bold rounded-2xl py-12 px-5  shadow-xl text-center">
          <div className="text-3xl font-400">{occupied}</div>
          <div className="mt-4 font-semibold">Current Occupancy</div>
        </div>
        <div className="bg-green-500 text-white font-bold rounded-2xl py-12 px-5  shadow-xl text-center">
          <div className="text-3xl font-400">{available}</div>
          <div className="mt-4 font-semibold">Available Slots</div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-2  ">
        <button style={navBtnStyle} onClick={() => navigate("/slots")}>
          View Slot Map
        </button>
        <button style={navBtnStyle} onClick={() => navigate("/entry")}>
          Vehicle Entry
        </button>
        <button style={navBtnStyle} onClick={() => navigate("/exit")}>
          Vehicle Exit
        </button>
        <button style={navBtnStyle} onClick={() => navigate("/logs")}>
          View Logs
        </button>
        <button
          style={{ ...navBtnStyle, background: "#6b7280" }}
          onClick={() => navigate("/settings")}
        >
          Settings
        </button>
      </div>
    </div>
  );
}
