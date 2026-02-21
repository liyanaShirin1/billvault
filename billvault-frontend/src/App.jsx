import { useState, useEffect } from "react";
import Login from "./pages/Login";
import DashboardLayout from "./layout/DashboardLayout";
import BillModal from "./components/BillModal";

function App() {
  // ================= USER STATE =================
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // ================= APP STATE =================
  const [page, setPage] = useState("dashboard");
  const [open, setOpen] = useState(false);
  const [bills, setBills] = useState([]);
  const [displayBills, setDisplayBills] = useState([]);

  // ================= LOAD BILLS ON MOUNT =================
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("bills")) || [];
    setBills(stored);
  }, []);

  // ================= FILTER BILLS BASED ON ROLE =================
  useEffect(() => {
    if (user?.role === "club") {
      setDisplayBills(
        bills.filter((bill) => bill.clubName === user.clubName)
      );
    } else {
      setDisplayBills(bills);
    }
  }, [bills, user]);

  // ================= ADD BILL =================
  const addBill = (bill) => {
    const newBill = {
      ...bill,
      id: Date.now(), // unique id
      clubName: user.clubName,
    };

    const updated = [...bills, newBill];
    setBills(updated);
    localStorage.setItem("bills", JSON.stringify(updated));
  };

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user) {
    return <Login setUser={setUser} />;
  }

  return (
    <DashboardLayout user={user} setPage={setPage} page={page}>
      <button
        onClick={logout}
        style={{
          marginBottom: "20px",
          padding: "8px 14px",
          background: "#ff4d4f",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Logout
      </button>

      {/* ================= DASHBOARD ================= */}
      {page === "dashboard" && (
        <>
          <h1>Dashboard</h1>
          <p>Total Bills: {displayBills.length}</p>
          <p>
            Total Amount: ₹
            {displayBills
              .reduce((sum, bill) => sum + Number(bill.amount), 0)
              .toLocaleString("en-IN")}
          </p>
        </>
      )}

      {/* ================= UPLOAD ================= */}
      {page === "upload" && user.role === "club" && (
        <>
          <h1>Upload Bill</h1>

          {open && (
            <BillModal
              closeModal={() => setOpen(false)}
              addBill={addBill}
            />
          )}

          <button
            onClick={() => setOpen(true)}
            style={{
              padding: "10px 16px",
              background: "#8e2de2",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Upload New Bill
          </button>
        </>
      )}

      {/* ================= ALL BILLS ================= */}
      {page === "all" && (
        <>
          <h1>All Bills</h1>

          {displayBills.length === 0 ? (
            <p>No bills found.</p>
          ) : (
            displayBills.map((bill) => (
              <div
                key={bill.id}
                style={{
                  background: "#1f1f1f",
                  padding: "15px",
                  borderRadius: "8px",
                  marginBottom: "15px"
                }}
              >
                <p><strong>Club:</strong> {bill.clubName}</p>
                <p><strong>Event:</strong> {bill.eventName}</p>
                <p><strong>Date:</strong> {bill.eventDate}</p>
                <p>
                  <strong>Amount:</strong> ₹
                  {Number(bill.amount).toLocaleString("en-IN")}
                </p>
              </div>
            ))
          )}
        </>
      )}
    </DashboardLayout>
  );
}

export default App;