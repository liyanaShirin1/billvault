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
  where
} from "firebase/firestore";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState("dashboard");
  const [open, setOpen] = useState(false);
  const [displayBills, setDisplayBills] = useState([]);

  // 🔐 Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 📦 Fetch Bills
  useEffect(() => {
    const fetchBills = async () => {
      if (!user) return;

      let q;

      if (user.email === "authority@gmail.com") {
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

    fetchBills();
  }, [user]);

  const addBill = async (bill) => {
    await addDoc(collection(db, "bills"), bill);
  };

  const logout = async () => {
    await signOut(auth);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Routes>

      {/* Default */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Public Routes */}
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" /> : <Login />}
      />

      <Route
        path="/signup"
        element={user ? <Navigate to="/dashboard" /> : <Signup />}
      />

      {/* Protected Dashboard */}
      <Route
        path="/dashboard"
        element={
          user ? (
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
                  {displayBills.map((bill) => (
                    <div key={bill.id}>
                      <p>Club: {bill.clubName}</p>
                      <p>Event: {bill.eventName}</p>
                      <p>Date: {bill.eventDate}</p>
                      <p>Amount: ₹{bill.amount}</p>
                    </div>
                  ))}
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