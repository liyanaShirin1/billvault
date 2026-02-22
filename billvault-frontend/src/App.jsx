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
  const sortBills = (type) => {
  let sorted = [...displayBills];

  if (type === "low") {
    sorted.sort((a, b) => Number(a.amount) - Number(b.amount));
  } else if (type === "high") {
    sorted.sort((a, b) => Number(b.amount) - Number(a.amount));
  }

  setDisplayBills(sorted);
};

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
    <DashboardLayout setPage={setPage} logout={logout}>

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

<div style={{ marginBottom: "20px" }}>
  <button
    onClick={() => sortBills("low")}
    style={{
      marginRight: "10px",
      padding: "8px",
      background: "#444",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer"
    }}
  >
    Low → High
  </button>

  <button
    onClick={() => sortBills("high")}
    style={{
      padding: "8px",
      background: "#444",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer"
    }}
  >
    High → Low
  </button>
</div>

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
                {bill.image && (
  <img
    src={bill.image}
    alt="Bill"
    style={{
      width: "200px",
      marginTop: "10px",
      borderRadius: "8px"
    }}
  />
)}
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
