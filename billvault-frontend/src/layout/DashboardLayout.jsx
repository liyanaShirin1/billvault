export default function DashboardLayout({ children, setPage, logout, page }) {
  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* Sidebar */}
      <div
        style={{
          width: "280px",
          background: "#1f1f1f",
          color: "white",
          padding: "25px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        {/* Menu Section */}
        <div>

          <h3
            style={{
              marginBottom: "30px",
              textAlign: "center",
              letterSpacing: "1px"
            }}
          >
            Menu
          </h3>

          <div
            onClick={() => setPage("dashboard")}
            style={{
              ...menuStyle,
              ...(page === "dashboard" && activeStyle)
            }}
          >
            Dashboard
          </div>

          <div
            onClick={() => setPage("upload")}
            style={{
              ...menuStyle,
              ...(page === "upload" && activeStyle)
            }}
          >
            Upload Bills
          </div>

          <div
            onClick={() => setPage("all")}
            style={{
              ...menuStyle,
              ...(page === "all" && activeStyle)
            }}
          >
            All Bills
          </div>

        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          style={logoutStyle}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          background: "linear-gradient(135deg, #1e1e2f, #2b0f3a, #0f0c29)",
          color: "white",
          display: "flex",
          flexDirection: "column"
        }}
      >

        {/* Crescent Header */}
        <div style={crescentStyle}>
          BillVault
        </div>

        {/* Centered Content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {children}
        </div>

      </div>

    </div>
  );
}

/* ================= STYLES ================= */

const menuStyle = {
  cursor: "pointer",
  marginBottom: "20px",
  fontSize: "18px",
  padding: "8px 10px",
  borderRadius: "6px"
};

const activeStyle = {
  background: "rgba(142,45,226,0.2)",
  borderLeft: "4px solid #8e2de2",
  paddingLeft: "10px",
  fontWeight: "bold"
};

const logoutStyle = {
  width: "100%",
  padding: "12px",
  background: "linear-gradient(to right, #8e2de2, #4a00e0)",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

const crescentStyle = {
  width: "100%",          // 🔥 changed from fixed 1250px
  maxWidth: "1250px",     // keeps it large but responsive
  height: "150px",
  background: "linear-gradient(to right, #8e2de2, #4a00e0)",
  borderBottomLeftRadius: "200px",
  borderBottomRightRadius: "200px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "50px",
  fontWeight: "bold",
  boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
  fontFamily: "'Courier New', monospace",
};