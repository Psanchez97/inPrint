//import React, { Component, useContext,  useEffect  } from 'react'
import React, { Component } from 'react'
import Navbar from './Navbar'
import EmployeeDetails from './EmployeeDetails'
import ErrorHappened from './ErrorHappened'
import Register from './Register'
import Login from './Login'
import { PlaceholderButton, Spinner } from 'reactstrap'
import fondoAvif from '../carretera.avif'
import camionesAvif from '../camiones_aparcados.avif'
import fondoPNG from '../carretera.png'
import camionesPNG from '../camiones_aparcados.png'
import List from './List'
import ListManager from './ListManager'
import Actions from './Actions'
import Creation from './Creation'
import CreationManager from './CreationManager'
import GeneralView from './GeneralView'
import ModalActivity from './ModalActivity'
import SendSmsActivity from './SendSmsActivity'
import ModalLasts from './ModalLasts'
import ModalContinental from './ModalContinental'
import ModalChangePass from './ModalChangePass'
import ANDirecto from './ANDirecto'
import NavigatorModal from './NavigatorModal'
import TripCreation from './TripCreation'
import SelectProviderModal from './SelectProviderModal'
import UploadTGDFile from './UploadTGDFile'
import UploadXLSFile from './UploadXLSFile'
import JustToTest from './JustToTest'
import Footer from './Footer'
import HolidayEmployee from './HolidayEmployee'
import ModalPeriod from './ModalPeriod'
import ModalTrip from './ModalTrip'
import CheckState from './CheckState'
import axios from 'axios';
import { parseISOWithOptions } from 'date-fns/fp'
import AskInstall from './AskInstall';
//import PushNotification from './PushNotification';

import '@fortawesome/fontawesome-free/css/all.css';
import CustomSpinner from './CustomSpinner'




class Home extends Component {
  async componentDidMount(recalled=0) {
 
    
  

    window.onload = function () {
      window.scrollTo(0, 0);
    }

    const img = new Image();
    img.src = camionesAvif;

    img.onerror = () => {
      this.setState({ camionesFinal: camionesPNG });
    };

    img.onload = () => {
      this.setState({ camionesFinal: camionesAvif });
    };

    const imgFondo = new Image();
    imgFondo.src = fondoAvif;

    imgFondo.onerror = () => {
      this.setState({ fondoFinal: fondoPNG });
    };

    imgFondo.onload = () => {
      this.setState({ fondoFinal: fondoAvif });
    };
    var params
    try {
      /*Se pone una nueva línea */
      var askLogin = 6
      // esta linea ya estaba
      let deviceType = await this.getDeviceType()
      await this.setState({ device: deviceType })
      let winWidth = window.innerWidth

      await this.setState({ winWidth: winWidth })
      // linea nueva
      if (askLogin > 5) {
        this.setState({ askLogin: 6 })
        const token = localStorage.getItem("TraxainUserToken")
        if (token !== "null") {
          //console.log("no es null")
          await this.setState({ userToken: token })
          // hasta aquí
          //var token = await this.getToken()

          let requestOptions = await {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token
            },

          };


          var response = await fetch(this.state.endPoint + "user-role/", requestOptions);
          if (!response.ok) {
            throw new Error('Request failed with status ' + response.status);
          }
          response = await response.json();
          this.setState({ currentUser: response["user_id"] })
          await this.setState({ userRole: "other prov"})
          await this.setState({ userRole: response["role"] })

          // nueva linea
          this.setState({ selectedMode: "Conventional" })


          if (response == null || (!response.ok && response.type === 'cors')) {
            await this.setState({ errorHappened: true })
            await this.setState({ errorMsg: 'Aún no tenemos datos para ti. Contáctanos en traxain.com, escribiendo a ignacio@traxain o llamando al +34 638 26 96 33 (1)' })

          } else {
            params = await this.getParams(token)
            
            if (params !== "nothing"){
              if(params["tk"]){
                response["role"]==="employee"
                this.putFilterAlerts(true)
              }
              
            }


            if (response["role"] === "admin" || response["role"] === "manager") {
              //console.log("admin")

              if (response["tac_provider"] === "nulo") {
                await this.setState({ askTacProvider: true })
              } else if (response["tac_provider"] === "Otro") {
                await this.setState({ askTacProvider: false })
                await this.setState({ upLoadTGDManually: true })
              }


              let modes = [{ label: "Disponible", value: "available" },
              { label: "Conducción", value: "driving" },
              { label: "Descanso", value: "resting" },
              { label: "Trabajo", value: "working" }]

              if (params=="nothing"){

                await this.usersEmployeeCount(0, 0, "text", { "modes": modes })
              }else if(params["empId"]!==0){

                let empId = parseInt(params["empId"])

                await this.setState({displayType:'list'})
                let newToken = null
                let filters 
                if (Object.keys(params["filters"]).length===0){
                  filters={}
                }else{
                  filters=JSON.parse(params["filters"])
                }

            
                await this.search(empId,parseInt(params["start"]),parseInt(params["end"]),filters, true)
                await this.setState({somethingSearched:2})


              }else{
                await this.usersEmployeeCount(0, 0, "text", { "modes": modes })
              }


              

              





            }else  if(response["role"]==="employee"){
              //console.log("employee")
                      
              let empIdentification = parseInt(response["empIdentification"])
                    
              if (params ==="nothing"){
                      
                //
                await this.setState({somethingSearched:0})
                  
                await this.search(empIdentification,0,0,{}, true)
            
              }else{
                await this.setState({displayType:'list'})
                let newToken = null
                let filters 
                if (Object.keys(params["filters"]).length===0){
                  filters={}
                }else{
                  filters=JSON.parse(params["filters"])
                }

                if (params["tk"]){
                 // console.log("HAY TOKEN")
                  newToken=params["tk"]
                }
            
                localStorage.setItem("TraxainUserToken", newToken);
            
                await this.search(empIdentification,parseInt(params["start"]),parseInt(params["end"]),filters, true)
                await this.setState({somethingSearched:2})
              }
            }
          }

        } else {
          //console.log("estoy en el else")
          params = await this.getParams(token)
            if (params !== "nothing"){
              //console.log("no es nothing")
              this.putFilterAlerts(true)

              await this.setState({displayType:'list'})
                let newToken = null
                let filters 
                if (Object.keys(params["filters"]).length===0){
                  filters={}
                }else{
                  filters=JSON.parse(params["filters"])
                }
               // console.log(params)
                try{
                  //console.log("HAY TOKEN")
                  newToken=params["tk"]
                }catch{
                  //console.log("no hay token")
                }
                  
                
                //console.log(newToken)
                localStorage.setItem("TraxainUserToken", newToken);
                this.setState({ userToken:newToken})
                let requestOptions = await {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + newToken
                  },
      
                };

                var response = await fetch(this.state.endPoint + "user-role/", requestOptions);
            if (!response.ok) {
              throw new Error('Request failed with status ' + response.status);
            }
            response = await response.json();
            this.setState({ currentUser: response["user_id"] })
            await this.setState({ userRole: "other prov"})
            await this.setState({ userRole: response["role"] })

            // nueva linea
            this.setState({ selectedMode: "Conventional" })

            let empIdentification = parseInt(response["empIdentification"])

            



                await this.search(empIdentification,parseInt(params["start"]),parseInt(params["end"]),filters, true)
                await this.setState({somethingSearched:2})
              
            }else{
              this.setState({ userToken: "null" })

            }
        }

        //return token

      } else {
        this.setState({ userToken: "noToken" })
        this.setState({ askLogin: 0 })


        let requestOptions = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer noToken"
          }

        }
        var response = await fetch(this.state.endPoint + "user-role/" + "notoken", requestOptions).then((response) => response.json())
          .then(function (data) {
            //return data
          });
        this.setState({ currentUser: 0 })




      }

     
            
    } catch (err) {
      if (recalled===0){
       let newEndpoint = await this.state.endPoint2
       await this.setState({endPoint:newEndpoint})
       await this.componentDidMount(1)
      }else{
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'Detectado problema de red, compruebe su conexión' })
      }
    }
    await this.setState({pageFullyLoaded: true})
  }

  async searchManual(input, type) {

    let stringToSearch = this.state.stringToSearch
    let pointer = this.state.pointer
    let employeesList
    await this.setState({ showList: false })
    await this.setState({ showListManager: false })

    if (input.key === "Backspace") {
      if (stringToSearch.length > 0) {
        stringToSearch = stringToSearch.substring(0, pointer - 1).concat(stringToSearch.substring(pointer, stringToSearch.length))
        employeesList = this.state.employees
        this.setState({ pointer: pointer - 1 })
      }else{
        employeesList = this.state.employees
      }
    } else if (input.key.length === 1) {


      stringToSearch = stringToSearch.substring(0, pointer).concat(input.key, stringToSearch.substring(pointer, stringToSearch.length))
      employeesList = this.state.employeesList

      this.setState({ pointer: pointer + 1 })

    } else if (input.key === "ArrowLeft") {
      employeesList = this.state.employees

      if (pointer > 0) {
        this.setState({ pointer: pointer - 1 })

      }

    } else if (input.key === "ArrowRight") {
      employeesList = this.state.employeesList
      if (pointer < stringToSearch.length) {
        this.setState({ pointer: pointer + 1 })
      }

    } else if (input.key === "Enter") {
      employeesList = this.state.employees
    }

    let stringToSearchLen = stringToSearch.length
    var employeesListNew = employeesList.filter(employee => employee[type].substring(0, stringToSearchLen).toUpperCase() === stringToSearch.toUpperCase());

    if (employeesListNew.length === 0) {
      employeesListNew = this.state.employees
    }


    // aqui voy a buscar lista
    await this.setState({
      stringToSearch: stringToSearch,
      employeesList: employeesListNew,
      showList: true
    })
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
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'Se ha producido un error al detectar el tiempo de dispositivo' })

    }
  };


 


  constructor(props) {
    super(props)
    this.childRefEmployee = React.createRef()
    this.childRefGeneral = React.createRef()
    this.childRefHandle = React.createRef()
    
    this.state = {
      //recurda actualizar esto en el proxy package.json
      endPoint:'https://api.traxain.xyz/',
      endPoint2:'https://api.ecargo.link/',
      // endPoint: 'http://localhost:8000/',
      // endPoint2: 'http://localhost:8000/',
      //endPoint2: "https://api.ecargo.link/",
      //endPoint: "https://api.traxain.xyz/",
      camionesFinal: camionesPNG,
      fondoFinal: fondoPNG,
      filterAlerts:false,
      allowed: '',
      winWidth: 0,
      winHeight: 0,
      chargeStatusTGD: 0,
      loading: false,
      employeesList: [],
      managersList: [],
      activitiesList: [],
      thisEmloyeeId: {},
      myEmployee: undefined,
      somethingSearched: 0,
      wantToCreate: true,
      wantToCreateManager: false,
      dontCall: false,
      userRole: '',
      errorHappened: false,
      myEmployeeCount: '',
      device: '',
      date: '',
      errorMsg: '',
      selectedMode: '',
      userToken: "",
      currentUser: null,
      product: 'autonomina',
      askLogin: 6,
      displayType: 'text',
      start: 0,
      end: 0,
      originTrip: '',
      destinationTrip: '',
      modeTrip: '',
      dateTrip: 0,
      filters: {},
      generalView: [],
      showModalActivity: false,
      showSendSmsActivity: false,
      showLastModal: '',
      selectedActivity: 0,
      selectedActivityDict:{},
      listInit: 0,
      activityListInit: 0,
      tripsListInit: 0,
      defaultComments: '',
      defaultPlace: '',
      defaultIdentifier: '',
      employeesSelectedToShow: [],
      employeesSelected: [],
      askContCred: false,
      newPassAsked: false,
      showANDirecto: false,
      showNavigatorModal: false,
      showCreateTripFields: false,
      showPeriodModal:false,
      showTripModal:false,
      showCheckStateModal:false,
      activeProcessId: 0,
      selectedPeriod:0,
      selectedTrip:0,
      employees: [],
      tac_provider: '',
      askTacProvider: false,
      showPlaceholderOthers: false,
      upLoadTGDManually: true,
      periodsListInit: 0,
      stringToSearch: '',
      showList: true,
      showListManager: false,
      pointer: 0,
      showSimulator: false,
      showTestDetails: false,
      showHolidays: false,
      pageFullyLoaded: false,
      numberOfFiles: 0,
      passedCalls:0,
      stateHistory: [],
      stateHistoryPast: [],
      stateFuture: [],
      backClicsCount: 0,
      childHistory: [],
      childFuture: []

    }

    this.createTrip = this.createTrip.bind(this)
    this.errorStatus = this.errorStatus.bind(this)
    this.selectAccessMode = this.selectAccessMode.bind(this)
    this.showError = this.showError.bind(this)
    //this.getToken = this.getToken.bind(this)
    this.selectProduct = this.selectProduct.bind(this)
    this.showCreationFields = this.showCreationFields.bind(this)
    this.showCreationManager = this.showCreationManager.bind(this)
    this.createEmployee = this.createEmployee.bind(this)
    this.createManager = this.createManager.bind(this) 
    this.employees_manager = this.employees_manager.bind(this)
    this.usersEmployeeCount = this.usersEmployeeCount.bind(this)
    this.usersManagerCount = this.usersManagerCount.bind(this)
    this.usersEmployeeLoad = this.usersEmployeeLoad.bind(this)
    this.search = this.search.bind(this)
    this.dowloadEmployeeReport = this.dowloadEmployeeReport.bind(this)
    this.seslectDisplayMode = this.seslectDisplayMode.bind(this)
    this.showModalActivity = this.showModalActivity.bind(this)
    this.showSendSmsActivity = this.showSendSmsActivity.bind(this)
    this.showModalPeriod = this.showModalPeriod.bind(this)
    this.showEditTripFields = this.showEditTripFields.bind(this)
    this.onClose = this.onClose.bind(this)
    this.onCloseNav = this.onCloseNav.bind(this)
    this.editActivityDetails = this.editActivityDetails.bind(this)
    this.editSendSms = this.editSendSms.bind(this)
    this.editPeriodDetails = this.editPeriodDetails.bind(this)
    this.editTripDetails = this.editTripDetails.bind(this)
    this.showCheckState = this.showCheckState.bind(this)
    this.processNumber = this.processNumber.bind(this)
    this.deleteTrip = this.deleteTrip.bind(this)
    this.editEmployeeListInit = this.editEmployeeListInit.bind(this)
    this.editActivityListInit = this.editActivityListInit.bind(this)
    this.editEmployeesSelected = this.editEmployeesSelected.bind(this)
    this.editContinentalCredentials = this.editContinentalCredentials.bind(this)
    this.editRole = this.editRole.bind(this)
    this.askNewPass = this.askNewPass.bind(this)
    this.assignNewPass = this.assignNewPass.bind(this)
    this.getOldPass = this.getOldPass.bind(this)
    this.getParams = this.getParams.bind(this)
    this.selectANDirecto = this.selectANDirecto.bind(this)
    this.showNavigatorModal = this.showNavigatorModal.bind(this)
    this.showCreateTripFields = this.showCreateTripFields.bind(this)
    this.editTripsListInit = this.editTripsListInit.bind(this)
    this.editTacProvider = this.editTacProvider.bind(this)
    this.putLoading = this.putLoading.bind(this)
    this.editPeriodsListInit = this.editPeriodsListInit.bind(this)
    this.searchManual = this.searchManual.bind(this)
    this.dowloadActivityReport = this.dowloadActivityReport.bind(this)
    this.dowloadPeriodsReport = this.dowloadPeriodsReport.bind(this)
    this.activateSimulator = this.activateSimulator.bind(this)
    this.setEmployee = this.setEmployee.bind(this)
    this.showHolidays = this.showHolidays.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.putFilterAlerts = this.putFilterAlerts.bind(this)
    this.actualizarEstadoYAlmacenar = this.actualizarEstadoYAlmacenar.bind(this)
    this.volverAlPasado = this.volverAlPasado.bind(this)
    this.regresoAlFuturo = this.regresoAlFuturo.bind(this)
    this.anaObregon = this.anaObregon.bind(this)

  }


  async putFilterAlerts(force=false){
    if (force){
      await this.setState({filterAlerts:true})
    }else{
      let filterAlerts = this.state.filterAlerts

    if (filterAlerts){
      await this.setState({filterAlerts:false})
      console.log("Filtrado por alertas inactivo")
    }else{
      await this.setState({filterAlerts:true})
      console.log("Filtrado por alertas activo")
    }
    }
    
  }


