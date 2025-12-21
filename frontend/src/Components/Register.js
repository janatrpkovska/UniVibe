import React, { useState } from "react";

const Register = () => {
  const [form, setForm] = useState({
    FirstName: "",
    LastName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <div className="left-panel">
          <img
            src="logo.png"
            alt="Illustration"
          />
        </div>

        <div className="right-panel">
          <h2>Регистрирај се</h2>

          <form onSubmit={handleSubmit}>
            <div className="grid">
              <input name="fullName" placeholder="Име" onChange={handleChange} required />
              <input name="position" placeholder="Презиме" onChange={handleChange} />

              <input type="email" name="email" placeholder="Е-пошта" onChange={handleChange} required />
              <input name="phone" placeholder="Телефон" onChange={handleChange} />

              <input name="country" placeholder="Држава" onChange={handleChange} />
              <input name="city" placeholder="Град" onChange={handleChange} />

              <input type="password" name="Password" placeholder="Лозинка" onChange={handleChange} required />
              <input type="password" name="Confirm-password" placeholder="Повтори лозинка" onChange={handleChange} required />
            </div>

            <div className="gender">
            </div>

            <button type="submit">Регистрирај се</button>
          </form>
        </div>
      </div>

      <style>{`
        .register-wrapper {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f3f4f6;
        }

        .register-card {
          width: 1000px;
          max-width: 95%;
          background: white;
          border-radius: 20px;
          display: flex;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .left-panel {
          flex: 1;
          background: linear-gradient(180deg, #7c3aed, #5b21b6);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .left-panel img {
          width: 80%;
        }

        .right-panel {
          flex: 1.2;
          padding: 40px;
        }

        .right-panel h2 {
          margin-bottom: 25px;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .grid input {
          padding: 12px;
          border-radius: 10px;
          border: none;
          background: #f1f5f9;
        }

        .grid input:focus {
          outline: 2px solid #6366f1;
        }

        .gender {
          display: flex;
          gap: 15px;
          margin: 20px 0;
          font-size: 14px;
        }

        .gender label {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .register-wrapper button {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 14px;
          background: #2563eb;
          color: white;
          font-size: 15px;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .register-card {
            flex-direction: column;
          }

          .left-panel {
            display: none;
          }

          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Register;