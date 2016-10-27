var Promise = require("bluebird");
var _ = require('lodash')
var slug = require('slug')
var CronJob = require('cron').CronJob;
var request = require('request');
var MongoClient = require('mongodb').MongoClient

var config = require('../../lib/config');
var get_data_from_github = require('../data/get_data_from_github')






var put_system_record_in_mongodb=function(record,db){
  // Get the documents collection
  var collection = db.collection('systems');
  // Insert some documents
  collection.save(record, function(err, result) {
    if(err){
      console.error(err);
    } else {
      //console.log(result);
    }

  });

}

var put_planet_record_in_mongodb=function(record,db){
  // Get the documents collection
  var collection = db.collection(config.database.collection_name);
  // Insert some documents
  collection.save(record, function(err, result) {
    if(err){
      console.error(err);
    } else {
      //console.log(result);
    }

  });

}

var update_mongodb_with_data_from_github = function () {
  return new Promise(function (resolve, reject) {
    MongoClient.connect(config.database.url, function(err, db) {
      get_data_from_github.get_json().then(function(json){
        _.forEach(json, function(value, key) {
          try{
            value._id = slug(value.name)
            var system_name = value.name
            put_system_record_in_mongodb(value,db)
          } catch(e){
            reject("error in put mongodb")
          }
          if(!value.binary){
            if(value.star && value.star.planet){
              if(value.star.planet.length>1){
                _.forEach(value.star.planet, function(planet, key) {
                  planet._id=slug(planet.name)
                  if(typeof planet.name != "string"){
                    console.log("is array");
                    planet.name_slug=_.map(planet.name, function(o){
                      return slug(o)
                    });
                    planet.display_name = planet.name[0]
                    planet.random_number = Math.random()
                    if(typeof system_name != 'string'){
                      planet.system_names_array = system_name
                      planet.system_name_first = system_name[0]
                    }else {
                      var a = [system_name]
                      planet.system_names_array = a
                      planet.system_name_first = system_name
                    }

                  }else {
                    planet.name_slug = slug(planet.name)
                    planet.display_name = planet.name
                    planet.random_number = Math.random()
                    if(typeof system_name != 'string'){
                      planet.system_names_array = system_name
                      planet.system_name_first = system_name[0]
                    }else {
                      var a = [system_name]
                      planet.system_names_array = a
                      planet.system_name_first = system_name
                    }

                  }
                  console.log(planet);
                  put_planet_record_in_mongodb(planet,db)

                });

              }else {
                value.star.planet._id=slug(value.star.planet.name)
                value.star.planet.name_slug = slug(value.star.planet.name)
                value.star.planet.display_name = value.star.planet.name
                if(typeof system_name != 'string'){
                  value.star.planet.system_names_array = system_name
                  value.star.planet.system_name_first = system_name[0]
                }else {
                  var a = [system_name]
                  value.star.planet.system_names_array = a
                  value.star.planet.system_name_first = system_name
                }

                put_planet_record_in_mongodb(value.star.planet,db)
              }




            }
          }else {
            // binary data type
          }


        });
        resolve("all updated");
      })
    });
  });
}

update_mongodb_with_data_from_github()


var initialize_the_cron_task = function(){
  console.log("cron init");
  var job = new CronJob('00 30 11 * * 1-7', function() {
    //var job = new CronJob('00 * * * * *', function() {
    /*
    * Runs every day
    * at 11:30:00 AM.
    * or Sunday.
    */
    console.log("cron launched");
    update_mongodb_with_data_from_github().then(function(message){
      send_email_via_iftt(message)
    }, function (err){
      send_email_via_iftt("error")
    })

  }, function () {
    /* This function is executed when the job stops */
  },
  true, /* Start the job right now */
  'America/Los_Angeles' /* Time zone of this job. */
)

}


var send_email_via_iftt = function(message){
  return new Promise(function (resolve, reject) {
    request({
      url: config.iftt_web_hook,
      method: 'POST',
      json: {value1: message}
    }, function(err, response, body){
      console.log(err,response,body);
      if(err){
        reject(err)
      }else {
        resolve(response)
      }
    });

  });
}






module.exports = {
  initialize_the_cron_task : initialize_the_cron_task
}