actualizarEstadoYAlmacenar = (nuevoEstado) => {
    const { stateHistory, ...restOfState } = this.state;  
    const newState = { ...restOfState, ...nuevoEstado };
  

    this.setState(prevState => ({
      ...prevState,
      ...nuevoEstado,
      stateHistory: [...prevState.stateHistory, { ...prevState }]
    }), () => {

      
    });
};

volverAlPasado = () => {
  const { stateHistory, stateFuture } = this.state;

  if (stateHistory.length >= 1) {
      const newState = stateHistory[stateHistory.length - 1];
      const updatedHistory = stateHistory.slice(0, -1);

      this.setState({
          ...newState,
          stateHistory: updatedHistory,
          stateFuture: [...stateFuture, { ...this.state }]
      });
  } 


  try{
    this.childRefEmployee.current.volverAlPasadoEmployees()
  }
  catch{
  }  


  try{
      this.childRefGeneral.current.volverAlPasadoGeneral()
  }
  catch{
  }
  
  
};

regresoAlFuturo = () => {
  const { stateFuture } = this.state;

  if (stateFuture && stateFuture.length >= 1) {
      const nextState = stateFuture[stateFuture.length - 1];
      const updatedFuture = stateFuture.slice(0, -1);

      this.setState({
          ...nextState,
          stateFuture: updatedFuture
      });
  }
  try{
    this.childRefEmployee.current.regresoAlFuturoEmployees()
  }
  catch{

  }
  try{
  this.childRefGeneral.current.regresoAlFuturoGeneral()
  }
  catch{

  }
  try{
    this.childRefHandle.current.filterAlerts()
  }
  catch{}
};


