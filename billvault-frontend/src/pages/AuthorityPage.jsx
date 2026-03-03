import { useState } from "react";

function AuthorityPage({ displayBills = [], logout }) {

  const [selectedClub, setSelectedClub] = useState(null);
  const [sortedBills, setSortedBills] = useState([]);

  // Get unique club names
  const clubs = [...new Set(displayBills.map(bill => bill.clubName))];

  const handleClubClick = (club) => {
    setSelectedClub(club);
    const clubBills = displayBills.filter(
      bill => bill.clubName === club
    );
    setSortedBills(clubBills);
  };

  const sortBills = (type) => {
    let sorted = [...sortedBills];

    if (type === "low") {
      sorted.sort((a, b) => Number(a.amount) - Number(b.amount));
    } else {
      sorted.sort((a, b) => Number(b.amount) - Number(a.amount));
    }

    setSortedBills(sorted);
  };

  return (
    <div style={containerStyle}>

      <div style={headerStyle}>
        <h1>Authority Panel</h1>
        <button onClick={logout} style={logoutBtn}>
          Logout
        </button>
      </div>

      {!selectedClub ? (
        <>
          <h2>Clubs</h2>

          {clubs.length === 0 ? (
            <p>No clubs found.</p>
          ) : (
            clubs.map((club, index) => (
              <div
                key={index}
                style={clubCard}
                onClick={() => handleClubClick(club)}
              >
                {club}
              </div>
            ))
          )}
        </>
      ) : (
        <>
          <button
            onClick={() => setSelectedClub(null)}
            style={backBtn}
          >
            ← Back
          </button>

          <h2>{selectedClub} Bills</h2>

          <div style={{ marginBottom: "20px" }}>
            <button onClick={() => sortBills("low")} style={sortBtn}>
              Low → High
            </button>
            <button onClick={() => sortBills("high")} style={sortBtn}>
              High → Low
            </button>
          </div>

          {sortedBills.map((bill) => (
            <div key={bill.id} style={billCard}>
              <p><strong>Event:</strong> {bill.eventName}</p>
              <p><strong>Date:</strong> {bill.eventDate}</p>
              <p><strong>Amount:</strong> ₹{bill.amount}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default AuthorityPage;



/* ================= STYLES ================= */

const containerStyle = {
  minHeight: "100vh",
  backgroundColor: "#0e0e0e",
  color: "white",
  padding: "40px"
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px"
};

const logoutBtn = {
  padding: "8px 16px",
  borderRadius: "6px",
  border: "none",
  background: "#9d4edd",
  color: "white",
  cursor: "pointer"
};

const clubCard = {
  padding: "15px",
  marginBottom: "15px",
  background: "rgba(255,255,255,0.05)",
  borderRadius: "8px",
  cursor: "pointer"
};

const billCard = {
  padding: "15px",
  marginBottom: "15px",
  background: "rgba(255,255,255,0.05)",
  borderRadius: "8px"
};

const backBtn = {
  marginBottom: "20px",
  padding: "8px 16px",
  borderRadius: "6px",
  border: "none",
  background: "#444",
  color: "white",
  cursor: "pointer"
};

const sortBtn = {
  marginRight: "10px",
  padding: "8px 14px",
  borderRadius: "6px",
  border: "none",
  background: "#444",
  color: "white",
  cursor: "pointer"
};