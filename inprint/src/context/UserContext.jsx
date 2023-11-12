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
  };

  const endpoint = "http://localhost:8000/";
  const endpoint2 = "http://localhost:8000/";

  useEffect(() => {
    const fetchUser = async () => {
      const requestOptions = await {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
      };

      if (token === null) {
        setToken(null);
      }
      var response;
      if (token === "null") {
        const requestOptions = await {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };

        try {
          response = await fetch(endpoint + "api/users/visitaWeb", requestOptions);
          if (!response.ok) {
            throw new Error('Request failed with status ');
          }
        } catch {
          response = await fetch(endpoint2 + "api/users/visitaWeb", requestOptions);
        }

        // accesoWeb();
      } else {
        try {
          response = await fetch(endpoint + "api/users/me", requestOptions);
          if (!response.ok) {
            throw new Error('Request failed with status ' + response.status);
          }
        } catch {
          handleLogout();
        }

        localStorage.setItem("UserToken", token);

        if (response == null || (!response.ok && response.type === 'cors')) {
          console.log("error api/users/me");
          handleLogout();
        }
      }
    };

    fetchUser();
  }, [token]);

  return (
    <UserContext.Provider value={[token, setToken]}>
      {props.children}
    </UserContext.Provider>
  );
};
