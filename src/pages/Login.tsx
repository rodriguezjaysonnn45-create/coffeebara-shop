import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import { apiUrl } from "../utils/api";

const Login: React.FC = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(apiUrl('/api/login'), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      login(data.user);
      localStorage.setItem("coffeebaraUser", JSON.stringify(data.user));

      alert(`Welcome back, ${data.user.name}!`);
      navigate("/");
    } catch (error: any) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <section className="auth">
      <div className="auth-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <button type="submit">Login</button>
        </form>
        <p>Don’t have an account? <Link to="/signup">Sign up</Link></p>
      </div>
    </section>
  );
};

export default Login;
