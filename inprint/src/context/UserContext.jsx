import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserProvider = (props) => {
  const [token, setToken] = useState(localStorage.getItem("UserToken"));
  const handleLogout = () => {
    let estadoUsuario = localStorage.getItem("UserToken");
    setToken(null);
    comprobarEstado();

    function comprobarEstado() {
      if (estadoUsuario === "null" || estadoUsuario === null) {
        window.location.reload();
      } else {
        estadoUsuario = localStorage.getItem("UserToken");
        setTimeout(() => comprobarEstado(), 50);
      }
    }
  }

  // VARIABLES

  let endpointlocal = "http://localhost:8000/";

  useEffect(() => {
    const fetchUser = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
      };

      let response; // Declarar la variable response aquí

      if (token === null) {
        setToken(null);
      }

      if (token === "null") {
        const requestOptions = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };

        try {
          response = await fetch(endpointlocal + "api/users/visitaWeb", requestOptions);
          if (!response.ok) {
            throw new Error('Request failed with status ');
          } else {
            console.log("UserContext de endpointlocal");
          }
        } catch (err) {
          console.log("UserContext: Fallo en endpointlocal");
        }
      } else {
        try {
          response = await fetch(endpointlocal + "api/users/visitaWeb", requestOptions);
          if (!response.ok) {
            throw new Error('Request failed with status ');
          } else {
            console.log("UserContext de endpointlocal");
          }
        } catch (err) {
          console.log("UserContext: Fallo en endpointlocal");
          handleLogout();
        }
      }
    

      localStorage.setItem("UserToken", token);

      if (response == null || (!response.ok && response.type === 'cors')) {
        console.log("error api/users/me");
        handleLogout();
      }
    }
    fetchUser();
  }, [token]);

  return (
    <UserContext.Provider value={[token, setToken]}>
      {props.children}
    </UserContext.Provider>
  );
};
