// src/pages/SlotMap.jsx
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function SlotMap() {
  const [slots, setSlots] = useState([]);
  const [config, setConfig] = useState({ rows: 3, cols: 4 });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchConfig() {
      const snap = await getDoc(doc(db, "settings", "config"));
      if (snap.exists()) {
        const { rows, cols } = snap.data();
        setConfig({ rows, cols });
      }
    }
    fetchConfig();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "parkingSlots"), (snapshot) => {
      setSlots(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  // Build grid: rows x cols, fill with slot data or empty
  function getSlotAt(row, col) {
    return slots.find((s) => s.row === row && s.col === col) || null;
  }

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: "0 20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h2 className="text-3xl font-semibold">Slot Map</h2>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: "none",
            background: "#6b7280",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Back
        </button>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 20, marginBottom: 20, fontSize: 14 }}>
        <span>
          <span
            style={{
              display: "inline-block",
              width: 14,
              height: 14,
              background: "#22c55e",
              borderRadius: 3,
              marginRight: 6,
            }}
          />
          Free
        </span>
        <span>
          <span
            style={{
              display: "inline-block",
              width: 14,
              height: 14,
              background: "#ef4444",
              borderRadius: 3,
              marginRight: 6,
            }}
          />
          Taken
        </span>
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
          gap: 12,
        }}
      >
        {Array.from({ length: config.rows }, (_, r) =>
          Array.from({ length: config.cols }, (_, c) => {
            const slot = getSlotAt(r, c);
            const taken = slot?.status === "taken";
            return (
              <div
                key={`${r}-${c}`}
                style={{
                  background: taken ? "#ef4444" : "#22c55e",
                  borderRadius: 10,
                  padding: "16px 8px",
                  textAlign: "center",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 500,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                }}
              >
                <div style={{ fontSize: 16, fontWeight: 700 }}>
                  {String.fromCharCode(65 + r)}
                  {c + 1}
                </div>
                <div style={{ marginTop: 4, fontSize: 11, opacity: 0.9 }}>
                  {taken ? slot.vehicleNumber : "Free"}
                </div>
              </div>
            );
          }),
        )}
      </div>

      <p style={{ marginTop: 20, color: "#6b7280", fontSize: 13 }}>
        Slots update in real-time. Total: {config.rows * config.cols} | Taken:{" "}
        {slots.filter((s) => s.status === "taken").length} | Free:{" "}
        {config.rows * config.cols -
          slots.filter((s) => s.status === "taken").length}
      </p>
    </div>
  );
}
