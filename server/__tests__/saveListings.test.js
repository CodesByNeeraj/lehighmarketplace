import { jest } from '@jest/globals'
import request from 'supertest'

// Mock token 
jest.unstable_mockModule('../middleware/auth.js', () => ({
  default: (req, res, next) => {
    req.user = { id: "1", email: 'test@lehigh.edu', role: 'STUDENT' }
    next()
  }
}))

// Mock database
jest.unstable_mockModule('../db/prisma.js', () => ({
  default: {
    savedListing: {
      create: jest.fn()
    }
  }
}))

// import app after mocking all data
const { default: prisma } = await import('../db/prisma.js')
const { default: app } = await import('../index.js')

// global reset mocks to avoid leaking
beforeEach(() => {
  jest.resetAllMocks()
})

//save a listing
describe('POST /api/listings/save-listing/:listingId', () => {
  
  it('returns a successful message as saved listing successfully', async () => {
    //request data
    const response = await request(app)
      .post('/api/listings/save-listing/1')
      .expect('Content-Type', /json/)
      .expect(201)

    //check if return message
    expect(response.body.message).toBe("Listing saved successfully")
  })
})