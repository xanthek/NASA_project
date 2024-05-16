const http = require('http');

const app = require('./app.js');
const {loadPlanetsData} = require('./models/planets.model.js');

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

async function startServer() {

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