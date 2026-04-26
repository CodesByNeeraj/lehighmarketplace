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
        },
        conversation: {
            findFirst: jest.fn()
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

//update a listing
describe('PUT /api/listings/update-listing/:item_id', () => {
    mockItem = {
        title: "new item", description: "new description", price: 1.0,
        condition: "new", meetup_location: "packard" , image_url: "new url"
    }
  
    it('returns 404 if listing is not found', async () => {
        //set up mock data
        prisma.listing.findUnique.mockResolvedValueOnce(null)

        //request data
        const response = await request(app)
        .put('/api/listings/update-listing/1')
        .send(mockItem)
        .expect(404)

        //check if return error
        expect(response.body.error).toBe("Listing not found")
    })

    it('returns 403 if updating not own item', async () => {
        //set up mock data
        prisma.listing.findUnique.mockResolvedValueOnce({item_id: "1", seller_id: "4"})

        //request data
        const response = await request(app)
        .put('/api/listings/update-listing/1')
        .send(mockItem)
        .expect(403)

        //check if return error
        expect(response.body.error).toBe("Forbidden: Cannot update other seller's listings")
    })

    it('returns a successful message as updating listing successfully', async () => {
        //set up mock data
        prisma.listing.findUnique.mockResolvedValueOnce({item_id: "1", seller_id: "1"})

        //request data
        const response = await request(app)
        .put('/api/listings/update-listing/1')
        .send(mockItem)
        .expect('Content-Type', /json/)
        .expect(200)

        //check if return message
        expect(response.body.message).toBe("Listing successfully updated!")
    })
})

//mark a listing as sold
describe('PUT /api/listings/mark-sold/:listing_id', () => {
  
    it('returns 404 if listing is not found', async () => {
        //set up mock data
        prisma.listing.findUnique.mockResolvedValueOnce(null)

        //request data
        const response = await request(app)
        .put('/api/listings/mark-sold/1')
        .expect(404)

        //check if return error
        expect(response.body.error).toBe("Listing not found")
    })

    it('returns 403 if marking not own item', async () => {
        //set up mock data
        prisma.listing.findUnique.mockResolvedValueOnce({item_id: "1", seller_id: "4"})

        //request data
        const response = await request(app)
        .put('/api/listings/mark-sold/1')
        .expect(403)

        //check if return error
        expect(response.body.error).toBe("Forbidden")
    })

    it('returns 404 if no conversation found for selling', async () => {
        //set up mock data
        prisma.listing.findUnique.mockResolvedValueOnce({item_id: "1", seller_id: "1"})
        prisma.conversation.findFirst.mockResolvedValueOnce(null)

        //request data
        const response = await request(app)
        .put('/api/listings/mark-sold/1')
        .expect(404)

        //check if return error
        expect(response.body.error).toBe("No conversation found")
    })

    it('returns a successful message as marking listing sold successfully', async () => {
        //set up mock data
        prisma.listing.findUnique.mockResolvedValueOnce({item_id: "1", seller_id: "1"})
        prisma.conversation.findFirst.mockResolvedValueOnce({listing_id: "1", seller_id: "1", buyer_id: "5"})

        //request data
        const response = await request(app)
        .put('/api/listings/mark-sold/1')
        .expect('Content-Type', /json/)
        .expect(200)

        //check if return message
        expect(response.body.message).toBe("Listing marked as sold")
    })
})

//unmark a listing from sold
describe('PUT /api/listings/unmark-sold/:listing_id', () => {
  
    it('returns 404 if listing is not found', async () => {
        //set up mock data
        prisma.listing.findUnique.mockResolvedValueOnce(null)

        //request data
        const response = await request(app)
        .put('/api/listings/unmark-sold/1')
        .expect(404)

        //check if return error
        expect(response.body.error).toBe("Listing not found")
    })

    it('returns 403 if unmarking not own item', async () => {
        //set up mock data
        prisma.listing.findUnique.mockResolvedValueOnce({item_id: "1", seller_id: "4"})

        //request data
        const response = await request(app)
        .put('/api/listings/unmark-sold/1')
        .expect(403)

        //check if return error
        expect(response.body.error).toBe("Forbidden")
    })

    it('returns a successful message as unmarking listing from sold successfully', async () => {
        //set up mock data
        prisma.listing.findUnique.mockResolvedValueOnce({item_id: "1", seller_id: "1"})

        //request data
        const response = await request(app)
        .put('/api/listings/unmark-sold/1')
        .expect('Content-Type', /json/)
        .expect(200)

        //check if return message
        expect(response.body.message).toBe("Listing unmarked as sold")
    })
})