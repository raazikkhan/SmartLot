// src/pages/Settings.jsx
// src/pages/Settings.jsx
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, setDoc, writeBatch } from "firebase/firestore";
import { doc as firestoreDoc, collection } from "firebase/firestore";

export default function Settings() {
  const [price, setPrice] = useState("");
  const [rows, setRows] = useState("");
  const [cols, setCols] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      const snap = await getDoc(doc(db, "settings", "config"));
      if (snap.exists()) {
        const data = snap.data();
        setPrice(data.pricePerHour);
        setRows(data.rows);
        setCols(data.cols);
      }
    }
    fetchSettings();
  }, []);

  async function handleSave() {
    await setDoc(doc(db, "settings", "config"), {
      pricePerHour: Number(price),
      rows: Number(rows),
      cols: Number(cols),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function seedSlots() {
    const snap = await getDoc(doc(db, "settings", "config"));
    const { rows, cols } = snap.data();
    const batch = writeBatch(db);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const slotId = `${r}-${c}`;
        const ref = firestoreDoc(db, "parkingSlots", slotId);
        batch.set(ref, {
          row: r,
          col: c,
          status: "free",
          vehicleNumber: null,
          vehicleId: null,
        });
      }
    }
    await batch.commit();
    alert("Slots regenerated successfully!");
  }

  const inputStyle = {
    display: "block",
    width: "100%",
    padding: "10px 12px",
    fontSize: "15px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    marginBottom: "16px",
    boxSizing: "border-box",
    background: "#fff",
  };

  const btnStyle = (bg) => ({
    width: "100%",
    padding: "12px",
    background: bg,
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    cursor: "pointer",
    marginBottom: 12,
  });

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", padding: "0 24px" }}>
      <h2 className="mb-10 text-3xl font-semibold">Admin Settings</h2>

      <label style={{ fontWeight: 500, display: "block", marginBottom: 6 }}>
        Price per Hour (₹)
      </label>
      <input
        style={inputStyle}
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <label style={{ fontWeight: 500, display: "block", marginBottom: 6 }}>
        Rows
      </label>
      <input
        style={inputStyle}
        type="number"
        value={rows}
        onChange={(e) => setRows(e.target.value)}
      />

      <label style={{ fontWeight: 500, display: "block", marginBottom: 6 }}>
        Columns
      </label>
      <input
        style={inputStyle}
        type="number"
        value={cols}
        onChange={(e) => setCols(e.target.value)}
      />

      <button style={btnStyle("#3b82f6")} onClick={handleSave}>
        Save Settings
      </button>

      <button style={btnStyle("#8b5cf6")} onClick={seedSlots}>
        Regenerate Parking Slots
      </button>

      {saved && (
        <div
          style={{
            padding: 12,
            background: "#dcfce7",
            borderRadius: 8,
            color: "#166534",
            textAlign: "center",
            fontWeight: 500,
          }}
        >
          Settings saved!
        </div>
      )}

      <p style={{ marginTop: 16, fontSize: 13, color: "#9ca3af" }}>
        Note: Click "Regenerate Parking Slots" after changing rows or columns to
        rebuild the slot grid.
      </p>
    </div>
  );
}
