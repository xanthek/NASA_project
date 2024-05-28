 const launches = require('./launches.mongo.js');
 const planets = require('./planets.mongo.js');

 DEFAULT_FLIGHT_NUMBER = 100;
 
//  const launch = {
//     flightNumber: 100,
//     mission: 'Kepler Expedition X',
//     rocket: 'Explorer IS1',
//     launchDate: new Date('December 27, 2030'),
//     target: 'Kepler-442 b',
//     upcoming: true,
//     success: true,
//  }

//  saveLaunch(launch);



 async function getAllLaunches() {
  try {
    return await launches
    .find({}, {'_id': 0, '__v': 0}); // excludes _id and version __v from response
  } catch (error) {
    console.error(error);
  }

 }

 async function saveLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target
  });

  if (!planet) {
    throw new Error('Now matching planet found');
  }
  await launches.findOneAndUpdate({
    flightNumber: launch.flightNumber,
  }, launch, {
    upsert: true
  });
 }

 async function getLatestFlightNumber() {
  const latestLaunch = await launches
  .findOne()
  .sort('flightNumber');

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
 }

 async function addNewLaunch(launch) {
  const newFlightNumber = await getLatestFlightNumber() + 1 ;
  const newLaunch = Object.assign(launch, {
    flightNumber: newFlightNumber,
    customers: ['Janusz', 'NASA']
  });
  saveLaunch(newLaunch);
 }

 function existsLaunchWithId(launchId) {
  return launches.has(launchId);
 }

 function abortLaunchById(launchId) {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
 }

 module.exports = {
   getAllLaunches,
   addNewLaunch,
   existsLaunchWithId,
   abortLaunchById
 }