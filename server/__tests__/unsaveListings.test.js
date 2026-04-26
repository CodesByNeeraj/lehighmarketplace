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
      findFirst: jest.fn(),
      delete: jest.fn()
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

//unsave a listing
describe('DELETE /api/listings/unsave-listing/:listingId', () => {
    it('returns 404 if saved listing is not found', async () => {
        //set up mock data
        prisma.savedListing.findFirst.mockResolvedValueOnce(null)

        //request data
        const response = await request(app)
        .delete('/api/listings/unsave-listing/1')
        .expect(404)

        //check if return error
        expect(response.body.message).toBe("Listing not found")
    })
  
    it('returns a successful message as deleting saved listing successfully', async () => {
        //set up mock data
        prisma.savedListing.findFirst.mockResolvedValueOnce({student_id: "1", listing_id: "1"})

        //request data
        const response = await request(app)
        .delete('/api/listings/unsave-listing/1')
        .expect('Content-Type', /json/)
        .expect(200)

        //check if return message
        expect(response.body.message).toBe("Listing unsaved successfully")
    })
})