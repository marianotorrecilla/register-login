const path = require('path');
const fs = require('fs');

module.exports = {
    index: function(req,res){
        res.render(path.resolve(__dirname, '..','views','web','home'));
    },
}