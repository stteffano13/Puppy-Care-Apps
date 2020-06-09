'use strcit'
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');

var User = require('../models/user'); //importar el modelo del usuario  o lo que son las clases comunes
var jwt = require('../services/jwt');

function pruebas(req, res) {
    res.status(200).send({

        message: 'probando una accion del controllador de usuarios del api resto con node ymongo'
    });

}
function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/users/'+ imageFile;
    console.log("este es el path" + path_file);
    fs.exists(path_file, function (exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({
                message: 'No existe la imagen'
            });
        }
    });

}
function uploadImage(req, res) {
    var userId = req.params.id;
    var file_name = 'No se ha subido ninguna Imagen';
    
    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
       //console.log(ext_split);
          
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'png' || file_ext == 'JPG') {
            User.findByIdAndUpdate(userId, {
                image: file_name
            }, (err, userUpdated) => {
                if (!userUpdated) {
                    res.status(404).send({
                        message: "La foto del usuario no se actualizado correctamente"
                    });
                } else {

                    res.status(200).send({
                        user: userUpdated,
                        image: file_name
                    });

                }
            });
        } else {
            res.status(200).send({
                message: 'El formato de archivo no es valido '
            });
        }


    } else {
        res.status(200).send({
            message: 'No ha subido niguna imagen'
        });
    }

}
function saveUser(req, res) {
    var user = new User();
    var params = req.body; // cuerpo de la peticion post de la direccion http por post
    // console.log(params);

    User.findOne({
        '$and': [{ estado: '0' }, { '$or': [{ cedula: params.cedula }, { correo: params.correo }] }]
    }, (err, users) => {
        if (err) {
            res.status(500).send({
                message: "Error al guardar Usuario"
            });

        } else {
            if (users) {
                return res.status(500).send({
                    message: "El Usuario ya Existe"
                });
            } else {


                user.cedula = params.cedula;
                user.nombre = params.nombre;
                user.apellido = params.apellido;
                user.correo = params.correo;
                user.contrasena = params.contrasena;
                user.tel_celular = params.tel_celular;
                user.tel_convencional = params.tel_convencional;
                user.estado = params.estado;




                if (params.contrasena) {

                    // encriptar contrasena y guardar datos
                    bcrypt.hash(params.contrasena, null, null, function (err, hash) {

                        user.contrasena = hash;
                        if (user.nombre != null && user.apellido != null && user.correo != null) {
                            //guardar usuario
                            user.save((err, userStored) => {
                                if (err) {
                                    res.status(500).send({
                                        message: 'Errro al guardadr usuario'
                                    });
                                } else {
                                    if (!userStored) {
                                        res.status(404).send({
                                            message: 'No se ha registrado el  usuario'
                                        });
                                    } else {
                                        res.status(200).send({
                                            user: userStored,
                                            message: 'El Usuario se ha registrado correctamente'
                                        });

                                    }
                                }

                            }); //  save es un metodo de mongoose
                        } else {
                            res.status(200).send({
                                message: 'Introduce la contraseña '
                            });
                        }
                    });

                } else {
                    res.status(500).send({
                        message: 'Introduce la contraseña'
                    });
                }
            }
        }
    });
}

function loginUser(req, res) {
    var params = req.body;

    var correo = params.email;
    var password = params.password;
    // console.log("hola tefo este es el servicio provando el hash");
    //console.log(params.getHash);


    User.findOne({
        '$and': [{
            estado: '0'
        }, {
            correo: correo
        }]
    }, (err, user) => {
        if (err) {
            //console.log("aqui hay un error en la peticion");
            res.status(500).send({
                message: 'Error al Autenticar Usuario.'
            });
        } else {
            if (!user) {
                // console.log("error 404 el usuario no existe");
                res.status(404).send({
                    message: 'El Usuario no existe.'
                });
            } else {
                //console.log(user);
                bcrypt.compare(password, user.contrasena, function (err, check) {



                    if (check) {
                        //console.log("vamos a ver que pasa con el hash");
                        //console.log(params.getHash);
                        if (params.getHash) {


                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        } else {
                            res.status(200).send({
                                user
                            });
                        }

                    } else {
                        res.status(404).send({
                            message: 'El Usuario no ha podido Autenticarse, usuario o contraseña incorrectos.'
                        });

                    }
                });


            }
        }

    }); //como el where en sql
    console.log('no encontro');
}


