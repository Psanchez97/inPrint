import React, {useState, useContext} from "react";
import ErrorMessage from "./ErrorMessage";
import { UserContext} from "../context/UserContext";

//Componente que se encarga de la funcionalidad de "Iniciar Sesión"
const LoginModal = (props) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const  [, setToken] = useContext(UserContext);
    const CryptoJS = require("crypto-js");
    const salt = "farm1990M0O";
    const salt1 = "f1nd1ngn3m0";
    let hashPassword = CryptoJS.SHA256(salt1+password+salt).toString();
      
    const submitLogin = async () => {

        //VARIABLES

        let endpointlocal = "http://localhost:8000/api/token"
        let response
        let data
        let requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }, // ojo se cambio password a hashPasword
            body: JSON.stringify('grant_type=&username='+email+'&password='+hashPassword+'&scope=&client_id=&client_secret='),            
        };

        try {
            response = await fetch(endpointlocal, requestOptions);
            data = await response.json();

            if (!response.ok) {
                throw new Error('Request failed with status ' + response.status);
            }else{
                console.log("Nos hemos autenticado")
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

        console.log("Salimos de las comprobaciones de login")

        let estadoUsuario = localStorage.getItem("UserToken");
        setToken(data.access_token);
        comprobarEstado();

        function comprobarEstado(){
            if(estadoUsuario !== "null"){
                window.location.reload()
            } else{
                estadoUsuario = localStorage.getItem("UserToken");
                setTimeout(() => comprobarEstado(), 50);
            }
        }        
    };


    const handleSubmit = async (e) => {
        console.log("entrando")
        e.preventDefault();
        await submitLogin();
    };

    var show = true
    var showHideClassName = show ? "modal display-block" : "modal display-none";

    return (
        <div className={showHideClassName} nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ textAlign: "center" }}>
            <section className="modal-main" nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ textAlign: "center", borderRadius:"10px", border:"1px solid silver", backgroundColor: '#e6e6fa' }}>
                <div className="column">
                    <form className="box" onSubmit={handleSubmit}>
                        <h1 className="title has-text-centered">Inicia sesión</h1>
                        <div className="field">
                            <label className="label">Email</label>
                            <div className="control">
                                <input type="email" placeholder="Email" value={email} onChange={ (e) => setEmail(e.target.value)} className="input" required/>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Contraseña</label>
                            <div className="control">
                                <input type="password" placeholder="Enter Password" value={password} onChange={ (e) => setPassword(e.target.value)} className="input" required/>
                            </div>
                        </div>
                        <br/>
                        <ErrorMessage message={errorMessage}/>
                        <br/>
                        {/* {loader} */}
                        <br/>
                        <button className="button is-primary" style={{backgroundColor:'#0d6efd', borderColor:'#0d6efd'}} type="submit">
                            Entrar
                        </button>
                    </form>
                </div>
                <button type="button" class="btn" nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "50%", marginBottom:"5px", border:"1px solid silver", backgroundColor:"white" }} onClick={props.onCloseLog}>
                            Volver atrás
                    </button>
            </section>
        </div>

    );
};


export default LoginModal;