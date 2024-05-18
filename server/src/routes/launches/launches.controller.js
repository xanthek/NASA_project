const {getAllLaunches} = require('../../models/launches.model.js');

function httpGetAllLaunches(req,res) {
    console.log('launches');
    return res.status(200).json(getAllLaunches());
}

module.exports = {
    httpGetAllLaunches
}