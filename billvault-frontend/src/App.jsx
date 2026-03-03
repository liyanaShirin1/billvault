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
  where
} from "firebase/firestore";

const AUTHORITY_EMAIL = "liyanashirin07@gmail.com";

function App() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState("dashboard");
  const [open, setOpen] = useState(false);
  const [displayBills, setDisplayBills] = useState([]);

  // 🔐 Listen for auth changes
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      try {
        await currentUser.reload(); // force refresh user from Firebase
        setUser(currentUser);
      } catch (error) {
        console.log("User no longer exists.");
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

  // 📦 Fetch bills when user logs in
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

  const logout = async () => {
    await signOut(auth);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Routes>

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Login Route */}
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

      {/* ✅ Signup Route (NO REDIRECT LOGIC HERE) */}
      <Route
        path="/signup"
        element={<Signup />}
      />

      {/* Authority Route */}
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

      {/* Club Dashboard Route */}
      <Route
        path="/dashboard"
        element={
          user && user.email !== AUTHORITY_EMAIL ? (
            <DashboardLayout setPage={setPage} logout={logout}>

              {/* Dashboard */}
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

              {/* Upload */}
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

              {/* All Bills */}
              {page === "all" && (
                <>
                  <h1>All Bills</h1>

                  {displayBills.length === 0 ? (
                    <p>No bills found.</p>
                  ) : (
                    displayBills.map((bill) => (
                      <div key={bill.id}>
                        <p>Club: {bill.clubName}</p>
                        <p>Event: {bill.eventName}</p>
                        <p>Date: {bill.eventDate}</p>
                        <p>Amount: ₹{bill.amount}</p>
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