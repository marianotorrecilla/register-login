const fs = require('fs');
const path = require('path');
const { User} = require('../database/models');


module.exports = (req,res,next) =>{
    //Variable locals (super global - vive en las vistas )
    res.locals.user = false;
    if(req.session.user){
        console.log('marianoExample--------' + req.session.user.email);
        res.locals.user = req.session.user;
        return next();
    }else if(req.cookies.valid){
        User.findOne({
            where: {
                email: req.cookies.valid
            }
        })
        .then(user =>{
            req.session.user = user;
            req.locals.user = user;
            return next();
        })
        
    }else{
        return next();
    }
}