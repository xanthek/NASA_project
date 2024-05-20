const {getAllLaunches, addNewLaunch} = require('../../models/launches.model.js');

function httpGetAllLaunches(req,res) {
    console.log('launches');
    return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
    const launch  = req.body;
    console.log(launch);
    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.destination) {
        return res.status(400).json({
            error: 'Missing required launch property'
        });
    }

    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate)) {
        res.status(400).json({
            error: 'Invalid launch date'
        });
    }

    addNewLaunch(launch);
    res.status(201).json(launch);
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch
}