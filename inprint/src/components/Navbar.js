import React, { Component, useContext, useState } from 'react'
import logo from './media/logo.png'
import logoPNG from './media/logo2.png'

// import Logout from './Logout'



class Navbar extends Component {

  async componentDidMount() {

    try{
      let winWidth = await window.innerWidth
      let winHeight = await window.innerHeight
      let device = await this.getDeviceType()

      await this.setState({ winWidth: winWidth })
      await this.setState({ winHeight: winHeight })
      await this.setState({ device: device })
    } catch (err) {
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'Se ha producido un error en el navegador' })

    }
  }

  async getDeviceType() {
    try {
      let ua = await navigator.userAgent;
      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return "tablet";
      }
      if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return "mobile";
      }
      return "desktop";
    } catch (err) {
      console.log("Se ha producido un error al detectar el tipo de dispositivo")
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'Se ha producido un error al detectar el tipo de dispositivo' })

    }
  };


  constructor(props) {
    super(props)
    this.state = {
      winWidth: 0,
      winHeight: 0,
      device: ""
      
    }
  }


  render() {
    try{ 

        let relleno

        if (this.state.device === "desktop") {

          relleno =
          <table style={{width: "100%" }} >
            <tr style={{ width: "100%" }}>
              <td style={{ width: "20%" }}>
                <div style={{ width: "100%" }}>
                  <button className="btn btn-light">Inicio</button>
                </div>
              </td>
              <td style={{ width: "20%" }}>
                <div style={{ width: "100%" }}>
                  <button className="btn btn-light">Sobre nosotros</button>
                </div>
              </td>
            </tr>
          </table>



          return(

            <nav style={{ width: "100%", height: "10%" }} className="navbar fixed-top bg-white flex-md-nowrap p-1 shadow">
              <div style={{ color: "#484848", height: "100%", width: "100%" }}>
                <table style={{ width: "100%", height: "100%" }}>
                  <tbody style={{ width: "100%", height: "100%" }}>
                    <tr style={{ width: "100%", height: "10%" }}>
                    </tr>
                    <tr style={{ width: "100%", height: "80%" }}>
                      <td style={{ width: "35%" }}>
                        <h1 style={{padding: "5px"}}>
                          <a style={{ textDecoration: "none", color: "#5A5A5A", fontFamily: "Helvetica" }} href='/'>    
                            <img src={logo} className="d-inline-block" style={{ width: "80px", height: "80%" }} alt="" 
                                 onError={(e) => {e.target.src = logoPNG;}}/>
                          </a>
                        </h1>
                      </td>    
                      <td style={{ width: "30%", height: "80%" }}>    
                      </td>
                      <td style={{ width: "35%", height: "80%" }}>
                        {relleno}
                      </td>
                    </tr>
                    <tr style={{ width: "100%", height: "10%" }}>
                    </tr>    
                  </tbody>
                </table>     
              </div>
            </nav>
          );
        }

    } catch(err) {
      setTimeout(() => window.location.reload(), 2000);
      return (<div>Error al cargar el Navegador</div>)

    }
  }
 }

export default Navbar;