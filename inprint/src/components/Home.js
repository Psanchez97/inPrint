import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Navbar from './Navbar';
import fondoAvif from './media/fondo.avif';
import car1 from './media/impresion1.webp';
import car2 from './media/impresion2.webp';
import car3 from './media/impresion3.webp';
import fondoPNG from './media/fondo.png';
import '@fortawesome/fontawesome-free/css/all.css';
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'
import UploadFile from './UploadFile';
import GeneralView from './GeneralView';



class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endPoint: "http://localhost:8000/",
      winWidth: 0,
      winHeight: 0,
      device: '',
      fondoFinal: fondoAvif,
      carrusel1: car1, 
      carrusel2: car2, 
      carrusel3: car3, 
      errorMsg: '',
      showLoginModalVar: false,
      showRegisterModalVar: false,
      loading: false,
      userToken: ""
    };

    this.onClose = this.onClose.bind(this)
    this.onCloseNav = this.onCloseNav.bind(this)
    this.onCloseLog = this.onCloseLog.bind(this)
    this.onCloseReg = this.onCloseReg.bind(this)
    this.showLoginModal = this.showLoginModal.bind(this)
    this.showRegisterModal = this.showRegisterModal.bind(this)
    this.putLoading = this.putLoading.bind(this);

  }

  async componentDidMount(recalled = 0) {
    
    const imgFondo = new Image();
    imgFondo.src = fondoAvif;

    window.onload = function () {
      window.scrollTo(0, 0);
    }

    imgFondo.onerror = () => {
      this.setState({ fondoFinal: fondoPNG });
    };

    imgFondo.onload = () => {
      this.setState({ fondoFinal: fondoAvif });
    };

    try {
      let deviceType = await this.getDeviceType();
      let winWidth = window.innerWidth;
      let token= await localStorage.getItem('UserToken')
      await this.handleToken(token);
      this.setState({ winWidth: winWidth, device: deviceType });
    } catch (err) {
      console.log("Estás en el catch", err);
    }
  }

  async handleToken(token) {
    try {
      this.setState({ token: token });
    }catch (err) {
      console.log("No se ha podido guardar el token", err);
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
      throw err;
    }
  }

  async showError() {
    try {
      this.setState({ errorHappened: true, errorMsg: 'Se ha producido un error no especificado' });
    } catch (err) {
      this.setState({ errorHappened: true, errorMsg: 'Se ha producido un problema al mostrar un mensaje de error general' });
    }
  }

  async showLoginModal() {

    try {

      let showLoginModal = this.state.showLoginModalVar

      if (showLoginModal) {
        await this.setState({ showLoginModalVar: false })
      } else {
        await this.setState({ showLoginModalVar: true })

      }
    } catch (err) {
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'Se ha producido un error al mostrar el elemento de Login' })

    }

  }

  async showRegisterModal() {

    try {

      let showRegisterModal = this.state.showRegisterModalVar

      if (showRegisterModal) {
        await this.setState({ showRegisterModalVar: false })
      } else {
        await this.setState({ showRegisterModalVar: true })
      }
    } catch (err) {
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'Se ha producido un error al mostrar el elemento de registro' })

    }

  }

  async onCloseNav() {
    try {
      await this.setState({ showNavigatorModal: false });
    } catch (err) {
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'Se ha producido un error al cerrar el componente navegador' })

    }

  }

  async onCloseLog() {
    try {
      await this.setState({ showLoginModalVar: false });
    } catch (err) {
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'Se ha producido un error al cerrar el componente Login' })

    }

  }

  async onCloseReg() {
    try {
      await this.setState({ showRegisterModalVar: false });
    } catch (err) {
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'Se ha producido un error al cerrar el componente registro' })

    }

  }

  async onClose() {
    try {
      await this.setState({ showModalActivity: false });

      await this.setState({ showSendSmsActivity: false });

      await this.setState({ showPeriodModal: false });

      await this.setState({ showLastModal: false })

      await this.setState({ askTacProvider: false })

      await this.setState({ askContCred: false })

      await this.setState({ newPassAsked: false })
      await this.setState({ defaultComments: ""})
      await this.setState({ defaultPlace: ""})
      await this.setState({ defaultIdentifier: "" })

      await this.setState({ showTripModal: false })
    } catch (err) {
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'Se ha producido un error (7)' })
    }
  }

  async putLoading(boolValue) {     
    await this.setState({ loading: boolValue })
  }


  render() {
    // try {
            
    //VARIABLES DE RENDER

      let footer = <div></div>;

      let error= <div></div>;
      
      let loader = <div></div>;

      let table = <div></div>;

      let spacer = 
        <div>
          <br/><br/><br/><br/>
        </div>

      let actions = 
        <div className="card mb-4">
          <UploadFile 
            endPoint={this.state.endPoint}
            putLoading={this.putLoading}
            userToken={this.state.userToken}
          />
        </div>;

      let pedidos = 
        <div className="card mb-4">
          <GeneralView          
          />
        </div>;

      //aspecto visual al iniciar sesion
      let content = 
        <table style={{ width: '100%', }}>
          {spacer}
          <tbody>
            <tr>
              <td style={{ verticalAlign: "top", width: "2%" }}>
              </td>
              <td style={{ verticalAlign: "top", width: "30%" }}>
                <div class="col">
                  {actions}
                </div>
              </td>
              <td style={{ verticalAlign: "top", width: "2%" }}>
              </td>
              <td style={{ verticalAlign: "top", width: "64%" }}>
                <div class="col">
                  {pedidos}
                </div>
              </td>
              <td style={{ verticalAlign: "top", width: "2%" }}>
              </td>
            </tr>
          </tbody>         
          <br />
          <br />
        </table>            

      if(this.state.showLoginModalVar===true){        
        return(
          <div>
            <LoginModal 
              fondoFinal={this.state.fondoFinal}
              showError = {this.showError}
              device= {this.state.device}
              showLoginModal={this.showLoginModal}
              show={this.state.showLoginModalVar}
              onCloseLog={this.onCloseLog}                
            />
          </div>
        )        
      }else if(this.state.showRegisterModalVar===true){
        return(
          <div>
            <RegisterModal 
              fondoFinal={this.state.fondoFinal}
              showError = {this.showError}
              device= {this.state.device}
              showRegisterModal={this.showRegisterModal}
              show={this.state.showRegisterModalVar}
              onCloseReg={this.onCloseReg}                
            />
          </div>
        )        
      }else if (this.state.token !== "null") {

        console.log("Entramos en token no null")

        //aspecto visual antes de iniciar sesion
        content = 
          <table style={{ width: '100%' }}>
            <table>
              <br />
              <br />
              <br />
              <br />
              <br />
              <tbody style={{ width: '100%' }}>
                <tr style={{ width: '100%' }}>
                  <td style={{ width: '5%' }}></td>
                  <td
                    style={{
                      width: '90%',
                      textAlign: 'center',
                      fontWeight: 'medium',
                      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    <h1 class="display-1" style={{ color: 'white', fontWeight: 'medium' }}>
                      Bienvenid@ a InPrint
                    </h1>
                    <br />
                    <br />
                    <br />
                    <h4 style={{ color: 'white', fontWeight: 'medium' }}>
                      Haz realidad todos tus proyectos de impresión 3D o mecanizado
                    </h4>
                    <h2 style={{ color: '#7CF7AB' }}>+</h2>
                    <h4 style={{ color: 'white', fontWeight: 'medium' }}>
                      Consulta en todo momento el estado de tu pedido
                    </h4>
                    <h2 style={{ color: '#7CF7AB' }}>+</h2>
                    <h4 style={{ color: 'white', fontWeight: 'medium' }}>Calcula los costes asociados a tu pedido</h4>
                    <h2 style={{ color: '#7CF7AB' }}>+</h2>
                    <h4 style={{ color: 'white', fontWeight: 'medium' }}>
                      Utilizamos los mejores materiales del mercado, solo primeras marcas
                    </h4>
                    <h2 style={{ color: '#7CF7AB' }}>+</h2>
                    <h4 style={{ color: 'white', fontWeight: 'medium' }}>
                      Mecanizamos en 3 y 5 ejes en función de la complejidad de tu proyecto
                    </h4>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <div
                      style={{
                        display: 'inline-block',
                        background: 'white',
                        padding: '10px',
                        borderRadius: '5px',
                        transition: 'transform 0.3s ease',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                      onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <h4 style={{ color: '#5A5A5A', fontWeight: 'medium', margin: 0, textShadow: 'none' }}>
                        <i className="fas fa-arrow-down"></i> Aquí puedes ver algunos de nuestros trabajos{' '}
                        <i className="fas fa-arrow-down"></i>
                      </h4>
                    </div>
                    <br />
                  </td>
                  <td style={{ width: '5%' }}></td>
                </tr>
              </tbody>
              <br />
              <br />
            </table>
            <table style={{ width: '100%', backgroundColor: '#eeeff2' }}>
              <br />
              <br />
              <tbody style={{ width: '100%' }}>
                <tr style={{ width: '100%' }}>
                  <td style={{ width: '17%' }}></td>
                  <td style={{ width: '66%' }}>
                    <div id="carouselExampleCaptions" class="carousel slide" data-bs-ride="carousel">
                      <div class="carousel-indicators">
                        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
                      </div>
                      <div class="carousel-inner">
                        <div class="carousel-item active">
                          <img src={this.state.carrusel1} class="d-block w-100" />
                          <div class="carousel-caption d-none d-md-block">
                            <h5>Muestras impresas en Grey V4</h5>
                          </div>
                        </div>
                        <div class="carousel-item">
                          <img src={this.state.carrusel2} class="d-block w-100" />
                          <div class="carousel-caption d-none d-md-block">
                            <h5>Impresión en Green Transparent</h5>
                          </div>
                        </div>
                        <div class="carousel-item ">
                          <img src={this.state.carrusel3} class="d-block w-100" />
                          <div class="carousel-caption d-none d-md-block">
                            <h5>Pieza automovilística mecanizada</h5>
                          </div>
                        </div>
                      </div>
                      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Anterior</span>
                      </button>
                      <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Siguiente</span>
                      </button>
                    </div>
                  </td>
                  <td style={{ width: '17%' }}></td>
                </tr>
                <tr style={{ width: '100%' }}>
                  <td style={{ width: '17%' }}></td>
                  <td style={{ width: '66%' }}></td>
                  <td style={{ width: '17%' }}></td>
                </tr>
              </tbody>
            </table>
            <br />
            <br />
          </table>

      }else{
        
        console.log("Entramos en el else con el return")

          return (        
            <div style={{width: "100%", height: "100vh" }}>
              <Navbar 
                winWidth={this.state.winWidth} 
                winHeight={this.state.winHeight} 
                showError={this.showError}
                device={this.state.device}
                showLoginModal={this.showLoginModal}
                showRegisterModal={this.showRegisterModal}
              />              
              <div style={{width: "100%",
                            height: "100%",
                            backgroundImage: "url(" + this.state.fondoFinal + ")",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            backgroundPosition: "bottom",}}>              
                  {error}
                  {loader}
                  <br/>
                  {content}              
                  <br/>
                  <br/>              
                  {table}
              </div>            
                {footer}            
            </div>
          );
    
      }


    // } catch (err) {
    //   console.error('Error en el bloque try-catch de render', err);
    //   this.setState({ errorHappened: true })
    //   this.setState({ errorMsg: 'Se ha producido un error no especificado, esta ventana se va a recargar' })
    //   setTimeout(() => window.location.reload(), 2000)

    //   }    
  }
}

export default Home;