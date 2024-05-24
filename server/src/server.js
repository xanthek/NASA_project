const http = require('http');
const mongoose = require('mongoose');

const app = require('./app.js');
const {loadPlanetsData} = require('./models/planets.model.js');

const PORT = process.env.PORT || 4000;

const MONGO_URL = process.env.MONGO_URL;

const server = http.createServer(app);

mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready');
});

mongoose.connection.on('error', (err) => {
    console.error(err);
});

async function startServer() {
    await mongoose.connect(MONGO_URL);
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
