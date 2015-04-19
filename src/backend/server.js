//var express = require('express');
//var app = express();

var Api = require('./api.js').api();

var server = Api.listen(3000, function () {

    var port = server.address().port;
    console.log('Example app listening at http://localhost:' + port);

});