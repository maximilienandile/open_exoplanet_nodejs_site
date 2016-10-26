var Promise = require("bluebird");
var https = require("https"),
zlib = require("zlib");
var parser = require('xml2json');
var fs = require('fs');

var config = require('../../lib/config');

var get_xml_from_url= function(url) {
  console.log("get xml");
  return new Promise(function (resolve, reject) {
    // buffer to store the streamed decompression
    var buffer = [];

    https.get(url, function(res) {
      // pipe the response into the gunzip to decompress
      var gunzip = zlib.createGunzip();
      res.pipe(gunzip);

      gunzip.on('data', function(data) {
        // decompression chunk ready, add it to the buffer
        buffer.push(data.toString())

      }).on("end", function() {
        // response and decompression complete, join the buffer and return
        resolve(buffer.join(""));

      }).on("error", function(e) {
        reject(e);
      })
    }).on('error', function(e) {
      reject(e)
    });
  });
}

var convert_xml_data_to_json_parsed=function(xml){
  return new Promise(function (resolve, reject) {
    resolve(JSON.parse(parser.toJson(xml)));
  });
}



var get_json = function(){
  return new Promise(function (resolve, reject) {
    get_xml_from_url(config.link_github).then(function(xml){
      convert_xml_data_to_json_parsed(xml).then(function(json_parsed){
        console.log("OK");
        resolve(json_parsed.systems.system)
      },function(err){
        reject(err)
      })
    },function(err){
      reject(err)
    })
  });
}


module.exports = {
  get_json : get_json
}
