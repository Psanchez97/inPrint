import React, { Component, useContext } from 'react'
import { UserContext } from './../context/UserContext'

//Componente que se encarga de la funcionalidad del botón "Cerrar Sesión"
const Logout = () => {
    const [token, setToken] = useContext(UserContext);

    //Borrar usuario actual del local data y recargar la página
    const handleLogout = () => {
        let estadoUsuario = localStorage.getItem("UserToken");
        setToken(null);
        comprobarEstado();

        function comprobarEstado() {
            if (estadoUsuario === "null" || estadoUsuario === null) {
                window.location.reload()
            }
            else {
                estadoUsuario = localStorage.getItem("UserToken");
                setTimeout(() => comprobarEstado(), 50);
            }

        }
    };

    //Comprueba si se ha pulsado el botón, si se ha pulsado borrar el botón
        return (
            <div style={{ "width": "100%" }}>
                {token && (
                    <button className="btn btn-light" style={{ width: "150px" }} onClick={handleLogout}>
                        Cerrar sesión
                    </button>
                )}
            </div>
        )

}

export default Logout;