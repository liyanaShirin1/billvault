function DashboardLayout({ children, setPage, page, user }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#121212", color: "white" }}>
      
      {/* ================= SIDEBAR ================= */}
      <div
        style={{
          width: "220px",
          background: "#1e1e1e",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "15px"
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Finance Panel</h2>

        <button
          onClick={() => setPage("dashboard")}
          style={navButtonStyle(page === "dashboard")}
        >
          Dashboard
        </button>

        {user.role === "club" && (
          <button
            onClick={() => setPage("upload")}
            style={navButtonStyle(page === "upload")}
          >
            Upload Bill
          </button>
        )}

        <button
          onClick={() => setPage("all")}
          style={navButtonStyle(page === "all")}
        >
          All Bills
        </button>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div style={{ flex: 1, padding: "40px" }}>
        {children}
      </div>
    </div>
  );
}

// ================= NAV BUTTON STYLE =================
const navButtonStyle = (active) => ({
  padding: "10px",
  background: active ? "#8e2de2" : "#333",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  textAlign: "left"
});

export default DashboardLayout;