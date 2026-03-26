import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [ firstName, setFirstName ] = useState("")
  const [ lastName, setLastName ] = useState("")
  const [ email, setEmail ] = useState("")
  const [ username, setUsername ] = useState("")
  const [ telephone, setTelephone ] = useState ("")
  const [ city, setCity] = useState("")
  const [ password, setPassword] = useState("")
  const [ invalidTelephone, setInvalidTelephone ] = useState(false)
  const [ notSamePassword, setNotSamePassword] = useState(false)
  const [ wrongData, setWrongData ] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();

    const body = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      username: username,
      telephone: telephone,
      city: city,
      password: password
    }
    if(invalidTelephone || notSamePassword)
      setWrongData(true)
    else{
      axios.post("http://localhost:9091/api/user/public/create-user", body).then(res=>{if(res.status===200) navigate('/')}
      ).catch(error=>console.error(error))
    }
  };

  const checkPhoneNumber = (telephone) =>{
    if(telephone.length===0){
      setInvalidTelephone(false)
      return
    }
    if (/^\d+$/.test(telephone)) {
      if(telephone.charAt(0)!== '0' && telephone.charAt(1)!=='7'){
        setInvalidTelephone(true)
      }
      else{
        if(telephone.length !== 9)
          setInvalidTelephone(true)
        else{
          setInvalidTelephone(false)
        }
      }
    } else {
      setInvalidTelephone(true);
    }
  }

  const checkPassword = (confirmPassword) => {
    if(password !== confirmPassword && confirmPassword.length>0)
      setNotSamePassword(true)
    else{
      setNotSamePassword(false)
    }
  }

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
              <input name="fullName" placeholder="Име" onChange={(e)=>setFirstName(e.target.value)} required />
              <input name="position" placeholder="Презиме" onChange={(e)=>setLastName(e.target.value)} />

              <input type="email" name="email" placeholder="Е-пошта" onChange={(e)=>setEmail(e.target.value)} required />
              <input name="username" placeholder="Корисничко име" onChange={(e)=>setUsername(e.target.value)} />

              <input name="phone" style={{outline: invalidTelephone?'2px solid red':''}} placeholder="Телефон (07x)" onChange={(e)=>{setTelephone(e.target.value); checkPhoneNumber(e.target.value)}} />
              <input name="city" placeholder="Град" onChange={(e)=>setCity(e.target.value)} />

              <input type="password" name="Password" placeholder="Лозинка" onChange={(e)=>setPassword(e.target.value)} required />
              <input type="password" style={{outline: notSamePassword?'2px solid red':''}} name="Confirm-password" placeholder="Повтори лозинка" onChange={(e)=>checkPassword(e.target.value)} required />
              {wrongData && <div style={{color: 'red'}}>Погрешни податоци!</div>}
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