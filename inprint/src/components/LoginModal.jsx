import React, { useState, useContext } from "react";
import ErrorMessage from "./ErrorMessage";
import { UserContext } from "../context/UserContext";

// Componente que se encarga de la funcionalidad de "Iniciar Sesión"
const LoginModal = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [, setToken] = useContext(UserContext);
  const CryptoJS = require("crypto-js");
  const salt = "farm1990M0O";
  const salt1 = "f1nd1ngn3m0";
  let hashPassword = CryptoJS.SHA256(salt1 + password + salt).toString();

  const submitLogin = async () => {
    // VARIABLES
    let endpoint = "http://localhost:8000/api/token";
    let response;
    let data;
    let requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      // Nota: se cambió "password" a "hashPassword"
      body: JSON.stringify('grant_type=&username=' + email + '&password=' + hashPassword + '&scope=&client_id=&client_secret='),
    };

    try {
      response = await fetch(endpoint, requestOptions);
      data = await response.json();

      if (!response.ok) {
        throw new Error('Request failed with status ' + response.status);
      } else {
        console.log("Nos hemos autenticado");
      }
    } catch (err) {
      if (response && response.status === 401) {
        setErrorMessage("Usuario o contraseña incorrectos");
        return;
      } else {
        console.error('Error:', err);
      }
      console.log("Fallo al autenticar");
    }

    console.log("Salimos de las comprobaciones de login");

    let estadoUsuario = localStorage.getItem("UserToken");
    setToken(data.access_token);
    comprobarEstado();

    function comprobarEstado() {
      if (estadoUsuario !== "null") {
        window.location.reload();
      } else {
        estadoUsuario = localStorage.getItem("UserToken");
        setTimeout(() => comprobarEstado(), 50);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitLogin();
  };

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center" style={{ height: "100vh", backgroundImage: `url(${props.fondoFinal})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "top" }}>
    <section style={{ borderRadius: "10px", border: "1px solid silver", backgroundColor: "white", padding: "20px", width: "50%" }}>
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Inicia sesión</h1>
        <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
            <label>Email</label>
            <br/>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" required />
        </div>
        <div style={{ marginBottom: "10px" }}>
            <label>Contraseña</label>
            <br />
            <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" required />
        </div>
        <ErrorMessage message={errorMessage} />
        <button className="btn btn-primary" style={{ width: "100%", backgroundColor: "#7CF7AB", borderColor: "#7CF7AB" }} type="submit">
          Entrar
        </button>
        </form>
        <button className="btn" style={{ marginTop: "10px", width: "100%" }} onClick={props.onCloseLog}>
          Volver atrás
        </button>
    </section>
    </div>
  );
};

export default LoginModal;
