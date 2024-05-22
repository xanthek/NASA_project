const request = require('supertest');
const app = require('../../app');

describe('Test GET /launches', () => {
    test('It should response with 200 success', async () => {
        const response = await request(app)
        .get('/launches')
        .expect('Content-Type', /json/) // we can use regular expression here
        .expect(200);
    })
})

describe('Test POST /launch', () => {
    const completeLaunchData = {
        mission: 'USS Enterprise',
        rocket: 'NCC 170',
        target: 'Kepler-186f',
        launchDate: 'January 4, 2028'
    };

    const launchDataWithoutDate = {
        mission: 'USS Enterprise',
        rocket: 'NCC 170',
        target: 'Kepler-186f',
    }

    const launchDataWithInvalidDate = {
        mission: 'USS Enterprise',
        rocket: 'NCC 170',
        target: 'Kepler-186f',
        launchDate: 'kkkk '
    };

    test('It should respond with 201 created', async () => {
        const response = await request(app)
        .post('/launches')
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
        .post('/launches')
        .send(launchDataWithoutDate)
        .expect('Content-Type', /json/)
        .expect(400);

        expect(response.body).toStrictEqual({
            error: 'Missing required launch property'
        });
    });
    test('It should catch invalid dates', async () => {
        const response = await request(app)
        .post('/launches')
        .send(launchDataWithInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400);

        expect(response.body).toStrictEqual({
            error: 'Invalid launch date'
        });
    });
})