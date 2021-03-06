const express = require('express');
const router = express.Router();
const path = require('path');
const bcrypt = require('bcrypt');
const fs = require('fs');
const multer = require('multer');
const {check,validationResult,body} = require('express-validator');
const db = require('../database/models/');
const User = db.User;


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(__dirname, '..','..','public','images','usuarios'));
    },
    filename: function (req, file, cb) {
      cb(null, 'foto-'+Date.now() + path.extname(file.originalname));
    }
  })
   
const upload = multer({ storage })

//! Requerimos el controlador
const userController = require(path.resolve(__dirname,'..','controllers','userController'));


//! url de Rutas 
router.get('/register', userController.index);

User.findAll()
    .then((usuario) => {
    router.post('/register', upload.single('imagen'), [
        // VALIDACIONES
        // NOMBRE
        check('nombre').isLength({
            min: 3
        }).withMessage('El nombre es obligatorio'),
        // APELLIDO
        check('apellido').isLength({min: 3
        }).withMessage('El apellido es obligatorio'),
        // DNI  
        //DIRECCION
        check('direccion').isLength({min: 3}).withMessage('Debe colocar una dirección válida'),
            //CP
        check('cp').isLength({min: 4
        }).withMessage('Coloque su Código Postal'),
            //PROVINCIA
        check('provincia').isLength({min: 3
        }).withMessage('Debe colocar una provincia'),
            //LOCALIDAD
        check('localidad').isLength({min: 3
        }).withMessage('La localidad es obligatoria'),
            //EMAIL  
        check('email').isEmail().withMessage('Agregar un email válido'),
        // Validacion para saber si existe el email del usuario
        body('email').custom( (value) =>{
            for (let i = 0; i < usuario.length; i++) {
                if (usuario[i].email == value) {
                    return false
                }
            }
            return true
        }).withMessage('Este email ya se encuentra registrado'), 
        // Validacion de contraseña
        check('password').isLength({min: 8 }).withMessage('La contraseña debe tener un mínimo de 8 caractéres'),
        body('imagen').custom((value, {req}) =>{
            if(req.file != undefined){
                return true
            }
            return false;
        }).withMessage('Debe elegir su imagen de perfil en formato .JPG ó .JPEG ó .PNG') 
    ],userController.processRegister);
});


router.get('/login',userController.login);

User.findAll()
    .then((users) => {
        router.post('/login', [
            check('email').isEmail().withMessage('El email no es válido'),
            body('email').custom( (value) =>{
                for (let i = 0; i < users.length; i++) {
                    if (users[i].email == value) {
                        return true
                    }
                }
                return false
            }).withMessage('Este email no se encuentra registrado.'), 
            check('password').isLength({min:8}).withMessage('La contraseña debe contener al menos 8 caracteres'),
            body('password').custom( (value, {req}) =>{
                for (let i = 0; i < users.length; i++) {
                    if (users[i].email == req.body.email) {
                        if(bcrypt.compareSync(value, users[i].password)){
                            return true;
                        } else {
                            return false;
                        }
                    }
                } 
            }).withMessage('Contraseña incorrecta.')
        ],userController.processLogIn);
        

});

router.get('/logout', userController.logout);



module.exports = router;