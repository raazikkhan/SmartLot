// src/pages/Logs.jsx
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [vehicleFilter, setVehicleFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  // Real-time logs listener
  useEffect(() => {
    const q = query(collection(db, "vehicles"), orderBy("checkInTime", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setLogs(data);
      setFiltered(data);
    });
    return unsub;
  }, []);

  // Apply filters whenever any filter changes
  useEffect(() => {
    let result = [...logs];

    // Vehicle number filter
    if (vehicleFilter.trim()) {
      result = result.filter((log) =>
        log.vehicleNumber?.toLowerCase().includes(vehicleFilter.toLowerCase()),
      );
    }

    // Date filter
    if (dateFilter) {
      result = result.filter((log) => {
        const logDate = log.checkInTime?.toDate();
        if (!logDate) return false;
        const logDateStr = logDate.toISOString().split("T")[0];
        return logDateStr === dateFilter;
      });
    }

    // Status filter
    if (statusFilter === "active") {
      result = result.filter((log) => log.checkOutTime === null);
    } else if (statusFilter === "completed") {
      result = result.filter((log) => log.checkOutTime !== null);
    }

    setFiltered(result);
  }, [vehicleFilter, dateFilter, statusFilter, logs]);

  function clearFilters() {
    setVehicleFilter("");
    setDateFilter("");
    setStatusFilter("all");
  }

  function formatTime(timestamp) {
    if (!timestamp) return "—";
    return timestamp.toDate().toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getDuration(checkIn, checkOut) {
    if (!checkIn || !checkOut) return "Active";
    const diffMs = checkOut.toDate() - checkIn.toDate();
    const hrs = Math.floor(diffMs / 3600000);
    const mins = Math.floor((diffMs % 3600000) / 60000);
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  }

  const inputStyle = {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #e2e8f0",
    fontSize: 14,
    outline: "none",
    background: "#fff",
  };

  // Summary stats from filtered results
  const totalRevenue = filtered
    .filter((l) => l.amountCharged)
    .reduce((sum, l) => sum + l.amountCharged, 0);
  const activeCount = filtered.filter((l) => !l.checkOutTime).length;
  const completedCount = filtered.filter((l) => l.checkOutTime).length;

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 20px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h2 className="text-3xl font-semibold">Parking Logs</h2>
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

      {/* Summary cards */}
      <div
        style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}
      >
        {[
          { label: "Showing", value: filtered.length, bg: "#6366f1" },
          { label: "Active now", value: activeCount, bg: "#f59e0b" },
          { label: "Completed", value: completedCount, bg: "#22c55e" },
          { label: "Revenue", value: `₹${totalRevenue}`, bg: "#3b82f6" },
        ].map((card) => (
          <div
            key={card.label}
            style={{
              background: card.bg,
              color: "#fff",
              borderRadius: 10,
              padding: "14px 20px",
              flex: 1,
              minWidth: 120,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 700 }}>{card.value}</div>
            <div style={{ fontSize: 12, marginTop: 2, opacity: 0.9 }}>
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        style={{
          background: "#f8fafc",
          borderRadius: 12,
          padding: 16,
          marginBottom: 20,
          border: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <input
            style={{ ...inputStyle, flex: 1, minWidth: 180 }}
            type="text"
            placeholder="Search vehicle number..."
            value={vehicleFilter}
            onChange={(e) => setVehicleFilter(e.target.value)}
          />
          <input
            style={{ ...inputStyle, minWidth: 160 }}
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
          <select
            style={{ ...inputStyle, minWidth: 140 }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All sessions</option>
            <option value="active">Active only</option>
            <option value="completed">Completed only</option>
          </select>
          {(vehicleFilter || dateFilter || statusFilter !== "all") && (
            <button
              onClick={clearFilters}
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                border: "none",
                background: "#fee2e2",
                color: "#dc2626",
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#9ca3af",
            border: "2px dashed #e2e8f0",
            borderRadius: 12,
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>🅿️</div>
          <div style={{ fontSize: 16 }}>No records found</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>
            Try changing your filters
          </div>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}
          >
            <thead>
              <tr style={{ background: "#f1f5f9" }}>
                {[
                  "Vehicle",
                  "Slot",
                  "Check In",
                  "Check Out",
                  "Duration",
                  "Amount",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 14px",
                      textAlign: "left",
                      fontWeight: 600,
                      color: "#374151",
                      borderBottom: "2px solid #e2e8f0",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((log, i) => {
                const isActive = !log.checkOutTime;
                return (
                  <tr
                    key={log.id}
                    style={{ background: i % 2 === 0 ? "#fff" : "#f9fafb" }}
                  >
                    <td
                      style={{
                        padding: "12px 14px",
                        fontWeight: 600,
                        color: "#111827",
                      }}
                    >
                      {log.vehicleNumber}
                    </td>
                    <td style={{ padding: "12px 14px", color: "#6b7280" }}>
                      {log.slotId || "—"}
                    </td>
                    <td
                      style={{
                        padding: "12px 14px",
                        color: "#6b7280",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatTime(log.checkInTime)}
                    </td>
                    <td
                      style={{
                        padding: "12px 14px",
                        color: "#6b7280",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatTime(log.checkOutTime)}
                    </td>
                    <td style={{ padding: "12px 14px", color: "#6b7280" }}>
                      {getDuration(log.checkInTime, log.checkOutTime)}
                    </td>
                    <td
                      style={{
                        padding: "12px 14px",
                        fontWeight: 600,
                        color: "#111827",
                      }}
                    >
                      {log.amountCharged ? `₹${log.amountCharged}` : "—"}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 600,
                          background: isActive ? "#fef3c7" : "#dcfce7",
                          color: isActive ? "#92400e" : "#166534",
                        }}
                      >
                        {isActive ? "Active" : "Done"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Record count */}
      <p
        style={{
          marginTop: 16,
          color: "#9ca3af",
          fontSize: 13,
          textAlign: "right",
        }}
      >
        Showing {filtered.length} of {logs.length} records
      </p>
    </div>
  );
}
