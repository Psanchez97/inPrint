
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css'
import App from './components/Home';
import {UserProvider} from "./context/UserContext";


function Main() {

  const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
      window.location.hostname === '[::1]' ||
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/.test(window.location.hostname)
  );


  return (
    <UserProvider>
      <App />
    </UserProvider>
  );

}

ReactDOM.render(<Main />, document.getElementById('root'));
