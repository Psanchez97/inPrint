import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import ErrorMessage from "./ErrorMessage";

// Componente que se encarga de la funcionalidad "Crear un usuario"
const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [, setToken] = useContext(UserContext);
  const checkBox = document.querySelector("#cbox1");

  // Se crea la encriptación con salt
  const CryptoJS = require("crypto-js");
  const salt = "farm1990M0O";
  const salt1 = "f1nd1ngn3m0";
  const hashPassword = CryptoJS.SHA256(salt1 + password + salt).toString();

  // Guardar al nuevo usuario en la base de datos
  const submitRegistration = async () => {
    // ENDPOINTS
    let endpoint = "http://localhost:8000/api/users";

    let requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Se cambia la palabra password por hashPassword
      body: JSON.stringify({ email: email, hashed_password: hashPassword }),
    };
    let response;

    try {
      response = await fetch(endpoint, requestOptions);
      if (!response.ok) {
        throw new Error("Request failed with status " + response.status);
      } else {
        // console.log("Usuario registrado en endpointlocal")
      }
    } catch (err) {
      if (response && response.status === 401) {
        setErrorMessage("El correo que intenta registrar ya existe");
        return;
      } else {
        // Otro tipo de error
        console.log("Otro tipo de error");
        console.error("Error:", err);
      }
    }

    const data = await response.json();

    if (!response.ok) {
      setErrorMessage(data.detail);
    } else {
      setToken(data.access_token);
    }
  };

  // Hacemos comprobaciones para que la contraseña establecida sea válida y la política de privacidad aceptada
  const handleSubmit = (event) => {
    event.preventDefault();
    if (checkBox.checked) {
      if (password === confirmationPassword && password.length > 7) {
        submitRegistration();
        let estadoUsuario = localStorage.getItem("UserToken");
        comprobarEstado();

        function comprobarEstado() {
          if (estadoUsuario !== "null") {
            window.location.reload();
          } else {
            estadoUsuario = localStorage.getItem("UserToken");
            setTimeout(() => comprobarEstado(), 50);
          }
        }
      } else {
        setErrorMessage("Las contraseñas deben coincidir y tener al menos 8 caracteres");
      }
    } else {
      setErrorMessage("Debe aceptar la política de privacidad");
    }
  };

  // Aspecto visual del box de crear usuario
  return (
    <div className="column">
      <form className="box" onSubmit={handleSubmit}>
        <h1 className="title has-text-centered">Crea un usuario</h1>
        <div className="field">
          <label className="label">Email</label>
          <div className="control">
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Contraseña</label>
          <div className="control">
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Confirma tu contraseña</label>
          <div className="control">
            <input
              type="password"
              placeholder="Enter Password"
              value={confirmationPassword}
              onChange={(e) => setConfirmationPassword(e.target.value)}
              className="input"
              required
            />
          </div>
          <br></br>
          <label>
            <input type="checkbox" id="cbox1" value="first_checkbox"></input> Acepto la{" "}
            <a href="/" target="_blank">
              Política de privacidad de InPrint
            </a>
          </label>
          <br></br>
        </div>
        <ErrorMessage message={errorMessage} />
        <br />
        <button className="button is-primary" type="submit">
          Guardar
        </button>
      </form>
    </div>
  );
};

export default Register;
