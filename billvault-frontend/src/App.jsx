import { useState, useEffect } from "react";
import Login from "./pages/Login";
import DashboardLayout from "./layout/DashboardLayout";
import BillModal from "./components/BillModal";

function App() {

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [page, setPage] = useState("dashboard");
  const [open, setOpen] = useState(false);
  const [bills, setBills] = useState([]);
  const [displayBills, setDisplayBills] = useState([]);

  // Load bills
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("bills")) || [];
    setBills(stored);

    if (user?.role === "club") {
      setDisplayBills(
        stored.filter((bill) => bill.clubName === user.clubName)
      );
    } else {
      setDisplayBills(stored);
    }
  }, [user]);

  // Add bill
  const addBill = (bill) => {
    const updated = [...bills, bill];
    setBills(updated);
    localStorage.setItem("bills", JSON.stringify(updated));

    if (user?.role === "club") {
      setDisplayBills(
        updated.filter((b) => b.clubName === user.clubName)
      );
    } else {
      setDisplayBills(updated);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user) {
    return <Login setUser={setUser} />;
  }

  return (
    <DashboardLayout setPage={setPage}>

      <button onClick={logout} style={{ marginBottom: "20px" }}>
        Logout
      </button>

      {/* DASHBOARD */}
      {page === "dashboard" && (
        <>
          <h1>Dashboard</h1>
          <p>Total Bills: {displayBills.length}</p>
          <p>
            Total Amount: ₹
            {displayBills.reduce(
              (sum, bill) => sum + Number(bill.amount),
              0
            )}
          </p>
        </>
      )}

      {/* UPLOAD */}
      {page === "upload" && user?.role === "club" && (
        <>
          <h1>Upload Bill</h1>

          {open && (
            <BillModal
              closeModal={() => setOpen(false)}
              addBill={(bill) =>
                addBill({ ...bill, clubName: user.clubName })
              }
            />
          )}

          <button
            onClick={() => setOpen(true)}
            style={{
              padding: "10px",
              background: "#8e2de2",
              color: "white",
              border: "none",
              borderRadius: "5px"
            }}
          >
            Upload New Bill
          </button>
        </>
      )}

      {/* ALL BILLS */}
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
                <p><strong>Amount:</strong> ₹{bill.amount}</p>
              </div>
            ))
          )}
        </>
      )}

    </DashboardLayout>
  );
}

export default App;
