const request = require('supertest');
const app = require('../../app');
const {mongoConnect, mongoDisconnect } = require('../../services/mongo');
const {loadPlanetsData} = require('../../models/planets.model');
const {loadLaunchData} = require('../../models/launches.model');

const API_VERSION = process.env.API_VERSION || 'v1';

describe('Launches API', () => {
    beforeAll(async() => {
        await mongoConnect();
        await loadPlanetsData();
        await loadLaunchData();
    });

    afterAll(async () => {
        await mongoDisconnect();
    });

    describe('Test GET /launches', () => {
        test('It should response with 200 success', async () => {
            const response = await request(app)
            .get(`/${API_VERSION}/launches`)
            .expect('Content-Type', /json/) // we can use regular expression here
            .expect(200);
        })
    });
    
    describe('Test POST /launch', () => {
        const completeLaunchData = {
            mission: 'USS Enterprise',
            rocket: 'NCC 170',
            target: 'Kepler-62 f',
            launchDate: 'January 4, 2028'
        };
    
        const launchDataWithoutDate = {
            mission: 'USS Enterprise',
            rocket: 'NCC 170',
            target: 'Kepler-62 f',
        };
    
        const launchDataWithInvalidDate = {
            mission: 'USS Enterprise',
            rocket: 'NCC 170',
            target: 'Kepler-62 f',
            launchDate: 'kkkk '
        };
    
        test('It should respond with 201 created', async () => {
            const response = await request(app)
            .post(`/${API_VERSION}/launches`)
            .send(completeLaunchData)
            .expect('Content-Type', /json/) // we can use regular expression here
            .expect(201);
    
            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            expect(responseDate).toBe(requestDate);
    
            expect(response.body).toMatchObject(launchDataWithoutDate);
        });
        test('It should catch missing required properties', async () => {
            const response = await request(app)
            .post(`/${API_VERSION}/launches`)
            .send(launchDataWithoutDate)
            .expect('Content-Type', /json/)
            .expect(400);
    
            expect(response.body).toStrictEqual({
                error: 'Missing required launch property'
            });
        });
        test('It should catch invalid dates', async () => {
            const response = await request(app)
            .post(`/${API_VERSION}/launches`)
            .send(launchDataWithInvalidDate)
            .expect('Content-Type', /json/)
            .expect(400);
    
            expect(response.body).toStrictEqual({
                error: 'Invalid launch date'
            });
        });
    });
});