anaObregon = (stateHistory, stateFuture) =>{
  this.setState({childHistory : stateHistory})
  this.setState({childFuture : stateFuture})
}


  async setEmployee(employee) {
    await this.setState({ showTestDetails: false })
    await this.setState({ myEmployee: employee })
    await this.setState({ showTestDetails: true })
  }


  async activateSimulator() {
    let showSimulator = this.state.showSimulator
    this.setState({ wantToCreate: false })


    if (showSimulator) {
      this.setState({ showSimulator: false })
    } else {
      this.setState({ showSimulator: true })
    }

    this.setState({ wantToCreate: true })

  }

  async dowloadActivityReport() {

  //try {
      let empId
      let start
      let end
      let filters

      if (this.state.myEmployee) {
        empId = this.state.myEmployee.id
        start = this.state.start
        end = this.state.end
        filters = this.state.filters
      } else {
        empId = "",
          start = 0,
          end = 0,
          filters = {}

      }

      await this.setState({ loading: true })
      let token = this.state.userToken

      var bodyJS = JSON.stringify({
        "id": 0,
        "start": start,
        "end": end,
        "displayType": "nada",
        "filters": {},

      })
      let requestOptions = await {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body:bodyJS
      };


      var response = await fetch(this.state.endPoint + "create_report/a", requestOptions)

      var file = await response.blob()

      var fileURL = URL.createObjectURL(file)

      var a = document.createElement('a')

      a.href = fileURL
      let date = new Date().toDateString()
      a.download = "Actividades" + "_" + date + ".xlsx"
      a.click()
      await this.setState({ loading: false })

    // } catch (err) {
    //   await this.setState({ errorHappened: true })
    //   await this.setState({ errorMsg: 'Error al descargar el reporte' })
    //   this.setState({ loading: false })

    // }
  }

  async dowloadPeriodsReport() {

    try {

      await this.setState({ loading: true })
      let token = this.state.userToken

      

      var bodyJS = JSON.stringify({
        "id": 0,
        "start": 0,
        "end": 0,
        "displayType": "nada",
        "filters": {},

      })
      let requestOptions = await {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body:bodyJS
      };
      //console.log("voy a crear reporte")

      var response = await fetch(this.state.endPoint + "create_report/b", requestOptions)

      var file = await response.blob()

      var fileURL = URL.createObjectURL(file)

      var a = document.createElement('a')

      a.href = fileURL
      let date = new Date().toDateString()
      a.download = "Por_dia" + "_" + date + ".pdf"
      a.click()
      await this.setState({ loading: false })

    } catch (err) {
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'Error al descargar el reporte' })
      this.setState({ loading: false })
    }
  }


  async dowloadEmployeeReport(e) {

    try {

      await this.setState({ loading: true })
      let token = this.state.userToken
      var start = 0
      var end = new Date()
      end = await end.getTime() /1000

      if (this.state.myEmployee) {

        start = new Date(this.state.myEmployee.startString)
        start = start.getTime() / 1000
      }

      if (this.state.myEmployee) {
        end = new Date(this.state.myEmployee.endString)
        end = end.getTime() / 1000
      }
      var bodyJS = JSON.stringify({
        "id": 0,
        "start": start,
        "end": end,
        "displayType": "nada",
        "filters": {},

      })
      let requestOptions = await {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body:bodyJS
      };


      var response = await fetch(this.state.endPoint + "create_report/"+ e.toString(), requestOptions)

      var file = await response.blob()

      var fileURL = URL.createObjectURL(file)

      var a = document.createElement('a')

      a.href = fileURL
      let date = new Date().toDateString()
      a.download = "Reporte_"+ e.toString() + "_" + date + ".pdf"
      a.click()
      await this.setState({ loading: false })

    } catch (err) {
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'Error al descargar el reporte' })
      this.setState({ loading: false })
    }
  }


  async putLoading(boolValue) {
   
    
    await this.setState({ loading: boolValue })
  }
  async showNavigatorModal() {

    try {

      let showNavigatorModal = this.state.showNavigatorModal

      if (showNavigatorModal) {
        await this.setState({ showNavigatorModal: false })
      } else {
        await this.setState({ showNavigatorModal: true })
      }
    } catch (err) {
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'Se ha producido un error al mostrar el elemento de navegación' })

    }

  }

  async editTacProvider(provider) {
    let token = this.state.userToken

    let requestOptions = await {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        "a": provider,
      }),
    };


    var response = await fetch(this.state.endPoint + "select_tac_provider/", requestOptions).then((response) => response.json())




    if (provider === "Tis") {
      this.setState({ askContCred: true })
    }
    if (provider === "Otro") {
      this.setState({ showPlaceholderOthers: true })
    }


  }

  async createTrip(origin, destination, tripDate, mode) {


    try {


      await this.setState({ loading: true })

      await this.setState({ somethingSearched: 0 })



      var employee_id = this.state.myEmployee.id

      let token = this.state.userToken

      var empId = this.state.myEmployee.id
      var start = this.state.start
      var end = this.state.end
      var filters = this.state.filters

      let request = {
        "id": empId,
        "start": start,
        "end": end,
        "filters": filters,

      }

      let requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          "origin": origin,
          "destination": destination,
          "date": tripDate,
          "arrival": 1,
          "mode": mode,
          "employee_id": employee_id,
        }),
      }

      

      var response = await fetch(this.state.endPoint + "trip_lean", requestOptions);

      if (!response.ok && response.type === 'cors') {
        await this.setState({ errorHappened: true })
        await this.setState({ errorMsg: 'No hemos podido crear este viaje' })
        this.setState({ loading: false })
      } else {

        await this.search(empId, 0, 0, {}, true);

        await this.setState({ loading: false })
      }


    } catch (err) {

      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'Por favor, revisa los datos' })


    }
  }


  async askNewPass() {
    try {
      this.setState({ newPassAsked: true })
    } catch (err) {
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'Se ha producido un error (1)' })

    }
  }


  async getOldPass(oldPassword){
    try {
      const CryptoJS = require("crypto-js");
      // variables que corresponden a Salt
      const salt = "farm1990M0O";
      const salt1 = "f1nd1ngn3m0";
      // se utilizó una variable "let" para poder reutilizarla dentro del código
      // Se añade salt a la contraseña y se cifra con SHA256 y se pasa a String
      let hashPassword = CryptoJS.SHA256(salt1+oldPassword+salt).toString();
      let token = this.state.userToken

      let requestOptions = await {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          "a": hashPassword,
        }),
      };

      var response = await fetch(this.state.endPoint + "get_old_pass/", requestOptions).then((response) => response.json())

      if (response === "success") {
        return true
      } else {
        let requestOptions = await {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          },
          body: JSON.stringify({
            "a": oldPassword,
          }),
        };

        response = await fetch(this.state.endPoint + "get_old_pass/", requestOptions).then((response) => response.json())

        if (response === "success") {
          return true
        } else {
          return false
        }
      }
    } catch (err) {
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'Se ha producido un error (2)' })

    }
  }



  async assignNewPass(password1) {

    try {

      let token = this.state.userToken


      let requestOptions = await {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          "a": password1,
        }),
      };


      var response = await fetch(this.state.endPoint + "change_pass/", requestOptions).then((response) => response.json())

      if (!response.ok && response.type === 'cors') {
        await this.setState({ errorHappened: true })
        await this.setState({ errorMsg: 'Por favor, revisa que las contraseñas sean iguales y que tengas más de 8 caracteres' })

      }

      if (response === "success") {

        setTimeout(() => window.location.reload(), 100)
      }
    } catch (err) {
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'Se ha producido un error (2)' })

    }
  }

  async editContinentalCredentials(account, password, source_code, source_password) {
    try {
      var token = this.state.userToken


      let requestOptions = await {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          "account": account,
          "password": password,
          "source_code": source_code,
          "source_password": source_password,
        }),
      };


      var response = await fetch(this.state.endPoint + "edit-cont-details/", requestOptions).then((response) => response.json())
      await this.onClose()
      if (response === 'none') {
        await this.setState({ errorHappened: true })
        await this.setState({ errorMsg: 'Tus credenciales no funcionan, vuelve a probar' })


      }
      setTimeout(() => window.location.reload(), 100);

    } catch (err) {
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'Se ha producido un error (3)' })

    }
  }



  async editRole(role) {
    try {
      var token = this.state.userToken
      let requestOptions = await {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          "a": role,
        }),
      };


      var response = await fetch(this.state.endPoint + "edit-user-role/", requestOptions)
      if (!response.ok && response.type === 'cors') {
        await this.setState({ errorHappened: true })
        await this.setState({ errorMsg: 'No hemos podido actualizar el rol de este usuario' })

      }
      await this.onClose()


      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'Aún no tenemos datos para ti. Contáctanos en traxain.com, escribiendo a ignacio@traxain o llamando al +34 638 26 96 33 (2)' })


    } catch (err) {
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'Se ha producido un error (4)' })

    }
  }






  async editEmployeesSelected(employeesSelectedToShow, employeesSelected) {
    try {
      this.setState({ employeesSelectedToShow: employeesSelectedToShow })
      this.setState({ employeesSelected: employeesSelected })
    } catch (err) {
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'Se ha producido un error (5)' })

    }
  }


  async editPeriodDetails(diet, comment) {
    await this.onClose()

    await this.setState({ somethingSearched: 0 })
    try {

      var token = this.state.userToken
      var periodId = parseInt(this.state.selectedPeriod["id"])
      let empId = this.state.myEmployee.id

      let dietInt = diet
        if (isNaN(dietInt)){
          dietInt =parseFloat(nat_feed_diet.replace(",","."))
        }

       
        let start = this.state.start
        let end = this.state.end
        let filters = this.state.filters
        let searchRequest = {
          "id": empId,
          "start": start,
          "end": end,
          "filters": filters,
  
        }

      




     
      let requestOptions = await {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          "a": empId,
          "b": periodId,
          "c": comment,
          "d": dietInt,
          "e": searchRequest
        }),
      };
      await this.setState({ loading: true })

      var response = await fetch(this.state.endPoint + "edit_diet/", requestOptions)
      if (response.type === 'cors' && !response.ok) {
        await this.setState({ errorHappened: true })
        await this.setState({ errorMsg: 'No hemos podido actualizar los detalles de esta actividad' })
        await this.setState({ loading: false })

      } else {

        let myEmployee = await response.json()

        await this.setState({ myEmployee: myEmployee })
        await this.setState({ showModalActivity: false })
        await this.setState({ somethingSearched: 2 })
        await this.setState({ loading: false })
      }
    } catch (err) {
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'No hemos podido editar esos detalles' })
      await this.setState({ loading: false })

    }
  }
  
  async comprobarEstado(status) {
    this.setState({ chargeStatusTGD: status })
    setTimeout(() => this.showCheckState(), 2000);
  }

  

  async processNumber(processId, numFiles){
    await this.setState({ showCheckStateModal: true })
    await this.setState({ activeProcessId: processId })
    await this.setState({ chargeStatusTGD: 1})
    await this.setState({numberOfFiles: numFiles})
    this.showCheckState()
    
  }

  async showCheckState() {
    try {
      let numberOfFiles = this.state.numberOfFiles
      let passedCalls = this.state.passedCalls
      let timeToTimeOut = numberOfFiles*16000
      if (timeToTimeOut > 120000){
        timeToTimeOut=120000
      }
     

      if(this.state.chargeStatusTGD<100 && this.state.userToken!="null" && this.state.userToken!=null){
      
        var responseGood
        let processId = await this.state.activeProcessId
        await this.setState({ showCheckStateModal: true });
        let prevStatusAdvance = await this.state.chargeStatusTGD
      
        let config = {
          headers: {
            'content-type': 'multipart/json'
          },
        };
        


        var responseData

        axios.post(this.state.endPoint + "process_started/"+ processId.toString(), config).then((response) => {
          responseGood = response
          responseData = response.data

          if (responseData!=null && responseData!=undefined ){

            if (responseData > prevStatusAdvance){
              this.setState({ chargeStatusTGD: responseData })
              //this.usersEmployeeCount(0, 0, "text", {})
            }
            
          }
          
        });
     
          await this.setState({passedCalls:passedCalls+1})

          
        
          if(this.state.chargeStatusTGD<100){
         
            setTimeout(() => this.showCheckState(), timeToTimeOut);
          }
        
      } else {
        this.setState({ showCheckStateModal: true });
      }
    } catch (err) {
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'No hemos podido mostrar el proceso' })
    }
  }

  
  async editTripDetails(origin, destination, time, mode) {
    await this.onClose()
    await this.setState({ somethingSearched: 0 })

    try {
      let token = this.state.userToken
      let tripId = parseInt(this.state.selectedTrip)
      let empId = this.state.myEmployee.id

      let requestOptions = await {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          "a": empId,
          "b": tripId,
          "c": origin,
          "d": destination,
          "e": time,
          "f": mode,
        }),
      };
      
      await this.setState({ loading: true })
      var response = await fetch(this.state.endPoint + "edit_trip/", requestOptions)
      if (response.type === 'cors' && !response.ok) {
        await this.setState({ errorHappened: true })
        await this.setState({ errorMsg: 'No hemos podido actualizar los detalles de esta actividad' })
        await this.setState({ loading: false })
      } else {
        let myEmployee = await response.json()
        await this.setState({ myEmployee: myEmployee })
        await this.setState({ showModalActivity: false })
        await this.setState({ somethingSearched: 2 })
        await this.setState({ loading: false })
        await this.search(empId, 0, 0, {}, true)
      }

    } catch (err) {
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'No hemos podido editar esos detalles' })
      await this.setState({ loading: false })
    }
  }

  async deleteTrip(selectedTriptoDelete) {
    await this.onClose()
    await this.setState({ somethingSearched: 0 })

    try {
      let token = this.state.userToken
      let tripId = parseInt(selectedTriptoDelete)
      let empId = this.state.myEmployee.id

      let requestOptions = await {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          "a": empId,
          "b": tripId,
        }),
      };
      
      await this.setState({ loading: true })
      var response = await fetch(this.state.endPoint + "delete_trip/", requestOptions)
      if (response.type === 'cors' && !response.ok) {
        await this.setState({ errorHappened: true })
        await this.setState({ errorMsg: 'No hemos podido actualizar los detalles de esta actividad' })
        await this.setState({ loading: false })
      } else {
        let myEmployee = await response.json()
        await this.setState({ myEmployee: myEmployee })
        await this.setState({ showModalActivity: false })
        await this.setState({ somethingSearched: 2 })
        await this.setState({ loading: false })
        await this.search(empId, 0, 0, {}, true)
      }

    } catch (err) {
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'No hemos podido editar esos detalles' })
      await this.setState({ loading: false })
    }
  }
  


  async editActivityDetails(comments, place, mode) {
    await this.onClose()

    let modeg

    await this.setState({ somethingSearched: 0 })
    //try {

      var token = this.state.userToken
      var id = parseInt(this.state.selectedActivity)
      let empId
      try{
         empId = this.state.myEmployee.id
      }catch{
        empId = this.state.selectedActivity['employee_id']
      }
      
      let start = this.state.start
      let end = this.state.end
      let filters = this.state.filters

      let modeGood
      let placeGood
      let commentsGood
      if (mode){
        modeGood = mode
      }else{
        modeGood = ""
      }
      if (place){
        placeGood = place
      }else{
        placeGood = ""
      }
      if (comments){
        commentsGood = comments
      }else{
        commentsGood = ""
      }


      let searchRequest = {
        "id": empId,
        "start": start,
        "end": end,
        "filters": filters,

      }
      let requestOptions = await {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          "id": id,
          "modeGood": modeGood,
          "comments": commentsGood,
          "place": placeGood,
          "searchRequest": searchRequest
        }),
      };

      
      await this.setState({ loading: true })

      var response = await fetch(this.state.endPoint + "edit-activity-details/", requestOptions)
      if (response.type === 'cors' && !response.ok) {
        await this.setState({ errorHappened: true })
        await this.setState({ errorMsg: 'No hemos podido actualizar los detalles de esta actividad' })
        await this.setState({ loading: false })

      } else {

        let myEmployee = await response.json()

        await this.setState({ myEmployee: myEmployee })
        await this.setState({ showModalActivity: false })
        await this.setState({ showSendSmsActivity: false})
        await this.setState({ somethingSearched: 2 })
        await this.setState({ loading: false })
      }
    // } catch (err) {
    //   await this.setState({ errorHappened: true })
    //   await this.setState({ errorMsg: 'No hemos podido editar esos detalles' })
    //   await this.setState({ loading: false })

    // }
  }
  /********************************************************************************** */

  async editSendSms(comments) {//, place, mode
    await this.onClose()

    let modeg

    await this.setState({ somethingSearched: 0 })
    //try {

      var token = this.state.userToken
      var id = parseInt(this.state.selectedActivity)
      let empId
      try{
         empId = this.state.myEmployee.id
      }catch{
        empId = this.state.selectedActivity['employee_id']
      }
      
      let start = this.state.start
      let end = this.state.end
      let filters = this.state.filters

      //let modeGood
      //let placeGood
      let commentsGood
      // //if (mode){
      // //  modeGood = mode
      // }else{
      //   modeGood = ""
      // }
      // if (place){
      //   placeGood = place
      // }else{
      //   placeGood = ""
      // }
      if (comments){
        commentsGood = comments
      }else{
        commentsGood = ""
      }


      let searchRequest = {
        "id": empId,
        "start": start,
        "end": end,
        "filters": filters,

      }
      let requestOptions = await {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          "id": id,
          //"modeGood": modeGood,
          "comments": commentsGood,
          //"place": placeGood,
          "searchRequest": searchRequest
        }),
      };

      
      await this.setState({ loading: true })

      var response = await fetch(this.state.endPoint + "edit-activity-details/", requestOptions)
      

      if (response.type === 'cors' && !response.ok) {
        await this.setState({ errorHappened: true })
        await this.setState({ errorMsg: 'No hemos podido enviar el mensaje' })
        await this.setState({ loading: false })

      } else {

        let myEmployee = await response.json()

        await this.setState({ myEmployee: myEmployee })
        await this.setState({ showSendSmsActivity: false })
        await this.setState({ somethingSearched: 2 })
        await this.setState({ loading: false })
      }
    // } catch (err) {
    //   await this.setState({ errorHappened: true })
    //   await this.setState({ errorMsg: 'No hemos podido editar esos detalles' })
    //   await this.setState({ loading: false })

    // }
  }



  async showModalActivity(selectedActivity) {
    
    try {
      await this.setState({ showModalActivity: true });
      await this.setState({ selectedActivity: selectedActivity["id"] })
      await this.setState({ selectedActivityDict: selectedActivity })


      if (selectedActivity["datails"]) {
        await this.setState({ defaultComments: selectedActivity["datails"][0] })
        await this.setState({ defaultPlace: selectedActivity["datails"][1] })
        await this.setState({ defaultIdentifier: selectedActivity["datails"][2] })

      }
    } catch (err) {
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'Se ha producido un error (6)' })
    }
  };

  async showSendSmsActivity(selectedActivity) {
    //try {
      
      await this.setState({ showSendSmsActivity: true });
      await this.setState({ selectedActivity: selectedActivity["id"] })
      await this.setState({ selectedActivityDict: selectedActivity })

      if (selectedActivity["datails"]) {
        await this.setState({ defaultComments: selectedActivity["datails"][0] })
        //await this.setState({ defaultPlace: selectedActivity["datails"][1] })
        //await this.setState({ defaultIdentifier: selectedActivity["datails"][2] })

      }
    // } catch (err) {
    //   await this.setState({ errorHappened: true })
    //   await this.setState({ errorMsg: 'Se ha producido un error (6)' })
    // }
  };
  async showEditTripFields(selectedTrip) {
    try {
      await this.setState({ selectedTrip: selectedTrip["id"] })
      await this.setState({ originTrip: selectedTrip["city1"] })
      await this.setState({ destinationTrip: selectedTrip["city2"] })
      await this.setState({ dateTrip: selectedTrip["date"] })
      await this.setState({ modeTrip: selectedTrip["mode"] })
      await this.setState({ showTripModal: true });  
    } catch (err) {
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'Se ha producido un error (6)' })
    }
  };

  async showModalPeriod(selectedPeriod) {

    try {
      
      
      await this.setState({ selectedPeriod: selectedPeriod})
      await this.setState({ showPeriodModal: true });

     
    } catch (err) {
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'Se ha producido un error (6)' })
    }
  };


  async editPeriodsListInit(init) {
    try {
      await this.setState({ periodsListInit: init })
    } catch (err) {
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'Se ha producido un error (24)' })
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


  async editEmployeeListInit(init) {
    try {
      await this.setState({ listInit: init })
    } catch (err) {
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'Se ha producido un error (9)' })
    }
  }


  async editActivityListInit(init) {
    try {
      await this.setState({ activityListInit: init })
    } catch (err) {
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'Se ha producido un error (10)' })
    }
    // (this.state.activityListInit)
  }


  async editTripsListInit(init) {
    try {
      await this.setState({ tripsListInit: init })
    } catch (err) {
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'Se ha producido un error (11)' })
    }

  }

  async showCreationManager() {
    try {
      // await this.setState({ loading: true })

      this.setState({ wantToCreate: false })

      if (this.state.wantToCreateManager) {
        this.setState({ wantToCreateManager: false })
      } else {
        this.setState({ wantToCreateManager: true })
      }
    } catch (err) {
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'Se ha producido un error al crear el gerente' })
    }
    // await this.setState({ loading: false })
  }

  async showCreationFields() {


    try {

//      this.setState({ wantToCreateManager: false })

      if (this.state.wantToCreate) {
        this.setState({ wantToCreate: false })
      } else {
        await this.setState({ showCreateTripFields: false })
        await this.setState({ wantToCreateManager: false })
        await this.setState( {showHolidays : false} )
        this.setState({ wantToCreate: true })

      }



    } catch (err) {
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'Se ha producido un error (12)' })
    }
    //await this.setState({ loading: false })

  }

  async selectProduct(product) {
    try {
      await this.setState({ product: product })
    } catch (err) {
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'Se ha producido un error (13)' })
    }
  }





  async getParams() {

    try {

      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);

      let start = urlParams.get('start');
      let end = urlParams.get('end');
      let filters = urlParams.get('filters');
      let tk = urlParams.get('tk');
      let empId = urlParams.get('empId');
      if (!tk) {
        tk = null
      }
      if (!start) {
        start = 0
      }
      if (!empId) {
        empId = 0
      }
      if (!end) {
        end = 0
      }
      let noFilters
      if (!filters) {
        filters = {}
        noFilters = true

      }
      let response = {
        "start": start,
        "end": end,
        "filters": filters,
        "tk":tk,
        "empId":empId
      }



      if (start === 0 && end === 0 && noFilters) {
        return "nothing"
      } else {

        return response
      }

    } catch (err) {
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'Se ha producido un error (14)' })
    }


  }


  async sendMessage(id,start, end, text){

    try{
      var token = this.state.userToken
      let requestOptions
      let startDate = this.state.selectedActivityDict["date"]
      let endDate = this.state.selectedActivityDict["date"]
      let startNew = this.state.selectedActivityDict["start"]-100
      let endNew = this.state.selectedActivityDict["start"]+100

      var bodyJS = JSON.stringify({
        "id" : id,
        "medium": "phone",
        "text" : text,
        "dates": [[startNew,startDate],[endNew,endDate]]
  
      })

      
      var response
      if (token !== "" && token !== null && token !== "null") {
        requestOptions = await {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          },
          body: bodyJS,
        };
        
        response = await fetch(this.state.endPoint + "send-message/", requestOptions).then((response) => response.json())

        if (response !== true) {
          alert('Revisa el teléfono')
        }
        else{
          alert('¡Mensaje enviado!')
        }   
      }
    
  
  } catch (err) {
    await this.setState({ errorHappened: true })
    await this.setState({ errorMsg: 'Revisa el teléfono' })
  }
}



  async selectAccessMode(_mode) {

    try {
      if (_mode === "Blockchain") {
        await this.loadWeb3()
        await this.loadBlockchainData()
      }
      if (_mode === "Conventional") {


      }
      await this.setState({ selectedMode: _mode })



    } catch (err) {
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'Se ha producido un error (15)' })
    }

  }




  async errorStatus() {

    this.setState({ loading: true })

    if (this.state.errorHappened === true) {

      await this.setState({ errorHappened: false })


    } else {
      await this.setState({ errorHappened: true })

    }
    this.setState({ loading: false })
  }

  async search(empId, start, end, filters, force, displayTypeParam = "") {
    
    window.scrollTo(0, 0)

    try {
      var myEmployee
      await this.setState({ showTestDetails: false })


      await this.setState({ loading: true })
      await this.setState({ somethingSearched: 0 })
      if (start === 0 && this.state.myEmployee) {

        start = new Date(this.state.myEmployee.startString)
        start = (start.getTime() / 1000)-(86400*30)
      }

      if (end === 0 && this.state.myEmployee) {
        end = new Date(this.state.myEmployee.endString)
        end = end.getTime() / 1000
      }









      var displayType

      if (displayTypeParam===""){
        displayType  = await this.state.displayType
      }else{
        displayType=displayTypeParam
      }


      let employees = this.state.employees

      let employeesSelected = await this.state.employeesSelected

      let employeesSelectedLen = await employeesSelected.length


      if (employees.length > 0 && force === false && employeesSelectedLen === 0 && 1 === 2) {



        for (var e in employees) {

          if (employees[e].id === empId) {
            myEmployee = employees[e]
            break; // If you want to break out of the loop once you've found a match
          }
        }



      } else {


        var token = this.state.userToken
        let requestOptions

        var bodyJS = JSON.stringify({
          "id": empId,
          "start": start,
          "end": end,
          "displayType": displayType,
          "filters": filters,

        })

        
        var response
        if (token !== "" && token !== null && token !== "null") {
          requestOptions = await {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token
            },
            body: bodyJS,
          };
          console.log(requestOptions)
          response = await fetch(this.state.endPoint + "employee/", requestOptions).then((response) => response.json())
        } else {
          requestOptions = await {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              "id": empId,
              "start": start,
              "end": end,
              "displayType": displayType,
              "filters": filters,

            }),
          };

          
          response = await fetch(this.state.endPoint + "employeeTest/", requestOptions).then((response) => response.json())

        }
        if (!response.ok && response.type === 'cors') {
          window.location.reload()
        }
        if (response === "Employee not found") {
          window.location.reload()

        } else {
          myEmployee = await response;

        }
      }

      await this.setState({ myEmployee: myEmployee })

      this.setState({ start: start })
      this.setState({ end: end })
      this.setState({ filters: filters })


      //}
      //await this.showCreationFields()
      await this.setState({ displayType: displayType })

      await setTimeout(() => this.setState({ somethingSearched: 2 ,showTestDetails: true }), 50)
      
      


      
      
      

      await this.setState({ loading: false })

      return myEmployee
    } catch (err) {
      setTimeout(() => window.location.reload(), 2000)
    }

  }

  async seslectDisplayMode(displayType) {

    try {
      let prevdisplayType = this.state.displayType

      //console.log(displayType)

      await this.setState({ showTestDetails: false })


      await this.setState({ showCreateTripFields: false })

      await this.setState({ showHolidays : false})

      let userRole = await this.state.userRole
      await this.setState({ displayType: displayType })

      await this.setState({ userRole: "provisional " })



      await this.setState({ userRole: userRole })



      


      await this.setState({ showTestDetails: true })



      if (this.state.myEmployee){
        let employeeId = await this.state.myEmployee.id
        let start = await this.state.myEmployee.startString / 1000
        let end = await this.state.myEmployee.endString / 1000
        let filtersDiets = {'graphs' : 'graphs'}
        let filters = {label: 'Semanas', value: 'weekReports'}
  
  
        if(prevdisplayType !== "text" && prevdisplayType !== "list" && prevdisplayType !== "trips"){
          if(displayType === "text" || displayType === "list" || displayType === "trips"){
            //if (Object.keys(diets).length === 0){
              await this.search(employeeId, start, end, filtersDiets, true)
            //}
            
          }
        }
  
        if(prevdisplayType !== "periods" && prevdisplayType !== "dayConsult"){
          if (displayType === "periods" || displayType === "dayConsult") {
            //if (Object.keys(diets).length === 0) === { }){
            await this.search(employeeId, start, end, filters, true)
            //}
          }
        }
      }

     
      

     } catch (err) {
      await this.setState({ errorHappened: true })
       await this.setState({ errorMsg: 'Se ha producido un error (16)' })
     }
  }


  
  async showCreateTripFields() {
    try {

      window.scrollTo(0, 0)

      let showCreateTripFields = this.state.showCreateTripFields

      if (showCreateTripFields === true) {
        await this.setState({ showCreateTripFields: false })

      } else {
        
        await this.setState({ wantToCreate: false })
        await this.setState({ wantToCreateManager: false })
        await this.setState({showHolidays : false})
        await this.setState({ showCreateTripFields: true })
      }
    } catch (err) {
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'Se ha producido un error (18)' })
    }
  }

  async showHolidays(){
    try{
      window.scrollTo(0,0)

      let showHolidays = this.state.showHolidays

      if(showHolidays === true){
        await this.setState({showHolidays : false})
      }
      else{
        await this.setState({ showCreateTripFields: false })
        await this.setState({wantToCreate : false})
        await this.setState({ wantToCreateManager: false })
        await this.setState( {showHolidays : true} )
        
      }
    }
    catch(err){
      await this.setState({ errorHappened : true})
      await this.setState({ errorMsg: 'Se ha producido un error (18)'})
    }
  }

  async selectANDirecto() {

    try {

      let showANDirecto = this.state.showANDirecto

      if (showANDirecto) {
        await this.setState({ showANDirecto: false })
      } else {
        await this.setState({ showANDirecto: true })
      }
    } catch (err) {
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'Se ha producido un error (199)' })
    }
  }


  async showError() {
    try {
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'Se ha producido un error no especificado' })

    } catch (err) {
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'Se ha producido un problema al mostrar un mensaje de error general' })

    }
  }

  async createManager(mail, password, username){
    try {
      await this.setState({ loading: true })
      await this.setState({ somethingSearched: 0 })

      var token = this.state.userToken

      let body = JSON.stringify({
        "email": mail,
        "is_active": true,
        "client_reference": username,
        "hashed_password": password,
      })

      let requestOptions = await {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: body,
      };

      var response = await fetch(this.state.endPoint + "create_manager", requestOptions)

      if (!response.ok && response.type === 'cors') {
        this.setState({ loading: false })
        await this.setState({ errorHappened: true })
        await this.setState({ errorMsg: 'No hemos podido crear este manager' })
      } else {
        this.usersManagerCount(0, 0, "text", {})
        this.setState({ loading: false })
      }

      window.scrollTo(0, 0)
    } catch (err) {
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'Se ha producido creando el gerente' })
    }
  }

  async employees_manager(mail) {
    try {
      await this.setState({ showCreateTripFields: false })
      await this.setState({showHolidays : false})
      this.setState({ loading: true })
      this.setState({ wantToCreate: true })
      this.setState({ wantToCreateManager: false })
      this.setState({ showListManager: false })
      this.setState({ myEmployee: undefined })
      this.setState({ somethingSearched: 0 })
      this.setState({ showANDirecto: false })


      let token = await this.state.userToken

      let requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({
          "id": 0,
          "start": 0,
          "end": 0,
          "displayType": mail,
          "filters": {},

        }),
      }

      let response = await fetch(this.state.endPoint + "employees_manager/", requestOptions).then((response) => response.json())

      if (!response.ok && response.type === 'cors') {
        await this.setState({ errorHappened: true })
        await this.setState({ errorMsg: 'No hemos encontrado los empleados de este gerente' })
      } 
     
      let employees = JSON.parse(JSON.stringify(response))


      await this.setState({
        employeesList: employees,
        employees: employees,
      })


      this.setState({ dontCall: true })
      this.setState({ wantToCreate: false })
      this.setState({ wantToCreateManager: false })
      this.setState({ somethingSearched: 1 })
      this.setState({ loading: false })
      
      this.setState({ showList: true })
      return employees

    } catch (err) {
      this.setState({ wantToCreate: false })
      this.setState({ wantToCreateManager: false })
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'No hemos encontrado los empleados de este gerente' })
      this.setState({ loading: false })
    }
  }

  async createEmployee(employeeName, employeeApellidos, identificador, cardNumber, baseSalary, weekly_hours, nat_feed_diet, nat_sleep_diet, int_feed_diet, int_sleep_diet, country, region, phone, mail, nat_complete_diet, nat_desayuno_diet, nat_tarde_diet, nat_tarde_cama_diet, nat_cena_diet, nat_km_diet, int_complete_diet, int_desayuno_diet, int_tarde_diet, int_tarde_cama_diet, int_cena_diet, int_km_diet, festive_comp, weekend_comp) {

    window.scrollTo(0, 0)
    try {
      await this.setState({ loading: true })
      await this.setState({ somethingSearched: 0 })

      var token = this.state.userToken
      // convert base salary into integer
      var employeeName1 = await employeeName
      var employeeApellidos1 = await employeeApellidos
      var identificador1 = await identificador
      var cardNumber1 = await cardNumber
      var baseSalaryInt1 = await parseInt(baseSalary * 1000)
      var weekly_hours1 = await parseInt(weekly_hours * 1000)
      var nat_feed_diet1 = await parseInt(nat_feed_diet * 1000)
      var nat_sleep_diet1 = await parseInt(nat_sleep_diet * 1000)
      var int_feed_diet1 = await parseInt(int_feed_diet * 1000)
      var int_sleep_diet1 = await parseInt(int_sleep_diet * 1000)
      var country1 = await country
      var region1 = await region
      var phone1 = await phone
      var mail1 = await mail
      var nat_complete_diet = await parseInt(nat_complete_diet * 1000)
      var nat_desayuno_diet = await parseInt(nat_desayuno_diet * 1000)
      var nat_tarde_diet = await parseInt(nat_tarde_diet * 1000)
      var nat_tarde_cama_diet = await parseInt(nat_tarde_cama_diet * 1000)
      var nat_cena_diet = await parseInt(nat_cena_diet * 1000)
      var nat_km_diet = await parseInt(nat_km_diet * 1000)
      var int_complete_diet = await parseInt(int_complete_diet * 1000)
      var int_desayuno_diet = await parseInt(int_desayuno_diet * 1000)
      var int_tarde_diet = await parseInt(int_tarde_diet * 1000)
      var int_tarde_cama_diet = await parseInt(int_tarde_cama_diet * 1000)
      var int_cena_diet = await parseInt(int_cena_diet * 1000)
      var int_km_diet = await parseInt(int_km_diet * 1000)
      var festive_comp = await parseInt(festive_comp * 1000)
      var weekend_comp = await parseInt(weekend_comp * 1000)




      let empId
      let start
      let end
      let filters

      if (this.state.myEmployee) {
        empId = this.state.myEmployee.id
        start = this.state.start
        end = this.state.end
        filters = this.state.filters
      } else {
        empId = "",
          start = 0,
          end = 0,
          filters = {}

      }



      let searchRequest = {
        "id": empId,
        "start": start,
        "end": end,
        "filters": filters,

      }
      let body = JSON.stringify({
        "employeeName": employeeName1,
        "employeeApellidos": employeeApellidos1,
        "identificador": identificador1,
        "cardNumber": cardNumber1,
        "baseSalary": baseSalaryInt1,
        "weekly_hours": weekly_hours1,
        "nat_feed_diet": nat_feed_diet1,
        "nat_sleep_diet": nat_sleep_diet1,
        "int_feed_diet": int_feed_diet1,
        "int_sleep_diet": int_sleep_diet1,
        "country": country1,
        "region": region1,
        "phone": phone1,
        "mail": mail1,
        "searchRequest": searchRequest,
        "nat_complete_diet": nat_complete_diet,
        "nat_desayuno_diet": nat_desayuno_diet,
        "nat_tarde_diet": nat_tarde_diet,
        "nat_tarde_cama_diet": nat_tarde_cama_diet,
        "nat_cena_diet": nat_cena_diet,
        "nat_km_diet": nat_km_diet,
        "int_complete_diet": int_complete_diet,
        "int_desayuno_diet": int_desayuno_diet,
        "int_tarde_diet": int_tarde_diet,
        "int_tarde_cama_diet": int_tarde_cama_diet,
        "int_cena_diet": int_cena_diet,
        "int_km_diet": int_km_diet,
        "festive_comp": festive_comp,
        "weekend_comp": weekend_comp

      })



      let requestOptions = await {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: body,
      };


      var response = await fetch(this.state.endPoint + "create_employee", requestOptions)

      if (!response.ok && response.type === 'cors') {
        this.setState({ loading: false })
        await this.setState({ errorHappened: true })
        await this.setState({ errorMsg: 'No hemos podido crear este usario, revisa el correo' })

      } else {
        this.usersEmployeeCount(0, 0, "text", {})

        this.setState({ loading: false })
      }

      window.scrollTo(0, 0)
    } catch (err) {
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'Se ha producido un error (19)' })
    }
  }

  async usersManagerCount(start, end, displayType, filters) {
    try {
      await this.setState({ showCreateTripFields: false })
      await this.setState({showHolidays : false})
      this.setState({ loading: true })
      this.setState({ wantToCreate: false })
      this.setState({ wantToCreateManager: false })
      this.setState({ myEmployee: undefined })
      this.setState({ somethingSearched: 0 })
      this.setState({ showANDirecto: false })

      let token = await this.state.userToken

      let requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        }
      }

      let response = await fetch(this.state.endPoint + "managers/", requestOptions).then((response) => response.json())

      if (!response.ok && response.type === 'cors') {
        await this.setState({ errorHappened: true })
        await this.setState({ errorMsg: 'No hemos encontrado tus gerentes' })
      }

      let managers = JSON.parse(JSON.stringify(response))
      
      await this.setState({
        managersList: managers
      })


      this.setState({ dontCall: true })
      this.setState({ wantToCreate: false })
      this.setState({ wantToCreateManager: false })
      this.setState({ loading: false })
      this.setState({showList: false})
      this.setState({showListManager: true})
    } catch (err) {
      this.setState({ wantToCreate: false })
      this.setState({ wantToCreateManager: false })
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'No hemos podido localizar tus gerentes' })
      this.setState({ loading: false })
    }
  }

  async usersEmployeeCount(start, end, displayType, filters) {

    try {
      await this.setState({ showCreateTripFields: false })
      await this.setState({showHolidays : false})
      this.setState({ loading: true })
      this.setState({ wantToCreate: true })
      this.setState({ wantToCreateManager: false })
      this.setState({ showListManager: false })
      this.setState({ myEmployee: undefined })
      this.setState({ somethingSearched: 0 })
      this.setState({ showANDirecto: false })


      let token = await this.state.userToken

      let requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({
          "id": 0,
          "start": start,
          "end": end,
          "displayType": displayType,
          "filters": filters,

        }),
      }

      let response = await fetch(this.state.endPoint + "employees/", requestOptions).then((response) => response.json())

      if (!response.ok && response.type === 'cors') {
        await this.setState({ errorHappened: true })
        await this.setState({ errorMsg: 'No hemos encontrado tus empleados' })

      }
      

      //console.log(response)



      //let lastActivities = response["generalView"]["lastActivities"]
      //let lastPlaces  = response["generalView"]["lastPlaces"]
      let show = false
      //for (let i=0; i < lastActivities.length; i++){
      //  if (lastActivities[i] != lastPlaces){
      //    show = true
      //  }
      //}


      //if(this.state.showLastModal===''){
      // await this.setState({showLastModal:show})
      //}




      //let resposeArray = JSON.parse(JSON.stringify(response))
      //let employeesList = response["employeesList"]
      //let employees = response["employees"]

      let employees
      let generalView
      

       employees = JSON.parse(JSON.stringify(response['employees']))
        generalView = JSON.parse(JSON.stringify(response["generalView"]))

      //console.log(employees)
     

      await this.setState({
        employeesList: employees,
        employees: employees,
        generalView: generalView,
      })


      this.setState({ dontCall: true })
      this.setState({ wantToCreate: false })
      this.setState({ wantToCreateManager: false })
      this.setState({ somethingSearched: 1 })
      this.setState({ loading: false })
      this.setState({ displayType: displayType })
      
      this.setState({ showList: true })
      return employees

      
      //return resposeArray["employeesList"]

    } catch (err) {
      this.setState({ wantToCreate: false })
      this.setState({ wantToCreateManager: false })
      await this.setState({ errorHappened: true })
      await this.setState({ errorMsg: 'No hemos podido localizar tus empleados' })
      this.setState({ loading: false })

    }
  }


  async usersEmployeeLoad() {

    try {

      this.setState({ loading: true })
      this.setState({ wantToCreate: true })
      this.setState({ wantToCreateManager: false })






      let token = await this.state.userToken

      let requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        }
      }




      let response = await fetch(this.state.endPoint + "employees-load/", requestOptions)

      if (!response.ok && response.type === 'cors') {
        window.location.reload()

      }







      let resposeArray = await JSON.parse(JSON.stringify(response))



      setTimeout(() => window.location.reload(), 100);
    } catch (err) {
      setTimeout(() => window.location.reload(), 2000)
    }
  }

  render() {


    try {

      var tripContent
      let content = <div></div>
      let table


      let winHeight = window.innerHeight*1.5

        
      if(winHeight>1500){
        winHeight = winHeight
      }else{
          winHeight = 1500
        }
        var sectionStyle

      if (this.state.device === 'desktop') {

        
        if(window.innerWidth > 1200){
          sectionStyle = {
            width: "100%",
            height: "100%"
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


      var loader

      if (this.state.loading === true) {
        setTimeout(
          loader = <div nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ textAlign: 'center' }}>
            <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>

            <CustomSpinner />
            <p id="loader" 
               className="text-center" 
               nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" 
               style={{ fontSize: 24, color: "#18a100", animation:"infinite", willChange: "transform" }}>
                Procesando...
            </p>
          </div>, 200);
      } else {
        loader = <div></div>
      }
      if (this.state.errorHappened) {

        var error = <ErrorHappened
          errorStatus={this.errorStatus}
          errorMsg={this.state.errorMsg}

        />

      } else {
        var error = <div></div>


      }


      if ((this.state.userToken == "null" || this.state.userToken == null)) {
        if (this.state.device === 'desktop') {

          let testSection = <div></div>

          if (this.state.showTestDetails) {
            testSection = <div id="content" className="mt-3">
              <div className="card mb-4" >
                <div className="card-body" nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ "width": "100%" }}>

                  <JustToTest

                    myEmployee={this.state.myEmployee}
                    strStatus={this.state.strStatus}
                    showModalActivity={this.showModalActivity}
                    showSendSmsActivity={this.showSendSmsActivity}
                    thisDeposited={this.state.thisDeposited}
                    currentUser={this.state.currentUser}
                    search={this.search}
                    seslectDisplayMode={this.seslectDisplayMode}
                    displayType={this.state.displayType}
                    activityListInit={this.state.activityListInit}
                    editActivityListInit={this.editActivityListInit}
                    showCreationFields={this.showCreationFields}
                    userRole={this.state.userRole}
                    editTripsListInit={this.editTripsListInit}
                    tripsListInit={this.state.tripsListInit}
                    device={this.state.device}
                    showCreateTripFields={this.showCreateTripFields}
                    showHolidays={this.showHolidays}
                    showError={this.showError}
                    editPeriodsListInit={this.editPeriodsListInit}
                    periodsListInit={this.state.periodsListInit}

                  />
                </div>
              </div>
            </div>
          }

          content = <table nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '100%' }}>
            <table nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '100%', backgroundColor: "#9ED1D8" }}>
              <br></br><br></br><br></br><br></br>
              <tbody nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '100%' }}>
                <tr nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '100%' }}>

                  <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '17%' }}>
                  </td>
                  <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '66%' }}>
                    <div id="content" className="mt-3">
                      <div className="card mb-4" >
                        <div className="card-body" nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ "width": "100%" }}>


                        <UploadTGDFile
                          activeProcessId={this.state.activeProcessId}
                          showCheckState={this.showCheckState}
                          processNumber={this.processNumber}
                          endPoint={this.state.endPoint}
                          myEmployee={this.state.myEmployee}
                          putLoading={this.putLoading}
                          usersEmployeeCount={this.usersEmployeeCount}
                          userToken={this.state.userToken}
                          setEmployee={this.setEmployee}
                        />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '17%' }}>
                  </td>
                </tr>

                <tr nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '100%' }}>

                  <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '17%' }}>
                  </td>
                  <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '66%' }}>
                    {testSection}
                  </td>
                  <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '17%' }}>
                  </td>
                </tr>
              </tbody>
            </table>
            <table nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{
              width: "100%",
              height: "100%",
              backgroundImage: "url(" + this.state.camionesFinal + ")",
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              backgroundPosition: "top",

            }}>
              <br></br><br></br><br></br><br></br>
              <tbody nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '100%' }}>
                <tr nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '100%' }}>
                  <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '5%' }}>

                  </td>
                  <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '90%', textAlign: "center", fontWeight: "light" }}>
                    <h1 nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ color: "#5A5A5A", fontWeight: "light" }}>Bienvenido a Drive-Team.es</h1>
                    <br></br>
                    <h4 nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ color: "#5A5A5A", fontWeight: "light" }}>Saca provecho a los datos de tus tacógrafos. Traxain te ayuda usando los datos legalmente válidos del tacógrafo para calcular y controlar tus gastos en personal</h4>
                    <h2 nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ color: "#457AF3" }}>+ </h2>
                    <h4 nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ color: "#5A5A5A", fontWeight: "light" }}>Consulta el Dashboard de productividad de cada conductor</h4>
                    <h2 nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ color: "#457AF3" }}>+ </h2>
                    <h4 nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ color: "#5A5A5A", fontWeight: "light" }}>Calcula las dietas de alimentación y pernocta</h4>
                    <h2 nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ color: "#457AF3" }}>+ </h2>
                    <h4 nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ color: "#5A5A5A", fontWeight: "light" }}>Pronostica y calcula complementos de desplazamiento y nocturnidad</h4>
                    <h2 nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ color: "#457AF3" }}>+ </h2>
                    <h4 nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ color: "#5A5A5A", fontWeight: "light" }}>Detecta y aclara el comportamiento inusual del conductor</h4>
                    <h2 nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ color: "#5A5A5A" }}></h2>
                    <br></br><br></br>
                    <h4 nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ color: "#5A5A5A", fontWeight: "light" }}>Regístrate sin compromiso abajo para empezar a probarlo.</h4>
                    <br></br>
                    <h4 nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ color: "#5A5A5A", fontWeight: "light" }}>¿No sabes por dónde empezar? Consulta <a href="https://youtu.be/y5eT_VS2xco">nuestros videotutoriales.</a> Puedes ver más información en <a href="https://traxain.com/post/drive-team">Traxain.com</a>, contactarnos en <a href="mailto:ignacio@traxain.com"> ignacio@traxain.com </a>, o llamarnos al  <a href="tel:+34638269633">+34 638 26 96 33 </a> </h4>

                  </td>
                  <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '5%' }}>

                  </td>
                </tr>
              </tbody>
            </table>
            <br></br><br></br>



            <table nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '100%' }}>
              <tbody nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '100%' }}>
                <tr nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '100%' }}>

                  <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '15%' }}>
                  </td>
                  <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '35%' }}>
                    <Register
                      Token={this.selectAccessMode}
                      endPoint={this.state.endPoint}
                    />
                  </td>
                  <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '35%' }}>
                    <Login
                      Token={this.selectAccessMode}
                      endPoint={this.state.endPoint}
                    />
                  </td>
                  <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '15%' }}>
                  </td>
                </tr>
              </tbody>
              <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>


            </table>

          </table>
          table = <div></div>
        } else {

          content = <table nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '100%' }}>
            <table nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{
              width: "100%",
              height: "800px",
            }}>
              <tbody nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '100%' }}>
                <tr nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '100%' }}>
                  <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '5%' }}>

                  </td>
                  <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '80%', textAlign: "center", fontWeight: "light" }}>
                    <br></br>
                    <br></br>
                    <h2 nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ color: "#5A5A5A", fontWeight: "light" }}>Bienvenido a Drive-Team.es</h2>
                    <br></br>
                    <h4 nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ color: "#5A5A5A", fontWeight: "light" }}>Saca provecho a los datos de tus tacógrafos. Traxain te ayuda usando los datos legalmente válidos del tacógrafo para calcular y controlar tus gastos en personal</h4>
                    <h2 nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ color: "#457AF3" }}>+ </h2>
                    <h4 nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ color: "#5A5A5A", fontWeight: "light" }}>Consulta el Dashboard de productividad de cada conductor</h4>
                    <h2 nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ color: "#457AF3" }}>+ </h2>
                    <h4 nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ color: "#5A5A5A", fontWeight: "light" }}>Calcula las dietas de alimentación y pernocta</h4>
                    <h2 nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ color: "#457AF3" }}>+ </h2>
                    <h4 nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ color: "#5A5A5A", fontWeight: "light" }}>Pronostica y calcula complementos de desplazamiento</h4>
                    <h2 nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ color: "#457AF3" }}>+ </h2>
                    <h4 nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ color: "#5A5A5A", fontWeight: "light" }}>Detecta y aclara el comportamiento inusual del conductor</h4>
                    <h2 nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ color: "#5A5A5A" }}></h2>
                    <br></br><br></br>
                    <h4 nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ color: "#5A5A5A", fontWeight: "light" }}>Regístrate sin compromiso abajo para empezar a probarlo.</h4>
                    <br></br>
                    <h4 nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ color: "#5A5A5A", fontWeight: "light" }}>¿No sabes por dónde empezar? Consulta <a href="https://youtu.be/y5eT_VS2xco">nuestros videotutoriales.</a> <br></br><br></br>Puedes ver más información en <a href="https://traxain.com/post/drive-team">Traxain.com</a>, contactarnos en <a href="mailto:ignacio@traxain.com"> ignacio@traxain.com </a>, o llamarnos al  <a href="tel:+34638269633">+34 638 26 96 33 </a></h4>

                  </td>
                  <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '5%' }}>

                  </td>
                </tr>
              </tbody>
            </table>
            <table nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '100%' }}>
              <tbody nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '100%' }}>
                <br></br><br></br>
                <tr nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '100%' }}>
                  <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '10%' }}>
                  </td>
                  <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '80%' }}>
                    <Register
                      Token={this.selectAccessMode}
                      endPoint={this.state.endPoint}
                    />
                  </td>
                  <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '10%' }}>
                  </td>
                </tr>
                <tr>
                  <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '10%' }}>
                  </td>
                  <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '80%' }}>
                    <Login
                      Token={this.selectAccessMode}
                      endPoint={this.state.endPoint}
                    />
                  </td>
                  <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '10%' }}>
                  </td>
                </tr>
              </tbody>
            </table>
            <br></br><br></br><br></br><br></br><br></br>
          </table>

          table = <div></div>
    
          }
            
    
        } else {
                //window.scrollTo(0, 0)
          
                // a partir de aqui hay credenciales
                // meto una tabla vacia
                // defino Acciones
               
            
                table = <div></div>
                let actions
                let showUpload
                let endpoint = this.state.endPoint

                if(this.state.showCheckStateModal){
                  showUpload = <div>
                                <CheckState 
                                show={this.state.showCheckStateModal}
                                onClose={this.onClose}
                                chargeStatusTGD={this.state.chargeStatusTGD}
                                >
                                </CheckState>
                  </div>
                }
                              if (this.state.upLoadTGDManually===false || this.state.myEmployee === undefined){
                         
                                


                                actions = <div>
                                  
                                  
                                  <Actions
                                userRole={this.state.userRole}
                                showCreationFields={this.showCreationFields}
                                showCreationManager={this.showCreationManager}
                                usersEmployeeCount={this.usersEmployeeCount}
                                usersManagerCount={this.usersManagerCount}
                                usersEmployeeLoad={this.usersEmployeeLoad}
                                searchManual = {this.searchManual}
                                actualizarEstadoYAlmacenar={this.actualizarEstadoYAlmacenar}
                                
                                />
                                <UploadTGDFile
                                  activeProcessId={this.state.activeProcessId}
                                  showCheckState={this.showCheckState}
                                  processNumber={this.processNumber}
                                  endPoint={this.state.endPoint}
                                  myEmployee={this.state.myEmployee}
                                  putLoading={this.putLoading}
                                  usersEmployeeCount={this.usersEmployeeCount}
                                  userToken={this.state.userToken}
                                  setEmployee={this.setEmployee}
                                />

                                  
                                {/*<UploadXLSFile 
                                
                                token = {this.state.userToken}
                                putLoading={this.putLoading}
                                endPoint={this.state.endPoint}
                                
                                />*/}
          
          
                            <table nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{width:"100%"}}>
                              <tbody nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{width:"100%"}}>
                                <tr nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{width:"100%", display:"flex", justifyContent:"center", alignContent:"center"}}>
                                  <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{width:"47%"}}>
                                  <form  onSubmit={(event) => {
                                    event.preventDefault()
                                    this.dowloadActivityReport()
                                    
          
                                  }}>
                                  
          
                                    
                                  
                                  <button type="submit" nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{width:"100%",fontSize:16,}} className="btn btn-primary btn-block btn-lg">Reporte detallado</button>
          
                                  </form>
          
                                  </td>
                                  <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{width:"2%"}}></td>
                                  <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{width:"47%"}}>
                                  <form  onSubmit={(event) => {
                            event.preventDefault()
                            this.dowloadPeriodsReport()
                            this.props.actualizarEstadoYAlmacenar()


                          }}>




                            <button type="submit" nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "100%", fontSize: 16 }} className="btn btn-primary btn-block btn-lg">Reporte por día</button>

                          </form>


                        </td>

                      </tr>

                    </tbody>

                  </table>

                </div>
                                } else {
                                  actions = <div>

                                    <form onSubmit={(event) => {
                                      event.preventDefault()
                                      this.actualizarEstadoYAlmacenar()
                                      this.usersEmployeeCount(0, 0, "text", {})
                                      this.props.actualizarEstadoYAlmacenar()


                                    }}>

                                      <button type="submit" 
                                      nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" 
                                      style={{ width: "100%", fontSize: 16 }} 
                                      className="btn btn-primary btn-block btn-lg">
                                        Volver a empleados
                                      </button>

                                    </form>

                                    <br></br><br></br>
                                    <UploadTGDFile
                                      activeProcessId={this.state.activeProcessId}
                                      showCheckState={this.showCheckState}
                                      processNumber={this.processNumber}
                                      endPoint={this.state.endPoint}
                                      myEmployee={this.state.myEmployee}
                                      putLoading={this.putLoading}
                                      usersEmployeeCount={this.usersEmployeeCount}
                                      userToken={this.state.userToken}
                                      setEmployee={this.setEmployee}
                                    />
                                  </div>

                                }




              let listContent




              // aqui defino las cosas que puede ver si es admin        
              if (this.state.userRole == "admin" || this.state.userRole == "manager") {
                if (this.state.wantToCreate === true) {
                  listContent = 
                  <div>
                    <form onSubmit={(event) => {
                      event.preventDefault()
                      this.activateSimulator()
                      this.props.actualizarEstadoYAlmacenar()
                    }}>



                    
                    <br></br>
                      <button type="submit" nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "100%", fontSize: 16, height:"100%" }} className="btn btn-primary btn-block btn-lg">Activar simulador</button>
                      

                    </form>
                    <br></br>
                    <Creation
                      createEmployee={this.createEmployee}
                      myEmployee={this.state.myEmployee}
                      showError={this.showError}
                      showSimulator={this.state.showSimulator}

                    />
                  </div>
                } else if(this.state.wantToCreateManager){
                  listContent = 
                    <div>
                      <br></br>
                      <CreationManager
                        createManager={this.createManager}
                        employees_manager={this.employees_manager}
                        myEmployee={this.state.myEmployee}
                        showError={this.showError}
                      />
                    </div>
                } else if (this.state.showCreateTripFields) {
                  listContent =
                    <div>
                      <TripCreation
                        myEmployee={this.state.myEmployee}
                        device={this.state.device}
                        createTrip={this.createTrip}
                        showError={this.showError}
                      />
                    </div>
                }
                else if(this.state.showHolidays){
                  listContent =
                    <div>
                      <HolidayEmployee
                        device={this.state.device}
                        showError={this.showError}
                        endPoint = {this.state.endPoint}
                        userToken = {this.state.userToken}
                        myEmployee = {this.state.myEmployee}

                      />
                    </div>
                } else if (this.state.showList) {
                  listContent =
                    <List
                      myTrip={this.state.myTrip}
                      thisTripID={this.state.thisTripID}
                      somethingSearched={this.state.somethingSearched}
                      wantToCreate={this.state.wantToCreate}
                      listInit={this.state.listInit}
                      device={this.state.device}
                      search={this.search}
                      editEmployeeListInit={this.editEmployeeListInit}
                      showCreationFields={this.showCreationFields}
                      showError={this.showError}
                      filters={this.state.filters}
                      myEmployee={this.state.myEmployee}
                      employeesList={this.state.employeesList}
                      actualizarEstadoYAlmacenar={this.actualizarEstadoYAlmacenar}



                    />



                } else if (this.state.showListManager) {
                  listContent =
                    <ListManager
                      listInit={this.state.listInit}
                      device={this.state.device}
                      search={this.search}
                      employees_manager={this.employees_manager}
                      editEmployeeListInit={this.editEmployeeListInit}
                      showCreationFields={this.showCreationFields}
                      managersList={this.state.managersList}
                    />
                } else {
                  listContent = <Spinner />
                }

                if (this.state.somethingSearched === 2 && this.state.myEmployee) {


                  tripContent =

                    <div id="content" className="mt-3">
                      <div className="card mb-4" >




                        <div className="card-body" nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ "width": "100%" }}>


                          <EmployeeDetails
                            deleteTrip={this.deleteTrip}
                            filterAlerts={this.state.filterAlerts}
                            putFilterAlerts={this.putFilterAlerts}
                            sendMessage={this.sendMessage}
                            showModalPeriod={this.showModalPeriod}
                            showEditTripFields={this.showEditTripFields}      
                            myEmployee={this.state.myEmployee}
                            strStatus={this.state.strStatus}
                            showModalActivity={this.showModalActivity}
                            showSendSmsActivity={this.showSendSmsActivity}
                            thisDeposited={this.state.thisDeposited}
                            currentUser={this.state.currentUser}
                            dowloadActivityReport={this.dowloadActivityReport}
                            search={this.search}
                            seslectDisplayMode={this.seslectDisplayMode}
                            displayType={this.state.displayType}
                            activityListInit={this.state.activityListInit}
                            editActivityListInit={this.editActivityListInit}
                            showCreationFields={this.showCreationFields}
                            userRole={this.state.userRole}
                            editTripsListInit={this.editTripsListInit}
                            tripsListInit={this.state.tripsListInit}
                            device={this.state.device}
                            showCreateTripFields={this.showCreateTripFields}
                            showHolidays = {this.showHolidays}
                            showError={this.showError}
                            editPeriodsListInit={this.editPeriodsListInit}
                            periodsListInit={this.state.periodsListInit}
                            dowloadEmployeeReport={this.dowloadEmployeeReport}
                            actualizarEstadoYAlmacenar={this.actualizarEstadoYAlmacenar}
                            volverAlPasado={this.volverAlPasado}
                            regresoAlFuturo={this.regresoAlFuturo}
                            somethingSearched={this.props.somethingSearched}
                            ref={this.childRefEmployee}
                            ref2={this.childRefHandle}
                            anaObregon={this.anaObregon}
                          />



                        </div>
                      </div>
                    </div>



                } else if (this.state.somethingSearched === 1 && this.state.generalView.length>0) {

                  tripContent = <div id="content" className="mt-3">
                    <div className="card mb-4" >

                      <div className="card-body" nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ "width": "100%" }}>



                        <GeneralView
                          generalView={this.state.generalView}
                          showModalActivity={this.showModalActivity}
                          showSendSmsActivity={this.showSendSmsActivity}
                          putFilterAlerts={this.putFilterAlerts}
                          sendMessage={this.sendMessage}
                          editActivityListInit={this.editActivityListInit}
                          employeesList={this.state.employeesList}
                          strStatus={this.state.strStatus}
                          usersEmployeeCount={this.usersEmployeeCount}
                          seslectDisplayMode={this.seslectDisplayMode}
                          displayType={this.state.displayType}
                          editEmployeesSelected={this.editEmployeesSelected}
                          employeesSelectedToShow={this.state.employeesSelectedToShow}
                          employeesSelected={this.state.employeesSelected}
                          showError={this.showError}
                          device={this.state.device}
                          search={this.search}
                          showCreationFields={this.showCreationFields}
                          myEmployee = {this.state.myEmployee}
                          start = {this.state.start}
                          end= {this.state.end}
                          actualizarEstadoYAlmacenar={this.actualizarEstadoYAlmacenar}
                          volverAlPasado={this.volverAlPasado}
                          regresoAlFuturo={this.regresoAlFuturo}
                          somethingSearched={this.props.somethingSearched}
                          ref={this.childRefGeneral}

                        />


                      </div>
                    </div>
                  </div>

                } else {

                  tripContent = <div></div>

                }
              }

              if (this.state.userRole == "employee" && this.state.showCreateTripFields) {
                listContent =
                  <div>
                    <TripCreation
                      myEmployee={this.state.myEmployee}
                      device={this.state.device}
                      createTrip={this.createTrip}
                      showError={this.showError}
                    />
                  </div>
              }
              else if(this.state.userRole == "employee" && this.state.showHolidays){
                listContent =
                <div>
                      <HolidayEmployee
                        device={this.state.device}
                        showError={this.showError}
                        endPoint = {this.state.endPoint}
                        userToken = {this.state.userToken}
                        myEmployee = {this.state.myEmployee}
                      />

                </div>          
              }



              // aqui difino el contenido de table
              // esto es si  no hay userToken
              


              if (this.state.selectedMode === '' && this.state.userToken === "null") {
                
                table = <div></div>
              } else if (this.state.showANDirecto) {
                // esto es si quiero ver ANDirecto
                table = <div nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ "width": "100%", "textAlign": "center" }} >
                  <br></br><br></br>
                  <table nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ "width": "100%", "textAlign": "center" }}>
                    <tr nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ "width": "100%", "textAlign": "center" }}>
                      <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ "width": "15%", "textAlign": "center" }}>

                      </td>
                      <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ "width": "70%", "textAlign": "center" }}>

                      </td>
                      <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ "width": "15%", "textAlign": "center" }}>

                      </td>
                    </tr>
                  </table>
                  <ANDirecto
                    endPoint={this.state.endPoint}
                    device={this.state.device}
                    showError={this.showError}
                    token={this.state.userToken}
                  />
                </div>
              } else if (this.state.device === 'desktop' && (this.state.userRole === 'admin' || this.state.userRole === 'manager')) {

                // esto si es admin y desktop

                table = <div>

                  <table nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "100%" }}>


                    <thead>
                      <tr>
                        <td>

                        </td>
                        <td>

                        </td>
                        <br></br><br></br><br></br>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>

                        <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ verticalAlign: "top", width: "33%" }}>
                          <div class="col" nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ verticalAlign: "top", width: "100%" }}>
                            <div id="content" className="mt-3" nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ verticalAlign: "top", width: "100%" }}>
                              <div className="card mb-4" nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ verticalAlign: "top", width: "100%" }}>
                                <div className="card-body" nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ "width": "100%" }}>
                                  {actions}
                                  {listContent}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ verticalAlign: "top", width: "66%" }}>
                          <div class="col">
                            {tripContent}
                            {showUpload}
                          </div>
                        </td>

                      </tr>
                    </tbody>
                  </table>
                </div>
              } else if (this.state.userRole === 'employee' && this.state.somethingSearched === 2 && this.state.myEmployee) {
                // aqui puede que haya que adpatarlo al movil



                table = <div nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "100%" }}>
                  <br></br><br></br><br></br>

                  <table nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "100%" }}>


                    <tbody nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "100%" }}>
                      <tr>

                        <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ verticalAlign: "top", width: "5%" }}>

                        </td>

                        <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ verticalAlign: "top", width: "90%" }}>

                          <div id="content" className="mt-3" nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ verticalAlign: "top", width: "100%" }}>

                            <div id="content" className="mt-3">
                              {listContent}

                            </div>
                          </div>
                        </td>
                        <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ verticalAlign: "top", width: "5%" }}>

                        </td>

                      </tr>
                      <tr nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "100%" }}>

                        <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ verticalAlign: "top", width: "5%" }}>

                        </td>

                        <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ verticalAlign: "top", width: "90%" }}>

                          <div class="col" nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ verticalAlign: "top", width: "100%" }}>
                            <div id="content" className="mt-3" nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ verticalAlign: "top", width: "100%" }}>

                              <div id="content" className="mt-3">

                                <div className="card mb-4" >




                                  <div className="card-body" nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ "width": "100%" }}>

                                    <EmployeeDetails
                                      deleteTrip={this.deleteTrip}
                                      filterAlerts={this.state.filterAlerts}
                                      putFilterAlerts={this.putFilterAlerts}
                                      sendMessage={this.sendMessage}
                                      showModalPeriod={this.showModalPeriod}
                                      showEditTripFields={this.showEditTripFields}
                                      myEmployee={this.state.myEmployee}
                                      strStatus={this.state.strStatus}
                                      showModalActivity={this.showModalActivity}
                                      showSendSmsActivity={this.showSendSmsActivity}
                                      thisDeposited={this.state.thisDeposited}
                                      currentUser={this.state.currentUser}
                                      dowloadActivityReport={this.dowloadActivityReport}
                                      search={this.search}
                                      seslectDisplayMode={this.seslectDisplayMode}
                                      displayType={this.state.displayType}
                                      activityListInit={this.state.activityListInit}
                                      editActivityListInit={this.editActivityListInit}
                                      showCreationFields={this.showCreationFields}
                                      editTripsListInit={this.editTripsListInit}
                                      tripsListInit={this.state.tripsListInit}
                                      device={this.state.device}
                                      showCreateTripFields={this.showCreateTripFields}
                                      showHolidays={this.showHolidays}
                                      showError={this.showError}
                                      editPeriodsListInit={this.editPeriodsListInit}
                                      periodsListInit={this.state.periodsListInit}
                                      userRole={this.state.userRole}
                                      dowloadEmployeeReport={this.dowloadEmployeeReport}
                                      ref={this.childRefEmployee}
                                      ref2={this.childRefHandle}
                                      childHistory={this.state.childHistory}
                                      childFuture={this.state.childFuture}


                                    />
                                  </div>

                                </div>

                              </div>
                            </div>
                          </div>

                        </td>
                        <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ verticalAlign: "top", width: "5%" }}>

                        </td>

                      </tr>

                    </tbody>

                  </table>
                </div>

              } else if (this.state.userRole === 'admin' || this.state.userRole === 'manager') {
                // esto es para lo del movil
                table = <table nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "100%" }}>
                  <tbody>

                    <tr nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "100%" }}>
                      <th scope="col" className="text-center" nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "100%", height: "20" }}></th>
                    </tr>
                    <tr nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "100%" }}>
                      <br></br><br></br>
                      {actions}
                    </tr>


                    <tr nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "100%" }}>
                      {listContent}
                    </tr>


                    <tr nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "100%" }}>
                      {tripContent}
                    </tr>

                    <tr nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "100%" }}>
                      {showUpload}
                    </tr>


                  </tbody>
                </table>
              }
      }


      // a partir de aqui defino los Modals y estos returnean algo aunque ya haya algo en tabla o algo asi
      let footerStyle
      if (this.state.device === 'desktop') {
        if(window.innerHeight > 1200){
          footerStyle = {
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            };
        }    
      }
      let footer = <div></div>

      let pageFullyLoaded = this.state.pageFullyLoaded

  
      if (pageFullyLoaded && !this.state.loading){
        footer = <Footer 
        userToken = {this.state.userToken}
        style={footerStyle}
        />
      }

      let spacer = <div></div>
      let employeesNow = this.state.employees
      

      if (employeesNow.length<=3 && !(this.state.userToken==="null" || this.state.userToken===null || this.state.userToken===undefined)){
        spacer = <div>
          <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
        </div>
      }
  
      if (this.state.showModalActivity === true) {

        return (
          <div>
            <ModalActivity
              onClose={this.onClose}
              show={this.state.showModalActivity}
              showError={this.showError}
              selectedActivity={this.state.selectedActivity}
              defaultComments={this.state.defaultComments}
              defaultPlace={this.state.defaultPlace}
              defaultIdentifier={this.state.defaultIdentifier}
              editActivityDetails={this.editActivityDetails}>
              Añade los detalles
            </ModalActivity>
          </div>
        );
       
      } 
      else if (this.state.showSendSmsActivity === true) {       

        return (
          <div>
            
            <SendSmsActivity
              onClose={this.onClose}
              show={this.state.showSendSmsActivity}
              showError={this.showError}
              selectedActivity={this.state.selectedActivity}
              defaultComments={this.state.defaultComments}
              defaultPlace={this.state.defaultPlace}
              defaultIdentifier={this.state.defaultIdentifier}
              sendMessage={this.sendMessage}
              myEmployee = {this.state.myEmployee}
              start = {this.state.start}
              end= {this.state.end}
              selectedActivityDict={this.state.selectedActivityDict}
              >
              Añade los detalles
            </SendSmsActivity>
          </div>
        );
        
      }
      else if (this.state.showLastModal === true) {

        return (
          <div>
            <ModalLasts
              showError={this.showError}
              onClose={this.onClose}
              show={this.state.showLastModal}
              generalView={this.state.generalView}
              employeesList={this.state.employeesList}


            >
              Los datos están incompletos
            </ModalLasts>
          </div>
        );

      } else if (this.state.askTacProvider === true) {


        return (
          <div nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "100%" }}>
            <SelectProviderModal
              showError={this.showError}
              onClose={this.onClose}
              show={this.state.askTacProvider}
              editTacProvider={this.editTacProvider}
              askContCred={this.state.askContCred}


            >
              Selecciona tu proveedor de descarga remota de Tacógrafos
            </SelectProviderModal>
          </div>
        );

      } else if (this.state.showPlaceholderOthers === true) {
        return (
          <div nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "100%" }}>
            <table nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "100%", height: "100%" }}>
              <tr nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "100%", height: "20%" }}>
                <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "30%" }}>

                </td>
                <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "40%" }}>

                </td>
                <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "30%" }}>
                  <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>

                </td>

              </tr>
              <tr nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "100%", height: "60%" }}>
                <td></td>
                <td>
                  <div className="card mb-4" >
                    <div className="card-body" nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '100%' }}>
                      <p nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ color: "#5A5A5A", fontWeight: "light" }}> No te preocupes, podemos integrar cualquier sistema de Tacógrafos</p>

                      <p nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ color: "#5A5A5A", fontWeight: "light" }}> Para conseguirlo, contáctanos en <a href="https://traxain.com"> Traxain.com</a>, escríbenos a <a href="mailto:ignacio@traxain.com"> ignacio@traxain.com </a>, o llama al  <a href="tel:+34638269633">+34 638 26 96 33 </a>, y conectaremos tus sistemas directamente</p>
                      <p nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ color: "#5A5A5A", fontWeight: "light" }}> También puedes subir directamente los archivos</p>
                      <table nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '100%' }}>
                        <tr nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '100%' }}>
                          <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '45%' }}>
                            <button type="button" className="btn btn-primary btn-block btn-lg" nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "100%", backgroundColor: "green", border: "none", fontSize: 16 }} onClick={(event) => {
                              this.setState({ showPlaceholderOthers: false })
                              this.setState({ upLoadTGDManually: true })

                            }}>Subir manualmente
                            </button>

                          </td>
                          <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '10%' }}></td>
                          <td nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: '45%' }}>
                            <button type="button" className="btn btn-primary btn-block btn-lg" nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "100%", backgroundColor: "red", border: "none", fontSize: 16 }} onClick={(event) => {

                              this.setState({ showPlaceholderOthers: false })
                              this.setState({ errorHappened: true })
                              this.setState({ errorMsg: 'Aún no tenemos datos para ti. Contáctanos en traxain.com, escribiendo a ignacio@traxain o llamando al +34 638 26 96 33 (4)' })

                            }}>Cerrar
                            </button>
                          </td>

                        </tr>

                      </table>

                    </div></div>
                </td>
                <td></td>
              </tr>
              <tr nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: "100%", height: "20%" }}>
                <td></td>
                <td></td>
                <td></td>
                </tr>
              </table>
            </div>
              )
    
    
        }else if(this.state.askContCred===true){
          return (
            <div nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{width:"100%"}}>
            <ModalContinental 
                showError = {this.showError}
                onClose={this.onClose}
                show={this.state.askContCred} 
                editContinentalCredentials={this.editContinentalCredentials}
                editRole={this.editRole}
                editTacProvider={this.editTacProvider}

    
                
                >
                            Introduce tus credenciales de Continental
                  </ModalContinental>
                  </div>
          );  
        }else if(this.state.newPassAsked===true){
          return (
            <div nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{width:"80%"}}>
            <ModalChangePass 
                showError = {this.showError}
                onClose={this.onClose}
                show={this.state.newPassAsked} 
                askNewPass={this.askNewPass}
                assignNewPass={this.assignNewPass}
                getOldPass={this.getOldPass}
                device = {this.state.device}
    
                
                >
                            Introduce tu nueva contraseña
                  </ModalChangePass>
                  </div>
          );  
    
        
        
        
        }else if(this.state.showNavigatorModal===true){
          return (
            <div>
            <NavigatorModal 
                showError = {this.showError}
                account={this.state.account} 
                device= {this.state.device}
                product={this.state.product}
                selectProduct={this.selectProduct}
                showCreationFields={this.showCreationFields}
                usersEmployeeCount={this.usersEmployeeCount}
                usersEmployeeLoad={this.usersEmployeeLoad}
                userRole={this.state.userRole}
                askNewPass={this.askNewPass}
                selectANDirecto={this.selectANDirecto}
                showANDirecto={this.state.showANDirecto}
                showNavigatorModal={this.showNavigatorModal}
                show={this.state.showNavigatorModal}
                onCloseNav={this.onCloseNav}
                
      
    
                
                >
                  </NavigatorModal>
                  </div>
          );
    
        
          
          
      }else if(this.state.showPeriodModal===true){

        
        return (
          <div>
          <ModalPeriod 
              
              show={this.state.showPeriodModal}
              editPeriodDetails={this.editPeriodDetails}
              selectedPeriod={this.state.selectedPeriod}
              onClose={this.onClose}>
                Edita la dieta
    
  
              </ModalPeriod>
                </div>
        );
  
      
      }else if(this.state.showTripModal===true){
        return (
          <div>
            <ModalTrip
            show={this.state.showTripModal}
            originTrip={this.state.originTrip}
            destinationTrip={this.state.destinationTrip}
            dateTrip={this.state.dateTrip}
            modeTrip={this.state.modeTrip}
            editTripDetails={this.editTripDetails}
            selectedTrip={this.state.selectedTrip}
            onClose={this.onClose}>
              Edita el viaje
            </ModalTrip>
          </div>
        );
      } else {
    
          // aqui devulevo la vista general

          let endpoint = this.state.endPoint

          
          let endpoint2 = endpoint.replace(/^https?:\/\//i, "")
          let currentUser = this.state.currentUser
          var webSocketUrl = "ws://" + endpoint2 + "ws/"+ currentUser
    
          let winWidth = this.state.winWidth

        let websocket = <div></div>
      //     if (currentUser!==null && currentUser!==undefined && currentUser!=="null" ){
      //     websocket =  
      //             <WebSocketComponent
      //                                     //webSocketUrl={"ws://" + this.state.endpoint.replace(/^https?:\/\//i, "") + ws}
      //                                     webSocketUrl={webSocketUrl} 
      //                                     onMessage={"test"}
                                
      //                           />
      // }
      let askIntall
      if (this.state.device==="desktop"){
        askIntall= <div></div>
      }else{
        askIntall = <div nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{width: "100%"}}><br></br><br></br><AskInstall /> <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br></div>

      }

      
        return (

          <div nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={{ width: winWidth, height: window.innerHeight > 1200 ? window.innerHeight : "auto" }}>
           {/* < PushNotification /> */}
            <Navbar
              showError={this.showError}
              account={this.state.account}
              device={this.state.device}
              product={this.state.product}
              selectProduct={this.selectProduct}
              showCreationFields={this.showCreationFields}
              usersEmployeeCount={this.usersEmployeeCount}
              usersEmployeeLoad={this.usersEmployeeLoad}
              userRole={this.state.userRole}
              askNewPass={this.askNewPass}
              selectANDirecto={this.selectANDirecto}
              showANDirecto={this.state.showANDirecto}
              showNavigatorModal={this.showNavigatorModal}
              winWidth={this.state.winWidth}
              winHeight={this.state.winHeight}
              volverAlPasado={this.volverAlPasado}
              regresoAlFuturo={this.regresoAlFuturo}
              stateHistory={this.state.stateHistory}
              stateFuture={this.state.stateFuture}

            />


            <div nonce="kjcdhjkehfkldgso2379389xbagfjtdfdfg" style={sectionStyle}>
              
              {error}

              {loader}

              <br></br>

              {content}
              
              <br></br><br></br>
              
              
              {table}
              {askIntall}
              <br></br>
              
              {spacer}

              
            </div>
            
            {footer}
            
          </div>



        );


      }
    } catch (err) {

      this.setState({ errorHappened: true })
      this.setState({ errorMsg: 'Se ha producido un error no especificado, esta ventana se va a recargar' })
      setTimeout(() => window.location.reload(), 2000)

   }




  }
}

export default Home;