import React, {Component} from 'react'

import logo from './media/logo.png'
import logoPNG from './media/logo2.png'

// import Logout from './Logout'
import {NavLink } from 'react-router-dom'



class Navbar extends Component {



  async componentDidMount() {
    try{
    let winWidth = await window.innerWidth

    let winHeight = await window.innerHeight
    await this.setState({ winWidth: winWidth })

    await this.setState({ winHeight: winHeight })
    let device = await this.getDeviceType()
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
      if (
        /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
          ua
        )
      ) {
        return "mobile";
      }
      return "desktop";
    } catch (err) {
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'Se ha producido un error al detectar el tiempo de dispositivo' })

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
      
      let field3

      let width = this.state.winWidth


      if (this.props.userRole) {
        if (this.state.device === "desktop") {
          field3 = <table nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "100%" }} >
            <tr nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "100%" }}>
              <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{width: "30%"}}>
                <div nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "100%"}}>
                  <NavLink className="btn btn-sm btn-block nav-btn" 
                          nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" 
                              to="/">
                    Inicio  
                  </NavLink>
                </div>
              </td>
              <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "30%" }}>
                <div nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "100%" }} >
                  <NavLink  className="btn btn-sm btn-block nav-btn" nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg"  
                          to="/sobre-drive-team">
                    Nosotros
                  </NavLink>
                </div>
              </td>
              <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "40%" }}>

                <div nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "100%" }}>
                  <form onSubmit={(event) => {
                    event.preventDefault()

                    this.props.showNavigatorModal()

                  }} style={{ width:"100%" }}>
                    <button  style={{ width:"100%" }} type="submit" class="btn btn-sm btn-block nav-btn" nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg">
                      Más acciones
                    </button>
                  </form>
                </div>
              </td>
              
            </tr>

          </table>
        } else {
          field3 = <table nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "100%" }} >
            <tr nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "100%" }}>
              <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "70%" }}>
                <table>
                  <tr>
                    <td>
                      <div nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "100%" }}>
                        <NavLink nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{color: "#28BAC1", textDecoration: "none", width: "100%"}} to="/">Inicio</NavLink>
                      </div>
                    </td>
                  </tr>
                  <tr nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "100%" }}>
                    <td>
                      <div nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "100%" }} >
                        <NavLink nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ color: "#28BAC1", textDecoration: "none", width: "100%"}} to="/sobre-drive-team">Nosotros</NavLink>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>

              <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "30%" }}>
                <div>
                  <form onSubmit={(event) => {
                    event.preventDefault()

                    this.props.showNavigatorModal()

                  }}>

                    <button style={{ fontSize: 17 }} type="submit" className="button"><b>+</b></button>

                  </form>
                </div>
              </td>

            </tr>


          </table>

        }
      } else {
        if (this.state.device === "desktop") {
          field3 = <table nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "100%" }} >
            <tr nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "100%" }}>
              <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "20%" }}>
                <div nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "100%" }}>
                  <NavLink  className="btn btn-sm btn-block nav-btn" nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg"  to="/"> Inicio  </NavLink>
                </div>
              </td>
              <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "20%" }}>
                <div nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "100%" }} >
                  <NavLink className="btn btn-sm btn-block nav-btn" nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg"  to="/sobre-drive-team">Nosotros</NavLink>
                </div>
              </td>
            </tr>

          </table>
        } else {
          field3 = <table nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" 
                          style={{ width: "100%" }} >
                      <tr nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" 
                          style={{ width: "100%" }}>
                        <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" 
                            style={{ width: "30%" }}>
                          <div nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" 
                               style={{ width: "100%" }}>
                            <NavLink nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" 
                                     style={{ color: "#28BAC1", textDecoration: "none", width: "100%" }} 
                                     to="/">
                              Inicio
                            </NavLink>
                          </div>
                        </td>
                      </tr>
                      <tr nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" 
                          style={{ width: "100%" }}>
                        <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" 
                            style={{ width: "30%" }}>
                          <div nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" 
                               style={{ width: "100%" }}>
                            <NavLink nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" 
                                     style={{ color: "#28BAC1", textDecoration: "none", width: "100%" }} 
                                     to="/sobre-drive-team">
                              Nosotros
                            </NavLink>
                          </div>
                        </td>
                      </tr>

                    </table>

        }
      }




  } catch(err) {
    setTimeout(() => window.location.reload(), 2000);
    return (<div>Error al cargar el Navegador</div>)


  }
  }

 }

export default Navbar;