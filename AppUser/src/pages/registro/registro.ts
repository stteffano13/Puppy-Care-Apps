import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Component } from "@angular/core";
import { HomePage } from "../home/home";
import { GLOBAL } from "../../app/services/global";
import {
  NavController,
  AlertController,
  LoadingController
} from "ionic-angular";
import { UserService } from "../../app/services/user.services";
import { User } from "../../app/models/user";
//import { PrincipalPage } from "../principal/principal";

@Component({
  selector: "page-registro",
  templateUrl: "registro.html",
  providers: [UserService]
})

export class RegistroPage {
  public user_register: User;
  public identity;
  public token;
  public url;
  //objeto para la validacion del formulario
  miModelo: any;
  verificarPassword = "";

  constructor(
    private camera: Camera,
    public navCtrl: NavController,
    private _userService: UserService,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController
  ) {
    this.url2 = 'assets/imgs/tituloRegistro.png';
    this.url = GLOBAL.url;
    this.miModelo = {};
    this.user_register = new User("", "", "", "", "", "", "", "", "","");

    const options: CameraOptions = {
  quality: 100,
  destinationType: this.camera.DestinationType.FILE_URI,
  encodingType: this.camera.EncodingType.JPEG,
  mediaType: this.camera.MediaType.PICTURE
}


  }




  
  public verificarContrasenas() {
    console.log('contrasena >>', this.user_register.contrasena);
    console.log('contrasena a verificar>>', this.verificarPassword);
    if ((this.user_register.contrasena == this.verificarPassword) && this.user_register.contrasena != '' && this.verificarPassword != '') {
      //son correctas
      console.log('las contrasenas son CORRECTAS');
      return true;
    } else {
      //son incorrectas
      console.log('las contrasenas son INCORRECTAS');
      return false;
    }
  }

  public onRegister() {
    try {
      if (!this.validarCampos() && this.verificarContrasenas() == false) {
        console.log("mi JSON esta incorrecto");
        this.presentAlert();
      } else {
        this.verificarUsuario();
        this.user_register.estado = "0";
        this._userService.register(this.user_register).subscribe(
          response => {
            if (this.filesToUpload) {
            
              console.log("nombre de archivo" + this.filesToUpload[0].name);
              this.makeFileRequest(this.url + 'upload-image-user/' + response.user._id, [], this.filesToUpload).then(
    
                (result: any) => {
                  this.user_register.image = result.image;
                }
              );
            }
            setTimeout(() => {
              this.showAlertCorrecto(
                "El Usuario ha sido Registrado satisfactoriamente. Ingrese su correo y contraseña"
              );
            }, 3000);
            this.navCtrl.push(HomePage);
          },
          err => {
            var errorMessage = <any>err;
            if (errorMessage) {
              console.log(errorMessage);
              try {
                var body = JSON.parse(err._body);
                errorMessage = body.message;
              } catch (error) {
                errorMessage = "No hay conexión intentelo más tarde";
              }
              setTimeout(() => {
                this.showAlert(errorMessage);
              }, 3000);
              console.log(errorMessage);
            }
          }
        );
      }
    } catch (error) {
      this.showAlert("Verifique que la información sea correcta, debe llenar toda la información.");
    }
  }

  showAlert(errorr) {
    let alert = this.alertCtrl.create({
      subTitle: "Error",
      message: errorr,
      buttons: ["OK"]
    });
    alert.present();
  }

