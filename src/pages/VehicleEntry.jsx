// src/pages/VehicleEntry.jsx
import { useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function VehicleEntry() {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleEntry() {
    if (!vehicleNumber.trim()) {
      setError("Please enter a vehicle number");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(null);

    try {
      // 1. Check if vehicle is already parked
      const existingQuery = query(
        collection(db, "vehicles"),
        where("vehicleNumber", "==", vehicleNumber.toUpperCase()),
        where("checkOutTime", "==", null),
      );
      const existingSnap = await getDocs(existingQuery);
      if (!existingSnap.empty) {
        setError("This vehicle is already parked!");
        setLoading(false);
        return;
      }

      // 2. Find a free slot
      const freeQuery = query(
        collection(db, "parkingSlots"),
        where("status", "==", "free"),
      );
      const freeSnap = await getDocs(freeQuery);

      if (freeSnap.empty) {
        setError("No free slots available!");
        setLoading(false);
        return;
      }

      // 3. Pick the first free slot
      const slotDoc = freeSnap.docs[0];
      const slotId = slotDoc.id;
      const slotData = slotDoc.data();

      // 4. Create vehicle record
      const vehicleRef = await addDoc(collection(db, "vehicles"), {
        vehicleNumber: vehicleNumber.toUpperCase(),
        slotId: slotId,
        checkInTime: Timestamp.now(),
        checkOutTime: null,
        amountCharged: null,
      });

      // 5. Mark slot as taken
      await updateDoc(doc(db, "parkingSlots", slotId), {
        status: "taken",
        vehicleNumber: vehicleNumber.toUpperCase(),
        vehicleId: vehicleRef.id,
      });

      setSuccess({
        vehicleNumber: vehicleNumber.toUpperCase(),
        slot: `${String.fromCharCode(65 + slotData.row)}${slotData.col + 1}`,
        time: new Date().toLocaleTimeString(),
      });
      setVehicleNumber("");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    }

    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", padding: "0 20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h2 className="text-3xl font-bold">Vehicle Entry</h2>
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

      <input
        type="text"
        placeholder="Enter vehicle number (e.g. MH12AB1234)"
        value={vehicleNumber}
        onChange={(e) => setVehicleNumber(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleEntry()}
        style={{
          display: "block",
          width: "100%",
          padding: "12px",
          fontSize: "16px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          marginBottom: "12px",
          boxSizing: "border-box",
          textTransform: "uppercase",
        }}
      />

      <button
        onClick={handleEntry}
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px",
          background: loading ? "#9ca3af" : "#22c55e",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Processing..." : "Check In Vehicle"}
      </button>

      {error && (
        <div
          style={{
            marginTop: 16,
            padding: 14,
            background: "#fee2e2",
            borderRadius: 8,
            color: "#dc2626",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            marginTop: 16,
            padding: 16,
            background: "#dcfce7",
            borderRadius: 8,
            color: "#166534",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
            ✓ Vehicle Checked In
          </div>
          <div>
            Vehicle: <strong>{success.vehicleNumber}</strong>
          </div>
          <div>
            Slot assigned: <strong>{success.slot}</strong>
          </div>
          <div>
            Time: <strong>{success.time}</strong>
          </div>
        </div>
      )}
    </div>
  );
}
