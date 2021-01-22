const Distance = require('./models/distance');
function Mongo() {
}

Mongo.prototype = (function () {
    return {
        getDistance: async function (req, res) {
            try{
                const distance = await Distance.find()
                res.send({status : 'success', distance : distance});
            }
            catch(err){
                return res.send({status : 'error' , error_message : err})
            }   
        }
    }
})();


const mongo = new Mongo();

module.exports = mongo;
