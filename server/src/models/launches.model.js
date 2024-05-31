 const axios = require('axios');
 
 const launches = require('./launches.mongo.js');
 const planets = require('./planets.mongo.js');
const { query } = require('express');

 const DEFAULT_FLIGHT_NUMBER = 100;
 const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

 async function getAllLaunches() {
  try {
    return await launches
    .find({}, {'_id': 0, '__v': 0}); // excludes _id and version __v from response
  } catch (error) {
    console.error(error);
  }

 }

 async function saveLaunch(launch) {
  
  await launches.findOneAndUpdate({
    flightNumber: launch.flightNumber,
  }, launch, {
    upsert: true
  });
 }

 async function getLatestFlightNumber() {
  const latestLaunch = await launches
  .findOne({})
  .sort('-flightNumber');

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
 }

 async function addNewLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target
  });

  if (!planet) {
    throw new Error('Now matching planet found');
  }
  const newFlightNumber = await getLatestFlightNumber() + 1 ;
  const newLaunch = Object.assign(launch, {
    flightNumber: newFlightNumber,
    customers: ['Janusz', 'NASA']
  });
  await saveLaunch(newLaunch);
 }

 async function findLaunch(filter) {
  return await launches.findOne(filter);
 }

 async function existsLaunchWithId(launchId) {
  return await findLaunch({
    flightNumber: launchId
  });
 }

 async function abortLaunchById(launchId) {
  const aborted = await launches.updateOne({
    flightNumber: launchId
  }, {
    upcoming: false,
    success: false
  });

  return aborted.modifiedCount === 1;
 }

 async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat'
  });

  if (firstLaunch) {
      console.log('Launch data already loaded');
      return;
  }
  await populateLaunches();
}

 async function populateLaunches() {
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1
          }
        },
        {
          path: 'payloads',
          select: {
            'customers': 1
          }
        }
      ]
    }
  });

  if (response.status !== 200) {
    throw new Error('An error occured while getting launches data from spaceX api');
  }


  const launchDocs = response.data.docs;
  
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc['payloads'];
    const customers = payloads.flatMap((payload) => {
      return payload['customers'];
    })
    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      launchDate: launchDoc['date_utc'],
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
      customers
    };
    console.log(`${launch.flightNumber} || ${launch.mission} || ${customers} || ${launch.launchDate}`);

    await saveLaunch(launch);
  };
  return;
};
 

 module.exports = {
   getAllLaunches,
   addNewLaunch,
   existsLaunchWithId,
   abortLaunchById,
   loadLaunchData
 }