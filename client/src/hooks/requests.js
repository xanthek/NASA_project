const API_url = 'http://localhost:4000';

// Load planets and return as JSON
async function httpGetPlanets() {
  const response = await fetch(`${API_url}/planets`);
  return await response.json();
}

// Load launches, sort by flight number and return as JSON
async function httpGetLaunches() {
  const response = await fetch(`${API_url}/launches`);
  const fetchedLaunches = await response.json();
  return fetchedLaunches.sort((a,b) => {
    return a.flightNumber - b.flightNumber;
  });
}
// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${API_url}/launches`, {
      method: "post",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(launch),
    });
  } catch (error) {
    return {
      ok: false
    }
  }
  
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {
  try {
    return await fetch(`${API_url}/launches/${id}`, {
      method: "delete",
    })
  } catch (error) {
    return {
      ok: false
    }
  }

  
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};