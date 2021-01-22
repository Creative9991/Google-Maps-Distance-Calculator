const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const distanceSchema = new Schema({

    startAddress : {
        type : String
    },
    endAddress: {
        type: String
    },
    distance : {
        type : String
    },
    duration : {
        type : String
    }

}, {timestamp: true});

let Distance = mongoose.model('Distance', distanceSchema);

module.exports = Distance;