import axios from 'axios'; 
import React,{Component} from 'react';

let file = '';

class UploadFile extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      files:[],
      message:"",
      selectedFile:true,
      tipoFabricacion: '',
      opcionesImpreso: [],
      opcionesMecanizado: [],
      fechaPedido: '',
    };

    this.handleTipoFabricacionChange = this.handleTipoFabricacionChange.bind(this);
    this.handleFechaPedidoChange = this.handleFechaPedidoChange.bind(this);

    }
  
  handleTipoFabricacionChange(event) {
    const tipoFabricacion = event.target.value;
    let opcionesImpreso = [];
    let opcionesMecanizado = [];

    if (tipoFabricacion === 'impreso') {
      // Definir opciones para fabricación impresa
      opcionesImpreso = ['Grey V4', 'Transparent Green', 'White V2'];
    } else if (tipoFabricacion === 'mecanizado') {
      // Definir opciones para fabricación mecanizada
      opcionesMecanizado = ['Mecanizado 3 ejes', 'Mecanizado 5 ejes'];
    }

    this.setState({
      tipoFabricacion,
      opcionesImpreso,
      opcionesMecanizado,
    });
  }

  handleFechaPedidoChange(event) {
    const selectedDate = new Date(event.target.value);
    const currentDate = new Date();
    const minimumDate = new Date();
    minimumDate.setDate(currentDate.getDate() + 3); // Fecha mínima permitida: actual + 3 días

    if (selectedDate < minimumDate) {
      // Si la fecha seleccionada es anterior a la fecha mínima permitida, no actualices el estado
      alert('Selecciona una fecha posterior a 3 días a partir de hoy.');
    } else {
      // Actualiza el estado solo si la fecha es válida
      const fechaPedido = event.target.value;
      this.setState({
        fechaPedido,
      });
    }
  }
    
  handleChangeFile = async (event) => {  

    let fileList = file.files
    
    //verifica que el archivo sea en extension .stl
    //de lo contrario no lo sube

    if (file.files.length > 0) {      
        var currentFiles = this.state.files;
        for (let key in fileList) {
        if (fileList[key].name !== undefined && fileList[key].name !== 'item'){
          if (fileList[key].name.slice(-4)===".stl" || fileList[key].name.slice(-4)===".obj"){
                currentFiles.push(fileList[key]);
                let message
                if (currentFiles.length===1){
                  message = currentFiles[0].name
                }else{
                  message = currentFiles.length.toString()  + " archivos"
                }
                this.setState({
                  files: currentFiles,
                  message: message
                });
          }
          else{
            this.setState({files : []})
            this.setState({message:'Formato de archivo incorrecto, sube un archivo .stl o .obj'});
          }
        }
      }      
    }
  }    
   
  onFileUpload = async () => {

    this.props.putLoading(true);    

    let arrayOfYourFiles = this.state.files

    const formData = new FormData();

    //si le das a subir y no hay nada
    if (arrayOfYourFiles.length===0){
      this.setState({message:'Selecciona primero un archivo'})
      this.props.putLoading(false);
    }
    //si le das a subir y el archivo acaba en .stl o .obj
    else if(arrayOfYourFiles[0].name.endsWith('.stl') || arrayOfYourFiles[0].name.endsWith('.obj')){    
      for (let i = 0; i < arrayOfYourFiles.length; i++) {
        formData.append('files', arrayOfYourFiles[i])
      }
      
      //detalles del archivo subido
      var token = this.props.userToken
      let url
      let config

      if (token!=="null"){
        config = {
          headers: {
            'content-type': 'multipart/form-data',
            'Authorization': 'Bearer ' + token
          },
        };

        url = this.props.endPoint+"uploadSTLfile/"
        axios.post(url, formData, config).then((response) => {
          var finalResponse = response.data
          this.props.processNumber(finalResponse, arrayOfYourFiles.length)
        });
      }else{ 
        return console.error('No tienes token intentando subir el archivo'); 
      }

      this.setState({files: []})      
      this.props.putLoading(false);      
    }      
  }
    
  fileData = () => {

    if (this.state.selectedFile) {        
      return (
        <div>
          <p >{this.state.message}</p>           
        </div>
      );
    } else {
      return (
        <div>
            Selecciona un archivo
        </div>
      );
    }
  }
    
  render() {

    const { tipoFabricacion, opcionesImpreso, opcionesMecanizado, fechaPedido } = this.state;

    let uploadButton = 
      <button className="btn btn-info btn-block btn-lg" style={{marginTop:'10%', backgroundColor:'#7CF7AB', borderColor:'#7CF7AB', fontSize:16}} 
              onClick={this.onFileUpload}>
              Subir archivo
      </button>

    let content = 
      <div> 
        <div>
          <input id='fileUpload' type='file' name="file" onChange={this.handleChangeFile} ref={(input) => { file = input; }} multiple hidden/>
          <label className="btn btn-info btn-block btn-lg" style={{backgroundColor:'#7CF7AB', borderColor:'#7CF7AB', fontSize:16}} for="fileUpload">
            Seleccionar archivo
          </label>
          <br/>
          {uploadButton}
        </div>
        <br/>
        {this.fileData()}
      </div>

    let selector = 
      <div style={{marginLeft:'7%', marginRight:'7%'}}>
        <label htmlFor="tipoFabricacion">Tipo de Fabricación:</label>
        <select
          id="tipoFabricacion"
          className="form-control"
          value={tipoFabricacion}
          onChange={this.handleTipoFabricacionChange}
        >
          <option value="">Selecciona</option>
          <option value="impreso">Impresión</option>
          <option value="mecanizado">Mecanizado</option>
        </select>

        {tipoFabricacion === 'impreso' && (
          <div style={{marginTop:'10%'}}>
            <label htmlFor="opcionesImpreso">Elige el material:</label>
            <select id="opcionesImpreso" className="form-control">
              {opcionesImpreso.map((opcion, index) => (
                <option key={index} value={opcion}>
                  {opcion}
                </option>
              ))}
            </select>
          </div>
        )}

        {tipoFabricacion === 'mecanizado' && (
          <div style={{marginTop:'10%'}}>
            <label htmlFor="opcionesMecanizado">Opciones Mecanizado:</label>
            <select id="opcionesMecanizado" className="form-control">
              {opcionesMecanizado.map((opcion, index) => (
                <option key={index} value={opcion}>
                  {opcion}
                </option>
              ))}
            </select>
          </div>
        )}

        <div style={{marginTop:'10%', marginBottom:'10%'}}>
          <label htmlFor="fechaPedido">Fecha de entrega:</label>
          <input
            type="date"
            id="fechaPedido"
            className="form-control"
            value={fechaPedido}
            onChange={this.handleFechaPedidoChange}
          />
        </div>
      </div>
    
    return (
      <table style={{ width: '100%', textAlign: 'center' }}>
        <tbody>
          <tr>
            <td style={{ padding: '10px'}}>
              <b style={{ fontSize: '18px'}}>Sube aquí tus archivos STL</b>
            </td>
          </tr>
          <tr>
            <td>
              <div>
                {selector}
              </div>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '10px'}}>
              <div className="card mb-4" style={{ width: '100%'}}>
                <div className="card-body">
                  {content}
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    );
  
    
  }
}
 
export default UploadFile;
