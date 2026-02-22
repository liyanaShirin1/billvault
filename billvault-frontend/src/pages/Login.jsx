import { useState } from "react";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Hardcoded users (for demo)
 const handleLogin = () => {
  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  // Default test password
  if (password !== "1234") {
    alert("Wrong password (Use 1234)");
    return;
  }

  // Only allow gmail accounts
  if (!email.endsWith("@gmail.com")) {
    alert("Only Gmail accounts allowed");
    return;
  }

  const userData = {
    email,
    role: email === "authority@gmail.com" ? "authority" : "club",
    clubName: email.split("@")[0]
  };

  localStorage.setItem("user", JSON.stringify(userData));
  setUser(userData);
};
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#121212",
        color: "white"
      }}
    >
      <div
        style={{
          background: "#1f1f1f",
          padding: "40px",
          borderRadius: "10px",
          textAlign: "center",
          width: "300px"
        }}
      >
        <h2>Login</h2>

        <input
          placeholder="Email eg:billvault06@gmail.com"
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "15px" }}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "15px" }}
        />

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "10px",
            background: "#8e2de2",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;