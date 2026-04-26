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
    listing: {
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

//create a listing
describe('POST /api/listings/create-listing', () => {
  
  it('returns a successful message as creating listing successfully', async () => {
    //set up mock data
    prisma.listing.create.mockResolvedValueOnce({
        title: "new item", description: "new description", price: 1.0,
        condition: "new", meetup_location: "packard" , image_url: "new url"
    })

    //request data
    const response = await request(app)
      .post('/api/listings/create-listing')
      .send({
        title: "new item", description: "new description", price: 1.0,
        condition: "new", meetup_location: "packard" , image_url: "new url"
        })
      .expect('Content-Type', /json/)
      .expect(201)

    //check if return message
    expect(response.body.message).toBe("Listing successfully created!")
  })
})