const http = require('http');
const dotenv = require('dotenv');
dotenv.config();

const app = require('./app.js');
const {mongoConnect} = require('./services/mongo.js');
const {loadPlanetsData} = require('./models/planets.model.js');
const {loadLaunchData} = require('./models/launches.model.js');

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

async function startServer() {
    await mongoConnect();
    try {
        await loadPlanetsData();
        await loadLaunchData();
    }
    catch(err) {
        console.log(err);
    }
    
    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`);
    })
}

startServer();
