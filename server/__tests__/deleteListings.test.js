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
      findUnique: jest.fn(),
      update: jest.fn()
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

//delete a listing
describe('DELETE /api/listings/delete-listing/:item_id', () => {
    it('returns 404 if listing is not found', async () => {
        //set up mock data
        prisma.listing.findUnique.mockResolvedValueOnce(null)

        //request data
        const response = await request(app)
        .delete('/api/listings/delete-listing/1')
        .expect(404)

        //check if return error
        expect(response.body.error).toBe("Listing not found")
    })

    it('returns 403 if deleting not own item', async () => {
        //set up mock data
        prisma.listing.findUnique.mockResolvedValueOnce({item_id: "1", seller_id: "4"})

        //request data
        const response = await request(app)
        .delete('/api/listings/delete-listing/1')
        .expect(403)

        //check if return error
        expect(response.body.error).toBe("Forbidden: Cannot delete other seller's listings")
    })
  
    it('returns a successful message as deleting listing successfully', async () => {
        //set up mock data
        prisma.listing.findUnique.mockResolvedValueOnce({item_id: "1", seller_id: "1"})

        //request data
        const response = await request(app)
        .delete('/api/listings/delete-listing/1')
        .expect('Content-Type', /json/)
        .expect(200)

        //check if return message
        expect(response.body.message).toBe("Listing successfully deleted!")
    })
})