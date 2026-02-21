import { useState } from "react";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("club");

  const handleLogin = () => {
    if (!email) {
      alert("Enter email");
      return;
    }

    const userData = {
      email,
      role,
      clubName: role === "club" ? email.split("@")[0] : null
    };

    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  return (
    <div style={{ padding: "50px", textAlign: "center", color: "white" }}>
      <h2>Login</h2>

      <select onChange={(e) => setRole(e.target.value)}>
        <option value="club">Club</option>
        <option value="authority">Authority</option>
      </select>

      <br /><br />

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
