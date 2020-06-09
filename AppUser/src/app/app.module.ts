import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar'; 
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Home1Page } from '../pages/home1/home1';


import { RegistroPage } from '../pages/registro/registro';
import { MiCuenta } from '../pages/mi_cuenta/mi_cuenta';
import { PrincipalPage } from '../pages/principal/principal';
import { UbicacionInicioPage } from '../pages/ubicacion-inicio/ubicacion-inicio';
import { UbicacionFinalPage } from '../pages/ubicacion-final/ubicacion-final';
import { HistorialPage } from '../pages/historial/historial';
import { SolicitudesPage } from '../pages/solicitudes/solicitudes';
import { CardsolicitudPage } from '../pages/cardsolicitud/cardsolicitud';
import { ConfirmacionPage } from '../pages/confirmacion/confirmacion';
import {TerminosPage} from '../pages/terminos/terminos';
import { ContrasenaPage } from '../pages/contrasena/contrasena';
import { ContactosPage } from '../pages/contactanos/contactanos';

import { UserService } from './services/user.services';
import { MessageService } from './services/message.services';
import { NotificacionesService } from './services/notificaciones.services';
import { PayPal } from './services/paypal.service';
import { EnvioEmail } from './services/correo.service';
//plugin de la geolicalizacion
import { Geolocation } from '@ionic-native/geolocation';
import { AgmCoreModule } from '@agm/core';
//validacion de campos
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';

//Datapicker
import { MyDatePickerModule } from 'mydatepicker';

// abrir browser
import { InAppBrowser } from '@ionic-native/in-app-browser';

// call number
import { CallNumber } from '@ionic-native/call-number';
// e-mail
import { EmailComposer } from '@ionic-native/email-composer';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    RegistroPage,
    MiCuenta,
    PrincipalPage,
    UbicacionInicioPage,
    UbicacionFinalPage,
    HistorialPage,
    SolicitudesPage,
    CardsolicitudPage,
    ConfirmacionPage,
    TerminosPage,
    ContrasenaPage,
    ContactosPage,
    Home1Page
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyARuGaeV-rD_M_ZP2uZT6d8SzFmywzAbRk',
      libraries: ["places"]
    }),
    FormsModule,
    CustomFormsModule,
    MyDatePickerModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    RegistroPage,
    MiCuenta,
    PrincipalPage, 
    UbicacionInicioPage,
    UbicacionFinalPage,
    HistorialPage,
    SolicitudesPage,
    CardsolicitudPage,
    ConfirmacionPage,
    TerminosPage,
    ContrasenaPage,
    ContactosPage,
    Home1Page
  ],
  providers: [
    StatusBar,
    SplashScreen,
    UserService,
    MessageService,
    NotificacionesService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Geolocation,
    CallNumber,
    EmailComposer,
    PayPal,
    InAppBrowser,
    EnvioEmail,
    Camera,
    
    
  ]
})
export class AppModule {}