function updateUser(req, res) {
    var userId = req.params.id; // en este caso e sparametro de ruta es decir el id para todo lo demas req.body
    var update = req.body;

    if (userId != req.user.sub) {
        return res.status(500).send({
            message: "No tiene permiso para actualizar este Usuario."
        });

    }


    if (update.estadoContrasena == '1') {
      //  console.log("entre para encriptar", update.estadoContrasena);
        // encriptar contrasena y guardar datos
        hash = true;
        bcrypt.hash(update.contrasena, null, null, function (err, hash) {
            update.contrasena = hash;
         //   console.log("contrasena nueva encriptada", update.contrasena);
            update.estadoContrasena == '';

            User.findByIdAndUpdate(userId, update, (err, userUpdate) => {

                if (err) {
                    res.status(500).send({
                        message: "Error al actualizar Usuario"
                    });

                } else {
                    if (!userUpdate) {
                        res.status(404).send({
                            message: "El usuario no ha podido actualizarse."
                        });
                    } else {
                        res.status(200).send({
                            user: userUpdate
                        });
                    }
                }

            });

        });
    } else {
        update.estadoContrasena == '';


        User.findOne({
            '$and': [{ estado: '0' }, { correo: update.correo }]
        }, (err, users) => {
            if (err) {
                res.status(500).send({
                    message: "Error al Actualizar Usuario"
                });

            } else {
                if (users) {
                        if(users._id!=update._id)
                        {
                            res.status(500).send({
                                message: "El correo que desea ingresar pertenece a otro Usuario"
                            });
                        }else
                        {
                            User.findByIdAndUpdate(userId, update, (err, userUpdate) => {

                                if (err) {
                                    res.status(500).send({
                                        message: "Error al actualizar Usuario."
                                    });
                    
                                } else {
                                    if (!userUpdate) {
                                        res.status(404).send({
                                            message: "El usuario no ha podido actualizarse."
                                        });
                                    } else {
                                        res.status(200).send({
                                            user: userUpdate
                                        });
                                    }
                                }
                    
                            });
                        }

                 
                }else
                {
                    User.findByIdAndUpdate(userId, update, (err, userUpdate) => {

                        if (err) {
                            res.status(500).send({
                                message: "Error al actualizar Usuario."
                            });
            
                        } else {
                            if (!userUpdate) {
                                res.status(404).send({
                                    message: "El usuario no ha podido actualizarse."
                                });
                            } else {
                                res.status(200).send({
                                    user: userUpdate
                                });
                            }
                        }
            
                    });
                }
            }

        });





        

    }


}


function getUsers(req, res) {
    // console.log("estoy trayedo mensajes  de vaijes llenos");
     
   
     var message = User.find((err, allusers) => {
       if (err) {
         return res.status(500).send({
           message: 'Error al obtener Viajes Llenos'
         });
       }
   
       if (!allusers) {
         return res.status(200).send({
           message: 'No tiene Viajes Llenos'
         });
       }else
       {
         return res.status(200).send({
            allusers
         });
       }
   });
     
 }

function pruebaServicio(req, res) {
    //console.log("ya llego la peticion  al servicio");
    res.status(404).send({
        message: "ya esta la peticion"
    });
    //console.log(req.body);
}
module.exports = { // para exportar todas las funcoones 

    pruebas,
    saveUser,
    loginUser,
    pruebaServicio,
    updateUser,
    getUsers,
    uploadImage,
    getImageFile
};