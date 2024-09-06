const request = require('supertest');
const app = require('./index');
const { default: axios } = require('axios');


describe('get holidays data endpoint with invalid API', () => {
  it('should handle invalid API responses', async () => {
    jest.spyOn(axios, 'get').mockRejectedValueOnce({
      response: {
        status: 401,
        data: { message: 'Invalid API key' },
      },
    });

    const response = await request(app).get('/PK/2024/');
    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Invalid API key');
  });
});


describe('get holidays data endpoint with valid API', () => {
  it('should return a list of holidays', async () => {
    const response = await request(app).get('/PK/2024/');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('Event Name');
    expect(response.body[0]).toHaveProperty('Description');
    expect(response.body[0]).toHaveProperty('Date');
  });
});

describe('get country list endpoint with valid API', () => {
  it('should return a list of countries', async () => {
    const response = await request(app).get('/countries/');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });
});

describe('get country list endpoint with invalid API', () => {
  it('should handle API failures gracefully', async () => {
    jest.spyOn(axios, 'get').mockRejectedValueOnce({
      response: {
        status: 401,
        data: { message: 'Invalid API key' },
      },
    });
    const response = await request(app).get('/countries');
    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Invalid API key');
  });
});

