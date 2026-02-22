export default function DashboardLayout({ children, setPage, logout }) {
  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* Sidebar */}
      <div
        style={{
          width: "220px",
          background: "#1f1f1f",
          color: "white",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        {/* Top Section */}
        <div>
          <h3 style={{ marginBottom: "30px", textAlign: "center" }}>
            Menu
          </h3>

          <div
            onClick={() => setPage("dashboard")}
            style={{ cursor: "pointer", marginBottom: "15px" }}
          >
            Dashboard
          </div>

          <div
            onClick={() => setPage("upload")}
            style={{ cursor: "pointer", marginBottom: "15px" }}
          >
            Upload Bills
          </div>

          <div
            onClick={() => setPage("all")}
            style={{ cursor: "pointer" }}
          >
            All Bills
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          style={{
            width: "100%",
            padding: "10px",
            background: "#8e2de2",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          background: "#121212",
          color: "white",
          padding: "30px"
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "40px" }}>
          BillVault
        </h1>

        {children}
      </div>

    </div>
  );
}