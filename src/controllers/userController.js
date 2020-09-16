const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const multer = require('multer');
const { check, validationResult, body } = require('express-validator');
const db = require('../database/models/');
const User = db.User;
const Address = db.Address;

const Op = db.Sequelize.Op;

module.exports = {
    index: function(req,res){
        res.render(path.resolve(__dirname, '..','views','users','register'));
    },
    processRegister: function(req,res){
        let errors = validationResult(req);
       
        if (errors.isEmpty()) {
          let direccionARegistrar = {
            streetName: req.body.direccion,
            additionalNumbers: req.body.pisoDepto ? req.body.pisoDepto : '',
            zipCode: req.body.cp,
            province: req.body.provincia,
            neighbourhood: req.body.localidad
          }
          Address.create(direccionARegistrar)
          .then((storedAddress) => {
            let usuarioARegistrar = {
              firstName: req.body.nombre,
              lastName: req.body.apellido,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password, 10),
              image: req.file ? req.file.filename : '',
              idAddress: storedAddress.id
            }
          User.create(usuarioARegistrar).then(storedUser => 
            res.redirect('/login')
          )
          })
        } else {  
          return res.render(path.resolve(__dirname, '../views/users/register'), {
            errors: errors.mapped(),  old: req.body
          });
        }

    },

    login : function(req, res){
        res.render(path.resolve(__dirname, '..','views','users','login'));
    },

    processLogIn : function(req,res){
        let errors = validationResult(req);
      if (errors.isEmpty()) {
        let usuarioLogueado = {
          email: req.body.email,
          password: req.body.password,
        }

        User.findAll({
          where: {
            email: req.body.email,
          }
        })
        .then((user) => {
          req.session.user = user[0];
        
          if (req.body.recuerdame){
            let mailUsuarioLogueado = usuarioLogueado.email;
            res.cookie('valid', mailUsuarioLogueado, {maxAge: 1000*60*60*24});
          }
          res.redirect('/');

        })
      }
       else {
        return res.render(path.resolve(__dirname, '..','views','users','login'), { errors: errors.mapped(), old: req.body});
      }
    },
    logout: (req,res) =>{
        req.session.destroy();
        res.cookie('valid',null,{maxAge: -1});
        res.redirect('/login')
      },


}