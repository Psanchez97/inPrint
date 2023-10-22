import React from "react";
import { useContext, useState, useEffect } from "react";
import reactGA from "react-ga";
import { UserContext } from "../context/UserContext";
import ErrorMessage from "./ErrorMessage";
// import CustomSpinner from "./CustomSpinner";


const RegisterModal = (props) => {

    useEffect(() => {reactGA.pageview(window.location.pathname);}, []);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmationPassword, setConfirmationPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [, setToken] = useContext(UserContext);
    const checkBox = document.querySelector("#cbox1");
    const [loader, setLoader] = useState(<div></div>);
    const CryptoJS = require("crypto-js");
    const salt = "farm1990M0O";
    const salt1 = "f1nd1ngn3m0";
    const hashPassword = CryptoJS.SHA256(salt1 + password + salt).toString();

    const submitRegistration = async () => {

        //VARIABLES

        let endpointlocal = "http://localhost:8000/api/users"
        let response
        let requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            //Se cambia la palabra password por hashPassword
            body: JSON.stringify({ email: email, hashed_password: hashPassword }),
        };
        // setLoader(<CustomSpinner/>)

        try{
            response = await fetch(endpointlocal, requestOptions);
            if (!response.ok) {
                throw new Error('Request failed with status ' + response.status);
            }else{
                // setLoader(<div></div>)
                console.log("Usuario registrado")
            }            
        } catch (err) {

            // console.log("Register: Fallo en endpointlocal");
            response= "error"
        }

        const data = await response.json();

        if (!response.ok) {
            setErrorMessage(data.detail);
        } else {
            setToken(data.access_token);
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (checkBox.checked) {
            if (password === confirmationPassword && password.length > 7) {
                reactGA.event({
                    action: "submit reg",
                    label: "test label"
                })
                submitRegistration();
                let estadoUsuario = localStorage.getItem("UserToken");
                comprobarEstado();

                function comprobarEstado() {
                    if (estadoUsuario !== "null") {
                        window.location.reload()
                    }
                    else {
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
    }

    var show = true
    var showHideClassName = show ? "modal display-block" : "modal display-none";


    return (
        <div className={showHideClassName} nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ textAlign: "center" }}>
            <section className="modal-main" nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ textAlign: "center", borderRadius:"10px", border:"1px solid silver", backgroundColor: '#e6e6fa' }}>
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
                                <input type="checkbox" id="cbox1" value="first_checkbox"></input> Acepto la <a href="/" target="_blank">Política de privacidad de In-Print</a></label><br></br>
                        </div>
                        <ErrorMessage message={errorMessage} />
                        <br/>
                        {/* {loader} */}
                        <br/>
                        <button className="button is-primary" style={{backgroundColor:'#0d6efd', borderColor:'#0d6efd'}} type="submit">
                            Guardar
                        </button>
                    </form>
                </div>
                <button type="button" class="btn" nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "50%", marginBottom:"5px", border:"1px solid silver", backgroundColor:"white" }} onClick={props.onCloseReg}>
                    Volver atrás
                </button>
            </section>
        </div>

    );
}

export default RegisterModal;