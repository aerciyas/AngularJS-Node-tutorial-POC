//var express = require('express');
//var app = express();

var Api = require('./api.js').api();

var server = Api.listen(process.env.PORT || 3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

});