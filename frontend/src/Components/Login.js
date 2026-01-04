import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../util/AuthProvider";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth()
  const navigate = useNavigate()


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ username, password });

    await axios.post("http://localhost:9091/api/auth/login", {
      "username": username,
      "password": password
    }).then(res=>{
      login(res.data)
      navigate("/")
    }
    ).catch(err=>console.error(err))
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="left-panel">
          <img
            src="logo.png"
            alt="Illustration"
          />
        </div>

        <div className="right-panel">
          <NavLink to="/register" style={{ textDecoration: "none" }}>
          <p className="register-text">
             <span>Регистрирај се</span>
          </p>
          </NavLink>

          <h2>Најави се</h2>
          <p className="subtitle"></p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Внесете корисничко име"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Лозинка"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Најави се</button>
          </form>

        </div>
      </div>

      <style>{`
        .login-wrapper {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
        }

        .login-card {
          width: 900px;
          max-width: 95%;
          height: 520px;
          background: #fff;
          border-radius: 20px;
          display: flex;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .left-panel {
          flex: 1;
          background: linear-gradient(180deg, #6366f1, #a855f7);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .left-panel img {
          width: 80%;
        }

        .right-panel {
          flex: 1;
          padding: 40px 50px;
          display: flex;
          flex-direction: column;
        }

        .register-text {
          font-size: 13px;
          text-align: right;
          color: #6b7280;
        }

        .register-text span {
          color: #6366f1;
          cursor: pointer;
          font-weight: 600;
        }

        .right-panel h2 {
          margin-top: 30px;
          margin-bottom: 5px;
        }

        .subtitle {
          color: #6b7280;
          margin-bottom: 30px;
        }

        .right-panel input {
          width: 100%;
          padding: 12px 14px;
          margin-bottom: 15px;
          border-radius: 10px;
          border: none;
          background: #f1f5f9;
          font-size: 14px;
        }

        .right-panel input:focus {
          outline: 2px solid #6366f1;
        }

        .recovery {
          font-size: 13px;
          text-align: right;
          margin-bottom: 20px;
          color: #6b7280;
          cursor: pointer;
        }

        .right-panel button[type="submit"] {
          width: 100%;
          padding: 14px;
          background: #f87171;
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 15px;
          cursor: pointer;
        }

        .divider {
          text-align: center;
          margin: 25px 0 15px;
          font-size: 13px;
          color: #6b7280;
        }

        .socials {
          display: flex;
          justify-content: center;
          gap: 15px;
        }

        .socials button {
          width: 45px;
          height: 45px;
          border-radius: 12px;
          border: none;
          background: #f1f5f9;
          font-size: 18px;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .login-card {
            flex-direction: column;
            height: auto;
          }

          .left-panel {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;