  showAlertCorrecto(corec) {
    let alert = this.alertCtrl.create({
      title: "Correcto",
      subTitle: corec,
      buttons: ["OK"]
    });
    alert.present();
  }
  verificarUsuario() {
    let loading = this.loadingCtrl.create({
      content: "Verficando sus datos"
    });
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 3000);
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: "Atención",
      subTitle: "Verifique que la información sea correcta antes de continuar",
      buttons: ["Aceptar"]
    });
    alert.present();
  }

  presentAlertCedula() {
    let alert = this.alertCtrl.create({
      subTitle: "Atención",
      message: "La cédula ingresada es incorrecta",
      buttons: ["Aceptar"]
    });
    alert.present();
  }

  presentAlertCaracteresEspeciales() {
    let alert = this.alertCtrl.create({
      subTitle: "Atención",
      message: "El campo posee caractéres especiales",
      buttons: ["Corregir"]
    });
    alert.present();
  }

  validarCampos() {
    var bool_nombres = this.soloLetras(this.user_register.nombre);
    var bool_apellidos = this.soloLetras(this.user_register.apellido);
    var bool_celular = this.soloNumeros(this.user_register.tel_celular);
    var bool_telefono = this.soloNumeros(this.user_register.tel_convencional);
    //var bool_cedula = this.validarCedula();
    //var confirmarContrasenia = JSON.parse(this.miModelo.confirmContrasena);
    // console.log("valor de miModelo: ", confirmarContrasenia);

    if (
     
      this.user_register.nombre == "" ||
      this.user_register.apellido == "" ||
      this.user_register.correo == "" ||
      this.user_register.contrasena == "" ||
      this.user_register.tel_celular == "" ||
      this.user_register.tel_convencional == "" ||
      bool_nombres ||
      bool_apellidos ||
      bool_celular ||
      bool_telefono ||
     
      (this.user_register.contrasena != this.verificarPassword) ||
      this.verificarPassword == null
    ) {
      console.log('retorno falso');
      return false;
    } else {
      console.log('retorno verdadero');
      return true;
    }
  }

  /*validarCedula() {
    var cad: any = this.user_register.cedula;
    var i;

    var total = 0;
    var longitud = cad.length;
    var longcheck = longitud - 1;
    if (cad !== "" && longitud === 10) {
      for (i = 0; i < longcheck; i++) {
        if (i % 2 === 0) {
          var aux = cad.charAt(i) * 2;
          if (aux > 9) aux -= 9;
          total += aux;
        } else {
          total += parseInt(cad.charAt(i)); // parseInt o concatenará en lugar de sumar
        }
      }
      total = total % 10 ? 10 - total % 10 : 0;

      if (cad.charAt(longitud - 1) == total) {
        return true;
      } else {
        this.presentAlertCedula();
        this.user_register.cedula = "";
        return false;
      }
    }
  }*/

  soloLetras(string) {
    //solo letras
    //Se añaden las letras validas
    var filtro = "abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ "; //Caracteres validos
    var ct = 0;
    for (var i = 0; i < string.length; i++) {
      if (filtro.indexOf(string.charAt(i)) == -1) {
        ct = ct + 1;
      }
    }
    if (ct > 0) {
      return true; //Posee caracteres especiales
    } else {
      return false; //NO Posee caracteres especiales
    }
  }

  soloNumeros(string) {
    //solo letras
    //Se añaden las letras validas
    var filtro = "0123456789 "; //Caracteres validos
    var ct = 0;
    for (var i = 0; i < string.length; i++) {
      if (filtro.indexOf(string.charAt(i)) == -1) {
        ct = ct + 1;
      }
    }
    if (ct > 0) {
      return true; //Posee caracteres especiales
    } else {
      return false; //NO Posee caracteres especiales
    }
  }

  goBack() {
    this.navCtrl.push(HomePage);
  }

  public url2;
  public filesToUpload: Array<File>;

  readUrl(event: any) {

    this.filesToUpload = <Array<File>>event.target.files;

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event: any) => {
        this.url2 = event.target.result;
       
      }

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
    // var token = this.tpken;
    return new Promise(function (resolve, reject) {
      var fromData: any = new FormData();
      var xhr = new XMLHttpRequest();

      for (var i = 0; i < files.length; i++) {
        fromData.append('image', files[i], files[i].name)
      }

      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      }

      xhr.open('POST', url, true);
      // xhr.setRequestHeader('Authorization', token);
      xhr.send(fromData);
    });
  }
}
