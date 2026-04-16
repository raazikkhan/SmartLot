// src/pages/VehicleExit.jsx
import { useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function VehicleExit() {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleExit() {
    if (!vehicleNumber.trim()) {
      setError("Please enter a vehicle number");
      return;
    }

    setLoading(true);
    setError("");
    setReceipt(null);

    try {
      // 1. Find active vehicle record
      const q = query(
        collection(db, "vehicles"),
        where("vehicleNumber", "==", vehicleNumber.toUpperCase()),
        where("checkOutTime", "==", null),
      );
      const snap = await getDocs(q);

      if (snap.empty) {
        setError("Vehicle not found or already checked out.");
        setLoading(false);
        return;
      }

      const vehicleDoc = snap.docs[0];
      const vehicleData = vehicleDoc.data();

      // 2. Get price from settings
      const settingsSnap = await getDoc(doc(db, "settings", "config"));
      const pricePerHour = settingsSnap.data().pricePerHour;

      // 3. Calculate charge
      const checkInTime = vehicleData.checkInTime.toDate();
      const checkOutTime = new Date();
      const diffMs = checkOutTime - checkInTime;
      const diffHours = diffMs / (1000 * 60 * 60);
      // Minimum 1 hour, round up to next hour
      const billableHours = Math.max(1, Math.ceil(diffHours));
      const amountCharged = billableHours * pricePerHour;

      // 4. Update vehicle record
      await updateDoc(doc(db, "vehicles", vehicleDoc.id), {
        checkOutTime: Timestamp.now(),
        amountCharged: amountCharged,
      });

      // 5. Free the slot
      await updateDoc(doc(db, "parkingSlots", vehicleData.slotId), {
        status: "free",
        vehicleNumber: null,
        vehicleId: null,
      });

      // 6. Show receipt
      const slotSnap = await getDoc(
        doc(db, "parkingSlots", vehicleData.slotId),
      );
      const slotData = slotSnap.data();

      setReceipt({
        vehicleNumber: vehicleData.vehicleNumber,
        slot: slotData
          ? `${String.fromCharCode(65 + slotData.row)}${slotData.col + 1}`
          : vehicleData.slotId,
        checkIn: checkInTime.toLocaleString(),
        checkOut: checkOutTime.toLocaleString(),
        hours: billableHours,
        pricePerHour,
        total: amountCharged,
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
        <h2 className="text-3xl font-semibold">Vehicle Exit</h2>
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
        onKeyDown={(e) => e.key === "Enter" && handleExit()}
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
        onClick={handleExit}
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px",
          background: loading ? "#9ca3af" : "#ef4444",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Processing..." : "Check Out Vehicle"}
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

      {receipt && (
        <div
          style={{
            marginTop: 16,
            padding: 20,
            background: "#f8fafc",
            borderRadius: 12,
            border: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: 18,
              marginBottom: 16,
              color: "#166534",
            }}
          >
            ✓ Checkout Receipt
          </div>
          <div style={{ display: "grid", rowGap: 8, fontSize: 15 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#6b7280" }}>Vehicle</span>
              <strong>{receipt.vehicleNumber}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#6b7280" }}>Slot</span>
              <strong>{receipt.slot}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#6b7280" }}>Check In</span>
              <strong>{receipt.checkIn}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#6b7280" }}>Check Out</span>
              <strong>{receipt.checkOut}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#6b7280" }}>Duration</span>
              <strong>
                {receipt.hours} hr{receipt.hours > 1 ? "s" : ""}
              </strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#6b7280" }}>Rate</span>
              <strong>₹{receipt.pricePerHour}/hr</strong>
            </div>
            <hr
              style={{
                border: "none",
                borderTop: "1px solid #e2e8f0",
                margin: "4px 0",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 18,
              }}
            >
              <span style={{ fontWeight: 700 }}>Total</span>
              <strong style={{ color: "#dc2626" }}>₹{receipt.total}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
