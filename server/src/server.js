const http = require('http');
const dotenv = require('dotenv');
dotenv.config();

console.log(process.env.PORT);

const app = require('./app.js');
const {mongoConnect} = require('./services/mongo.js');
const {loadPlanetsData} = require('./models/planets.model.js');
const { log } = require('console');

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

async function startServer() {
    await mongoConnect();
    try {
        await loadPlanetsData();
    }
    catch(err) {
        console.log(err);
    }
    
    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`);
    })
}

startServer();
