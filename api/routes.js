const express = require('express');
const mongo = require('../db/mongo');

var router = express.Router();
const distanceTemplate = require('../db/models/distance');


router.get('/historydata', mongo.getDistance);

router.post('/historydata',  async (req ,res) => {
    let travelDistace  = new distanceTemplate({
        startAddress:req.body.startAddress,
        endAddress:req.body.endAddress,
        distance:req.body.distance,
        duration:req.body.duration
    })
    try{
        travelledDistace = await travelDistace.save();
    }
    catch(e){
     console.log(e);
    }; 
  
});



module.exports = router;