import { jest } from '@jest/globals'
import request from 'supertest'

// import app 
const { default: app } = await import('../index.js')

// global reset mocks to avoid leaking
beforeEach(() => {
  jest.resetAllMocks()
})

//sign up for waitlist
describe('GET /api/current/weather', () => {
  it('returns weather result as fetched successfully', async () => {
    // mock weather data
    const mockWeather = {
        "temperature": {
            "degrees": 24.1,
            "unit": "CELSIUS"},
        "feelsLikeTemperature": {
            "degrees": 25.3,
            "unit": "CELSIUS"},
        "dewPoint": {
            "degrees": 13.7,
            "unit": "CELSIUS"},
        "heatIndex": {
            "degrees": 25.3,
            "unit": "CELSIUS"}}

    //use global fetch to not have a real HTTP request
    //suggestion from Claude Sonnet 4.6
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockWeather)
    })
    //request data
    const response = await request(app)
      .get('/api/current/weather')
      .expect('Content-Type', /json/)
      .expect(200)

    //check response if it has a value
    expect(response.body).toBeDefined()
    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(response.body.temperature).toEqual({"degrees": 24.1, "unit": "CELSIUS"})
  })
})