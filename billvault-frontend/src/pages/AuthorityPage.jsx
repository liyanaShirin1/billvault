import { useState } from "react";

function AuthorityPage({ displayBills = [], logout }) {

  const [selectedClub, setSelectedClub] = useState(null);

  const clubs = [...new Set(displayBills.map(bill => bill.clubName))];

  const filteredBills = selectedClub
    ? displayBills.filter(bill => bill.clubName === selectedClub)
    : displayBills;

  return (
    <div style={containerStyle}>

      {/* HEADER */}

      <div style={headerStyle}>
        <h1 style={titleStyle}>Authority Dashboard</h1>

        <button onClick={logout} style={logoutBtn}>
          Logout
        </button>
      </div>


      {/* CLUB FILTER */}

      <h2 style={sectionTitle}>Clubs</h2>

      <div style={clubsRow}>

        <div
          style={{
            ...clubPill,
            background: selectedClub === null ? "#8e2de2" : "rgba(255,255,255,0.08)"
          }}
          onClick={() => setSelectedClub(null)}
        >
          All
        </div>

        {clubs.map((club, index) => (
          <div
            key={index}
            style={{
              ...clubPill,
              background: selectedClub === club ? "#8e2de2" : "rgba(255,255,255,0.08)"
            }}
            onClick={() => setSelectedClub(club)}
          >
            {club}
          </div>
        ))}

      </div>


      {/* BILLS */}

      <h2 style={sectionTitle}>Bills</h2>

      <div style={tableContainer}>

        <div style={tableHeader}>
          <span>Event</span>
          <span>Date</span>
          <span>Club</span>
          <span>Amount</span>
        </div>

        {filteredBills.map((bill) => (

          <div key={bill.id} style={tableRow}>

            <span>{bill.eventName}</span>

            <span>{bill.eventDate}</span>

            <span>{bill.clubName}</span>

            <span style={amountStyle}>
              ₹{bill.amount}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}

export default AuthorityPage;



/* ================= STYLES ================= */

const containerStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg,#1e1e2f,#2b0f3a,#0f0c29)",
  color: "white",
  padding: "60px 120px"
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "50px"
};

const titleStyle = {
  fontSize: "40px"
};

const logoutBtn = {
  padding: "10px 20px",
  borderRadius: "8px",
  border: "none",
  background: "linear-gradient(to right,#8e2de2,#4a00e0)",
  color: "white",
  cursor: "pointer"
};

const sectionTitle = {
  fontSize: "26px",
  marginBottom: "20px"
};

const clubsRow = {
  display: "flex",
  gap: "15px",
  flexWrap: "wrap",
  marginBottom: "50px"
};

const clubPill = {
  padding: "10px 20px",
  borderRadius: "20px",
  cursor: "pointer",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.1)"
};

const tableContainer = {
  width: "100%",
  maxWidth: "900px"
};

const tableHeader = {
  display: "grid",
  gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
  padding: "12px",
  borderBottom: "2px solid rgba(255,255,255,0.2)",
  fontWeight: "bold"
};

const tableRow = {
  display: "grid",
  gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
  padding: "12px",
  borderBottom: "1px solid rgba(255,255,255,0.1)"
};

const amountStyle = {
  color: "#c77dff",
  fontWeight: "bold"
};