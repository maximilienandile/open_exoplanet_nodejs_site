var config = {}

config.link_github = "https://raw.githubusercontent.com/OpenExoplanetCatalogue/oec_gzip/master/systems.xml.gz"
config.iftt_web_hook = "https://maker.ifttt.com/trigger/update_openexoplanet/with/key/cqtRBHbna9akPYf7wQ6IXeseULL5xGfahTvoBXGOD5y"

config.database = {}

config.database.url = process.env.MONGODB_URI || "mongodb://localhost:27017/openexoplanet"
config.database.collection_name = "planets2"
module.exports = config
