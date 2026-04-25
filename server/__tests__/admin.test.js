import { jest } from '@jest/globals'
import request from 'supertest'

// Mock token for admin
jest.unstable_mockModule('../middleware/auth.js', () => ({
  default: (req, res, next) => {
    req.user = { admin_id: "1", email: 'testadmin@lehigh.edu', role: 'ADMIN'}
    next()
  }
}))

// Mock database
jest.unstable_mockModule('../db/prisma.js', () => ({
  default: {
    listing: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn()
    },
    admin: {
      findUnique: jest.fn()
    }
  }
}))

// import app after mocking all data
const { default: prisma } = await import('../db/prisma.js')
const { default: app } = await import('../index.js')


//delete a listing if the user is admin
describe('DELETE /api/admin/delete-listing/:item_id', () => {
  // Reset mocks between tests to prevent state leakage
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns delete message if deleted successfully', async () => {
    //set up mock data
    prisma.listing.findUnique.mockResolvedValueOnce(
      {item_id : "1", is_deleted: false, deleted_at: null})

    //request data
    const response = await request(app)
      .delete('/api/admin/delete-listing/1')
      .expect('Content-Type', /json/)
      .expect(200)

    //check response if successful message is returned
    expect(response.body.message).toBe("Listing successfully deleted!")
  })

  it('returns 404 as item is not found', async () => {
    //set up mock data
    prisma.listing.findUnique.mockResolvedValueOnce(null)
    //request data
    const response = await request(app)
      .delete('/api/admin/delete-listing/5')
      .expect(404)

    //check response if error is returned
    expect(response.body.error).toBe("Listing not found")
  })
})

//get deleted listings
describe('GET /api/admin/get-deleted-listings', () => {
  // Reset mocks between tests to prevent state leakage
  beforeEach(() => {
    jest.clearAllMocks()
  })
  
  it('returns a list of items deleted by admin', async () => {
    //set up mock data
    prisma.listing.findMany.mockResolvedValueOnce([
      {item_id: "10", is_deleted: true, deleted_at: '2026-02-01T00:00:00.000Z'},
      {item_id: "11", is_deleted: true, deleted_at: '2026-02-02T00:00:00.000Z'}, 
      {item_id: "12", is_deleted: true, deleted_at: '2026-02-03T00:00:00.000Z'}
    ])

    //request data
    const response = await request(app)
      .get('/api/admin/get-deleted-listings')
      .expect('Content-Type', /json/)
      .expect(200)

    //check if return array
    expect(Array.isArray(response.body)).toBe(true)
    //check if the array length is 3
    expect(response.body.length).toBe(3)
    //check if mock is called correctly
    expect(prisma.listing.findMany).toHaveBeenCalledWith(
      {where:{is_deleted:true}, orderBy:{deleted_at:'desc'}}
    )
  })
})