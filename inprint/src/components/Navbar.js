import React, { Component, useContext, useState } from 'react'
import logo from './media/logo.png'
import logo2 from './media/logo2.png'
import Logout from './Logout'


class Navbar extends Component {

  constructor(props) {
    super(props)
    this.state = {
      winWidth: 0,
      winHeight: 0,
      device: "",
    }
  }

  async componentDidMount() {

    try{
      let winWidth =  window.innerWidth
      let winHeight =  window.innerHeight
      let device =  this.getDeviceType()

       this.setState({ winWidth: winWidth })
       this.setState({ winHeight: winHeight })
       this.setState({ device: device })
    } catch (err) {
       this.setState({ errorHappened: true })
       this.setState({ errorMsg: 'Se ha producido un error en el navegador' })

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

  render() {
    // try{

        let relleno


        //si hay token
        if (this.props.userToken !== "null") {

            //con cerrar sesion
            relleno =
              <table style={{width: "100%", backgroundColor: "#7CF7AB", padding: "10px", borderRadius: "10px" }} >
                <tr style={{ width: "100%" }}>
                  <td style={{ width: "20%" }}>
                    <div style={{ width: "100%", marginTop: "10px", marginBottom: "10px", marginLeft: "10px" }}>
                      <button className="btn btn-light" style={{ width: "150px" }}>Inicio</button>
                    </div>
                  </td>
                  <td style={{ width: "20%" }}>
                    <div style={{ width: "100%" }}>
                      <button className="btn btn-light" style={{ width: "150px" }}>Sobre nosotros</button>
                    </div>
                  </td>
                  <td style={{ width: "20%" }}>
                    <div style={{ width: "100%" }}>
                      <form  style={{ width:"100%" }}
                            onSubmit={(event) => {
                            event.preventDefault()
                            alert("Botón en proceso de implementación")
                            }}>
                        <button  type="submit" className="btn btn-light" style={{ width: "150px" }}>
                          Más acciones
                        </button>
                      </form>
                    </div>
                  </td>
                  <td style={{ width: "20%" }}>
                    <Logout />
                    {/* <div style={{ width: "100%" }}>
                      <form  style={{ width:"100%" }}
                            onSubmit={(event) => {
                            event.preventDefault()
                            this.setState({ userToken: "null" })
                            }}>
                        <button  type="submit" className="btn btn-light" style={{ width: "150px" }}>
                          Cerrar sesión
                        </button>
                      </form>
                    </div> */}
                  </td>
                </tr>
              </table>
          
        }
        //si no hay token
        else{

          //sin cerrar sesion
          relleno =
            <table style={{width: "100%", backgroundColor: "#7CF7AB", padding: "10px", borderRadius: "10px" }} >
              <tr style={{ width: "100%" }}>
                <td style={{ width: "20%" }}>
                  <div style={{ width: "100%", marginTop: "10px", marginBottom: "10px", marginLeft: "10px" }}>
                    <button className="btn btn-light" style={{ width: "150px" }}>Inicio</button>
                  </div>
                </td>
                <td style={{ width: "20%" }}>
                  <div style={{ width: "100%" }}>
                    <button className="btn btn-light" style={{ width: "150px" }}>Sobre nosotros</button>
                  </div>
                </td>
                <td style={{ width: "20%" }}>
                  <div style={{ width: "100%" }}>
                    <form  style={{ width:"100%" }}
                          onSubmit={(event) => {
                          event.preventDefault()
                          this.props.showRegisterModal()
                          }}>
                      <button  type="submit" className="btn btn-light" style={{ width: "150px" }}>
                        Registrarse
                      </button>
                    </form>
                  </div>
                </td>
                <td style={{ width: "20%" }}>
                  <div style={{ width: "100%" }}>
                    <form  style={{ width:"100%" }}
                          onSubmit={(event) => {
                          event.preventDefault()
                          this.props.showLoginModal()
                          }}>
                      <button  type="submit" className="btn btn-light" style={{ width: "150px" }}>
                        Iniciar sesión
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            </table>

      }
    
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
                        <img src={logo2} className="d-inline-block" style={{ height: "70px" }} alt="" 
                              onError={(e) => {e.target.src = logo;}}/>
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
        
    // } catch(err) {
    //   setTimeout(() => window.location.reload(), 2000);
    //   return (<div>Error al cargar el Navegador</div>)
    // }  
 }
}

export default Navbar;