import React, {useState, useContext} from "react";
import ErrorMessage from "./ErrorMessage";
import { UserContext} from "../context/UserContext";

//Componente que se encarga de la funcionalidad de "Iniciar Sesión"
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const  [, setToken] = useContext(UserContext);
    
    // Se utiliza la librería "Cryto-js" para añadir salt al hash
         
    const CryptoJS = require("crypto-js");
    // variables que corresponden a Salt
    const salt = "farm1990M0O";
    const salt1 = "f1nd1ngn3m0";
    // se utilizó una variable "let" para poder reutilizarla dentro del código
    // Se añade salt a la contraseña y se cifra con SHA256 y se pasa a String
    let hashPassword = CryptoJS.SHA256(salt1+password+salt).toString();
      
    //Comprueba si la contraseña y el email introducido son correctos, en caso de que lo sean carga la página del usuario
    const submitLogin = async () => {

        //ENDPOINTS

        let endpoint = "http://localhost:8000/api/token"
        
        
        let requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }, // ojo se cambio password a hashPasword
            body: JSON.stringify('grant_type=&username='+email+'&password='+hashPassword+'&scope=&client_id=&client_secret='),
            
        };
        
        let response
        let data


        try {
            response = await fetch(endpoint, requestOptions);
            data = await response.json();

            if (!response.ok) {
                throw new Error('Request failed with status ' + response.status);
                
            }else{
                // console.log("Nos hemos autenticado con el endpointlocal")
            }

        } catch (err) {
            response= "error"
            console.log("fallo al autenticar endpointlocal");
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
        // console.log("entrando")
        e.preventDefault();
        await submitLogin();
    };
   
    //Aspecto visual del box de inicio de sesión
    return (
        <div className="column">
            <form className="box" onSubmit={handleSubmit}>
                <h1 className="title has-text-centered">Inicia sesión</h1>
                <div className="field">
                    <label className="label">Email</label>
                    <div className="control">
                        <input 
                            type="email" 
                            placeholder="Email" 
                            value={email} 
                            onChange={ (e) => setEmail(e.target.value)}
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
                            onChange={ (e) => setPassword(e.target.value)}
                            className="input"
                            required
                        />
                    </div>
                </div>
                <br></br>
                <ErrorMessage message={errorMessage}/>
                <br />
                <button className="button is-primary" type="submit">
                    Entrar
                </button>
            </form>
        </div>
    );
};

export default Login;