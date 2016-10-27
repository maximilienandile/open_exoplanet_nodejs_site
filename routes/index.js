var express = require('express');
var router = express.Router();
var get_data_from_db = require('../lib/data/get_data_from_db')
/* GET home page. */

router.get('/', function (req, res) {
  var db = req.app.locals.db
  get_data_from_db.get_last_updated_and_discovered_planets(db).then(function (docs) {
    res.render('index', {
      data: docs, title : "A list of all exoplanets"
    });

  }, function (err) {
    res.render('app_error', {
      message: err
    })

  })

});

router.get('/random', function (req, res) {
  var db = req.app.locals.db
  get_data_from_db.get_a_random_planet(db).then(function(planet){
    res.render('planet', {
      data: planet, title : "Random Exoplanet"
    });
  },function(err){
    res.render('app_error', {
      message: err
    })

  })


});

router.get('/planet/:planet_name', function (req, res) {
  var db = req.app.locals.db
  get_data_from_db.get_a_planet_by_name_slug(db,req.params.planet_name).then(function(planet){
    res.render('planet', {
      data: planet, title : ""+planet.display_name+" - Informations about the exoplanet"})
  }, function(err){
    res.render('app_error', {
      message: err
    })
  })
});



module.exports = router;
