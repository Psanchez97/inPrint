import React, { Component } from 'react';
import Navbar from './Navbar';
import fondoAvif from './media/fondo.avif';
import fondoPNG from './media/fondo.png';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      winWidth: 0,
      winHeight: 0,
      device: '',
      fondoFinal: '', 
    };
  }

  async componentDidMount(recalled = 0) {
    const imgFondo = new Image();
    imgFondo.src = fondoAvif;

    imgFondo.onerror = () => {
      this.setState({ fondoFinal: fondoPNG });
    };

    imgFondo.onload = () => {
      this.setState({ fondoFinal: fondoAvif });
    };

    try {
      let deviceType = await this.getDeviceType();
      let winWidth = window.innerWidth;
      this.setState({ winWidth: winWidth, device: deviceType });
    } catch (err) {
      console.log("Estás en el catch", err);
    }
  }

  async getDeviceType() {
    try {
      let ua = await navigator.userAgent;
      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return "tablet";
      }
      if (
        /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)
      ) {
        return "mobile";
      }
      return "desktop";
    } catch (err) {
      console.error('Error al detectar el tipo de dispositivo', err);
      throw err; // Lanza el error nuevamente para que sea capturado en componentDidMount
    }
  }

  async showError() {
    try {
      this.setState({ errorHappened: true, errorMsg: 'Se ha producido un error no especificado' });
    } catch (err) {
      this.setState({ errorHappened: true, errorMsg: 'Se ha producido un problema al mostrar un mensaje de error general' });
    }
  }

  render() {
    try {
      let winWidth = this.state.winWidth;
      let winHeight = window.innerHeight * 1.5;

      if (winHeight > 1500) {
        winHeight = winHeight;
      } else {
        winHeight = 1500;
      }

      var sectionStyle;

      if (this.state.device === 'desktop') {
        if (window.innerWidth > 1200) {
          sectionStyle = {
            width: "100%",
            height: "100%",
          };
        } else {
          sectionStyle = {
            width: "100%",
            height: "100%",
            backgroundImage: "url(" + this.state.fondoFinal + ")",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundPosition: "bottom",
          };
        }
      } else {
        sectionStyle = {
          width: "100%",
          height: "1000px",
          backgroundImage: "url()",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "bottom",
        };
      }

      return (
        <div style={{ width: winWidth, height: window.innerHeight > 1200 ? window.innerHeight : "auto" }}>
          <Navbar winWidth={this.state.winWidth} winHeight={this.state.winHeight} />
        </div>
      );
    } catch (err) {
      console.error('Error en el bloque try-catch de render', err);
    }
  }
}

export default Home;
