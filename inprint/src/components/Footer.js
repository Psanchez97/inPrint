import React, { Component, useContext, useState } from 'react'
import logoInstagram from './media/instagram.png'
import logoFacebook from './media/facebook.png'
import logoTwitter from './media/twitter.png'
import logoWhatsapp from './media/whatsapp.png'
import logoTikTok from './media/tiktok.png'

class Footer extends Component {

  async componentDidMount() {
    try{
    let winWidth = await window.innerWidth

    let winHeight = await window.innerHeight
    await this.setState({ winWidth: winWidth })

    await this.setState({ winHeight: winHeight })
    let device = await this.getDeviceType()
    await this.setState({ device: device })

    }catch(err){
     console.log("error")
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      winWidth: 0,
      winHeight: 0,
    }
  }


  render() {
    try {
      return (
        <footer className="footer shadow" style={{ width: "100%", height: "60px", backgroundColor: "white", position: "fixed", bottom: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div className="redes-sociales" style={{ textAlign: "center"}}>
            <span style={{ marginRight: "10px" }}>Nuestras redes</span>

            <a href="https://www.instagram.com" style={{ marginRight: "10px" }}><img src={logoInstagram} alt="Instagram" style={{ height: "40px" }} /></a>
            <a href="https://www.facebook.com" style={{ marginRight: "10px" }}><img src={logoFacebook} alt="Facebook" style={{ height: "40px" }} /></a>
            <a href="https://www.tiktok.com" style={{ marginRight: "10px" }}><img src={logoTikTok} alt="Tik Tok" style={{ height: "40px" }} /></a>
            <a href="https://www.twitter.com"><img src={logoTwitter} alt="Twitter" style={{ height: "40px" }} /></a>
          </div>
        </footer>
      );
    } catch (err) {
      this.setState({ errorHappened: true });
      this.setState({ errorMsg: 'Se ha producido un error no especificado, no se verá el footer' });
    }
  }
}

export default Footer
