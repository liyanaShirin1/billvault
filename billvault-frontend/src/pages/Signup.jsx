import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await signOut(auth);

      alert("Account created successfully! Please login.");
      navigate("/login");

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>

        <h2 style={titleStyle}>BILLVAULT SIGNUP</h2>
        <p style={subtitleStyle}>Create Secure Account</p>

        <div style={divider}></div>

        <form onSubmit={handleSignup} style={formStyle}>

          <label style={labelStyle}>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>Password</label>
          <input
            type="password"
            required
            minLength="6"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          <button type="submit" style={buttonStyle}>
            CREATE ACCOUNT
          </button>

        </form>

        <div style={divider}></div>

        <p style={footerText}>
          Already have an account?{" "}
          <Link to="/login" style={linkStyle}>
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Signup;

/* ================= RECEIPT STYLE ================= */

const containerStyle = {
  minHeight: "100vh",
  width: "100%",
  background: "black",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "'Courier New', monospace"
};

const cardStyle = {
  background: "#eaeaea",
  padding: "40px",
  width: "420px",
  borderRadius: "6px",
  boxShadow: "0 15px 40px rgba(0,0,0,0.6)",
  textAlign: "center"
};

const titleStyle = {
  letterSpacing: "4px",
  marginBottom: "5px"
};

const subtitleStyle = {
  fontSize: "13px",
  marginBottom: "20px"
};

const divider = {
  borderTop: "2px dashed black",
  margin: "20px 0"
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  textAlign: "left"
};

const labelStyle = {
  fontSize: "14px"
};

const inputStyle = {
  border: "none",
  borderBottom: "1px dashed black",
  background: "transparent",
  padding: "6px 0",
  fontFamily: "'Courier New', monospace",
  outline: "none"
};

const buttonStyle = {
  marginTop: "20px",
  padding: "12px",
  background: "black",
  color: "white",
  border: "none",
  cursor: "pointer",
  letterSpacing: "2px",
  fontFamily: "'Courier New', monospace"
};

const footerText = {
  fontSize: "13px"
};

const linkStyle = {
  textDecoration: "none",
  fontWeight: "bold",
  color: "black"
};