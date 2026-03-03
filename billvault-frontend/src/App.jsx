import AuthorityPage from "./pages/AuthorityPage";
import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashboardLayout from "./layout/DashboardLayout";
import BillModal from "./components/BillModal";

import { auth } from "./firebase/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db } from "./firebase/firebaseConfig";

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc
} from "firebase/firestore";

import { FaTrash } from "react-icons/fa";

const AUTHORITY_EMAIL = "liyanashirin07@gmail.com";

function App() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState("dashboard");
  const [open, setOpen] = useState(false);
  const [displayBills, setDisplayBills] = useState([]);

  // 🔐 Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          await currentUser.reload();
          setUser(currentUser);
        } catch (error) {
          await signOut(auth);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 📦 Fetch Bills
  useEffect(() => {
    if (!user) return;
    fetchBills();
  }, [user]);

  const fetchBills = async () => {
    let q;

    if (user.email === AUTHORITY_EMAIL) {
      q = query(collection(db, "bills"));
    } else {
      q = query(
        collection(db, "bills"),
        where("clubName", "==", user.email.split("@")[0])
      );
    }

    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setDisplayBills(data);
  };

  // ➕ Add Bill
  const addBill = async (bill) => {
    await addDoc(collection(db, "bills"), bill);

    setDisplayBills(prev => [
      ...prev,
      {
        id: Date.now(),
        ...bill
      }
    ]);
  };

  // 🗑 Delete Bill
  const deleteBill = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this bill?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "bills", id));

      setDisplayBills(prev =>
        prev.filter(bill => bill.id !== id)
      );

    } catch (error) {
      console.error("Error deleting bill:", error);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Routes>

      <Route path="/" element={<Navigate to="/login" />} />

      <Route
        path="/login"
        element={
          user ? (
            user.email === AUTHORITY_EMAIL
              ? <Navigate to="/authority" />
              : <Navigate to="/dashboard" />
          ) : (
            <Login />
          )
        }
      />

      <Route path="/signup" element={<Signup />} />

      <Route
        path="/authority"
        element={
          user && user.email === AUTHORITY_EMAIL ? (
            <AuthorityPage
              logout={logout}
              displayBills={displayBills}
            />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          user && user.email !== AUTHORITY_EMAIL ? (
            <DashboardLayout setPage={setPage} logout={logout}>

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

              {page === "upload" && (
                <>
                  <h1>Upload Bill</h1>

                  {open && (
                    <BillModal
                      closeModal={() => setOpen(false)}
                      addBill={(bill) =>
                        addBill({
                          ...bill,
                          clubName: user.email.split("@")[0]
                        })
                      }
                    />
                  )}

                  <button onClick={() => setOpen(true)}>
                    Upload New Bill
                  </button>
                </>
              )}

              {page === "all" && (
                <>
                  <h1>All Bills</h1>

                  {displayBills.length === 0 ? (
                    <p>No bills found.</p>
                  ) : (
                    displayBills.map((bill) => (
                      <div key={bill.id} style={cardStyle}>

                        <div style={cardLeft}>
                          <h3 style={{ margin: 0 }}>{bill.eventName}</h3>
                          <p style={subText}>Club: {bill.clubName}</p>
                          <p style={subText}>Date: {bill.eventDate}</p>
                        </div>

                        <div style={rightSide}>
                          <div style={amountStyle}>
                            ₹{bill.amount}
                          </div>

                          <button
                            style={deleteBtn}
                            onClick={() => deleteBill(bill.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>

                      </div>
                    ))
                  )}
                </>
              )}

            </DashboardLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

    </Routes>
  );
}

export default App;

/* ================= STYLES ================= */

const cardStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "rgba(255,255,255,0.05)",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "20px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  transition: "0.3s ease"
};

const cardLeft = {
  display: "flex",
  flexDirection: "column",
  gap: "5px"
};

const subText = {
  margin: 0,
  opacity: 0.7,
  fontSize: "14px"
};

const rightSide = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: "10px"
};

const amountStyle = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#9d4edd"
};

const deleteBtn = {
  backgroundColor: "#ff4d4d",
  border: "none",
  color: "white",
  padding: "8px",
  borderRadius: "6px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};