import AuthorityPage from "./pages/AuthorityPage";
import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState("dashboard");
  const [open, setOpen] = useState(false);
  const [displayBills, setDisplayBills] = useState([]);

  /* ================= AUTH LISTENER ================= */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {

      if (currentUser) {

        try {
          await currentUser.reload();
          setUser(currentUser);
        }

        catch (error) {
          await signOut(auth);
          setUser(null);
        }

      }

      else {
        setUser(null);
      }

      setLoading(false);

    });

    return () => unsubscribe();

  }, []);

  /* ================= FETCH BILLS ================= */

  useEffect(() => {
    if (!user) return;
    fetchBills();
  }, [user]);

  const fetchBills = async () => {

    let q;

    if (user.email === AUTHORITY_EMAIL) {

      q = query(collection(db, "bills"));

    }

    else {

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

  /* ================= ADD BILL ================= */

  const addBill = async (bill) => {

    console.log("Saving bill:", bill);

    await addDoc(collection(db, "bills"), bill);

    console.log("Bill saved!");

    fetchBills();

  };

  /* ================= DELETE BILL ================= */

  const deleteBill = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this bill?"
    );

    if (!confirmDelete) return;

    try {

      await deleteDoc(doc(db, "bills", id));

      fetchBills();

    }

    catch (error) {

      console.error("Error deleting bill:", error);

    }

  };

  /* ================= LOGOUT ================= */

  const logout = async () => {

    try {

      await signOut(auth);

      setUser(null);

      navigate("/login");

    }

    catch (error) {

      console.error("Logout error:", error);

    }

  };

  if (loading) return <p>Loading...</p>;

  return (

    <Routes>

      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      {/* ================= AUTHORITY PAGE ================= */}

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

      {/* ================= CLUB DASHBOARD ================= */}

      <Route
        path="/dashboard"
        element={
          user && user.email !== AUTHORITY_EMAIL ? (

            <DashboardLayout
              setPage={setPage}
              logout={logout}
              page={page}
            >

{/* ================= DASHBOARD ================= */}

{page === "dashboard" && user && (

  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "40px",
      textAlign: "center"
    }}
  >

    <h1 style={{ fontSize: "32px" }}>
      Welcome back, {user.email.split("@")[0]} 👋
    </h1>

    <div
      style={{
        display: "flex",
        gap: "40px",
        justifyContent: "center",
        flexWrap: "wrap"
      }}
    >

      <div style={statsCard}>
        <h3>Total Bills</h3>
        <p style={bigNumber}>{displayBills.length}</p>
      </div>

      <div style={statsCard}>
        <h3>Total Amount</h3>
        <p style={bigNumber}>
          ₹{
            displayBills.reduce(
              (sum, bill) => sum + Number(bill.amount),
              0
            )
          }
        </p>
      </div>

    </div>

  </div>

)}

{/* ================= UPLOAD PAGE ================= */}

{page === "upload" && (

  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "30px"
    }}
  >

    <h1 style={{ fontSize: "40px" }}>
      Upload Bill
    </h1>

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

    <button
      onClick={() => setOpen(true)}
      style={uploadButton}
    >
      Upload New Bill
    </button>

  </div>

)}

{/* ================= ALL BILLS ================= */}

{page === "all" && (

  <div
    style={{
      width: "100%",
      padding: "40px 80px",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "25px"
    }}
  >

    <h1 style={{ fontSize: "42px" }}>
      All Bills
    </h1>

    {displayBills.length === 0 ? (

      <p>No bills found.</p>

    ) : (

      displayBills.map((bill) => (

        <div key={bill.id} style={cardStyle}>

          <div style={cardLeft}>

            <h3 style={{ margin: 0 }}>
              {bill.eventName}
            </h3>

            <p style={subText}>
              Club: {bill.clubName}
            </p>

            <p style={subText}>
              Date: {bill.eventDate}
            </p>

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

  </div>

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

/* ================= STYLES ================= */

const statsCard = {
  background: "rgba(255,255,255,0.07)",
  backdropFilter: "blur(10px)",
  padding: "30px",
  borderRadius: "16px",
  minWidth: "220px",
  textAlign: "center",
  boxShadow: "0 8px 20px rgba(0,0,0,0.4)"
};

const bigNumber = {
  fontSize: "32px",
  fontWeight: "bold",
  marginTop: "10px",
  color: "#c77dff"
};

const cardStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "rgba(255,255,255,0.05)",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "20px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
};

const cardLeft = {
  display: "flex",
  flexDirection: "column",
  gap: "20px"
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

const uploadButton = {
  padding: "14px 28px",
  fontSize: "16px",
  background: "linear-gradient(to right, #8e2de2, #4a00e0)",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  boxShadow: "0 8px 20px rgba(0,0,0,0.4)"
};

export default App;