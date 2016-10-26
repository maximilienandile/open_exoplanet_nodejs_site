/**
* This function will get the last updated planets and the last discovered planets
*
* @param {Object} db database connection
* @returns
*/
var get_last_updated_and_discovered_planets = function (db) {
  return new Promise(function (resolve, reject) {
    var collection = db.collection('planets2');
    collection.find({
      "discoveryyear": {
        $exists: true
      }
    }).sort({
      "discoveryyear": -1,
      "lastupdate": -1
    }).toArray(function (err, docs) {
      if (err) {
        reject(err)
      }

      if (docs.length > 0) {
        resolve(docs)
      } else {
        reject("no Planets found - Error 001")
      }
    });

  });
}


/**
*
*
* @param {Object} db
* @returns
*/
var get_a_random_planet = function (db) {
  return new Promise(function (resolve, reject) {
    var collection = db.collection('planets2');

    var random = Math.random();
    console.log(random)
    collection.find({ 'random_number' : { '$gte' : random } }).limit(50).toArray(function (err, doc) {
      if(err){
        reject(err)
      }
      console.log(doc)
      if(doc.length>0){
        var r = Math.floor(Math.random() * doc.length)
        console.log(r)
        resolve(doc[r])

      }else{
        reject("no planet Found- Error 002")

      }

    });
  });
}


var get_a_planet_by_name_slug = function (db,name_slug) {
  return new Promise(function (resolve, reject) {
    var collection = db.collection('planets2');
    collection.find({
      "name_slug": name_slug
    }).toArray(function (err, docs) {

      if (err) {
        reject(err)
      } else {
        console.log(docs);

        if (docs.length > 0) {
          resolve(docs[0])
        } else {
          reject("no planet found with this name - Error 003")

        }

      }


    });
  });
}


module.exports = {
  get_last_updated_and_discovered_planets: get_last_updated_and_discovered_planets,
  get_a_random_planet : get_a_random_planet,
  get_a_planet_by_name_slug : get_a_planet_by_name_slug
}
