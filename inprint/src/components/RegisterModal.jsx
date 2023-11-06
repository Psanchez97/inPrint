import React from "react";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import ErrorMessage from "./ErrorMessage";

const RegisterModal = (props) => {

    // Estados iniciales
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmationPassword, setConfirmationPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const setToken = useContext(UserContext);

    // Referencia al checkbox
    const checkBox = document.querySelector("#cbox1");

    // Estado para el loader
    const [loader, setLoader] = useState(<div></div>);

    // Librería para cifrar contraseñas
    const CryptoJS = require("crypto-js");
    const salt = "farm1990M0O";
    const salt1 = "f1nd1ngn3m0";
    const hashPassword = CryptoJS.SHA256(salt1 + password + salt).toString();

    // Función para enviar el formulario de registro
    const submitRegistration = async () => {
        // URL de la API
        let endpoint = "http://localhost:8000/api/users";
        let response;
        let requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // Cambia la palabra password por hashPassword
            body: JSON.stringify({ email_usuario: email, contrasena_usuario: hashPassword }),
        };
        // setLoader(<CustomSpinner/>)

        try {
            response = await fetch(endpoint, requestOptions);
            if (!response.ok) {
                throw new Error('Request failed with status ' + response.status);
            } else {
                // setLoader(<div></div>)
                console.log("Usuario registrado");
            }
        } catch (err) {
            // console.log("Register: Fallo en endpointlocal");
            response = "error";
        }

        const data = await response.json();

        if (!response.ok) {
            setErrorMessage(data.detail);
        } else {
            console.log("data.access_token: ", data.access_token);
            setToken(data.access_token);
        }
    }

    // Función para manejar el envío del formulario
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
                        console.log("estadoUsuario: ", estadoUsuario);
                        estadoUsuario = localStorage.getItem("UserToken");
                        setTimeout(() => comprobarEstado(), 100);
                    }
                }
            } else {
                setErrorMessage("Las contraseñas deben coincidir y tener al menos 8 caracteres");
            }
        } else {
            setErrorMessage("Debe aceptar la política de privacidad");
        }
    }

    // Lógica para mostrar u ocultar el modal
    var show = true;
    var showHideClassName = show ? "modal display-block" : "modal display-none";

    return (
        <div className="container-fluid d-flex align-items-center justify-content-center" style={{ height: "100vh", backgroundImage: `url(${props.fondoFinal})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "top" }}>
            <section style={{ borderRadius: "10px", border: "1px solid silver", backgroundColor: "white", padding: "20px", width: "50%" }}>
                <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Regístrate</h1>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: "10px" }}>
                            <label>Email</label>
                            <br/>
                            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" required />
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <label>Contraseña</label>
                            <br/>
                            <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" required />
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <label>Contraseña</label>
                            <br/>
                                <input type="password" placeholder="Confirma tu contraseña" value={confirmationPassword} onChange={(e) => setConfirmationPassword(e.target.value)} className="form-control"  required/>
                            <br/><br/>
                            <label>
                                <input type="checkbox" id="cbox1" value="first_checkbox"></input> Acepto la <a href="/" target="_blank">Política de privacidad de In-Print</a></label><br></br>
                        </div>
                        <ErrorMessage message={errorMessage} />
                        <br />
                        {/* {loader} */}
                        <br />
                        <button className="btn btn-primary" style={{ width: "100%", backgroundColor: "#7CF7AB", borderColor: "#7CF7AB" }} type="submit">
                            Guardar
                        </button>
                    </form>                
                    <button className="btn" style={{ marginTop: "10px", width: "100%" }} onClick={props.onCloseReg}>
                        Volver atrás
                    </button>
            </section>
        </div>
    );
}

export default RegisterModal;
