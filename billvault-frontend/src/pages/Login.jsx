import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const AUTHORITY_EMAIL = "liyanashirin07@gmail.com";
  const [role, setRole] = useState("club");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const loggedInUser = userCredential.user;

      if (role === "authority" && loggedInUser.email !== AUTHORITY_EMAIL) {
        alert("You are not authorized as Authority.");
        return;
      }

      if (role === "club" && loggedInUser.email === AUTHORITY_EMAIL) {
        alert("Please select Authority to login.");
        return;
      }

      if (loggedInUser.email === AUTHORITY_EMAIL) {
        navigate("/authority");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      alert(error.message);
    }
  };

  

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>

        {/* Receipt Header */}
        <div style={receiptHeader}>
          <h2 style={titleStyle}>BILLVAULT LOGIN</h2>
          <p style={subText}>Secure Access Portal</p>
        </div>

        <div style={tearLine}></div>

        {/* Role Toggle */}
        <div style={roleToggleStyle}>
          <button
            style={{
              ...roleButtonStyle,
              background: role === "club" ? "black" : "transparent",
              color: role === "club" ? "white" : "black"
            }}
            onClick={() => setRole("club")}
          >
            Club
          </button>

          <button
            style={{
              ...roleButtonStyle,
              background: role === "authority" ? "black" : "transparent",
              color: role === "authority" ? "white" : "black"
            }}
            onClick={() => setRole("authority")}
          >
            Authority
          </button>
        </div>

        <form onSubmit={handleLogin} style={formStyle}>
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          <button type="submit" style={buttonStyle}>
            LOGIN
          </button>
        </form>

        <div style={tearLine}></div>

        <p style={signupText}>
          Don't have an account?{" "}
          <Link to="/signup" style={signupLink}>
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;

/* ================= RECEIPT STYLES ================= */

const containerStyle = {
  minHeight: "100vh",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(to right, #682b68, #28184c)",
  fontFamily: "'Courier New', monospace"
};

const cardStyle = {
  background: "white",
  padding: "60px 30px",
  width: "350px",
  boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
  borderRadius: "4px"
};

const receiptHeader = {
  textAlign: "center",
  marginBottom: "20px"
};

const titleStyle = {
  fontSize: "40px",
  letterSpacing: "3px",
  marginBottom: "5px"
};

const subText = {
  fontSize: "15px",
  color: "#666"
};

const tearLine = {
  borderTop: "2px dashed black",
  margin: "20px 0"
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px"
};

const inputStyle = {
  border: "none",
  borderBottom: "1px dashed black",
  padding: "8px 0",
  fontFamily: "'Courier New', monospace",
  fontSize: "14px",
  outline: "none",
  background: "transparent"
};

const buttonStyle = {
  marginTop: "15px",
  padding: "10px",
  background: "black",
  color: "white",
  border: "none",
  cursor: "pointer",
  fontFamily: "'Courier New', monospace",
  letterSpacing: "2px"
};

const signupText = {
  marginTop: "10px",
  textAlign: "center",
  fontSize: "13px"
};

const signupLink = {
  textDecoration: "none",
  fontWeight: "bold",
  color: "black"
};

const roleToggleStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "10px"
};

const roleButtonStyle = {
  padding: "6px 12px",
  border: "1px dashed black",
  cursor: "pointer",
  fontFamily: "'Courier New', monospace"
};