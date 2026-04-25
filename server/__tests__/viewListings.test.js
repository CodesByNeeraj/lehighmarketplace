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
      findMany: jest.fn(),
      findUnique: jest.fn()
    },
    savedListing: {
      findMany: jest.fn()
    }
  }
}))

// import app after mocking all data
const { default: prisma } = await import('../db/prisma.js')
const { default: app } = await import('../index.js')

//get all listings (shown in homepage)
describe('GET /api/listings/get-listings', () => {
  // Reset mocks between tests to prevent state leakage
  beforeEach(() => {
    jest.clearAllMocks()
  })
  
  it('returns a list of items when authenticated', async () => {
    //set up mock data
    prisma.listing.findMany.mockResolvedValueOnce([
      { item_id: "1", title: 'Item A'},
      { item_id: "2", title: 'Item B'},
      { item_id: "3", title: 'Item C'},
      { item_id: "4", title: 'Item D'}
    ])

    //request data
    const response = await request(app)
      .get('/api/listings/get-listings')
      .expect('Content-Type', /json/)
      .expect(200)

    //check if return array
    expect(Array.isArray(response.body)).toBe(true)
  })
})

//get own listings
describe('GET /api/listings/get-own-listings', () => {
  // Reset mocks between tests to prevent state leakage
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns a list of items posted by the authenticated user', async () => {
    //set up mock data
    prisma.listing.findMany.mockResolvedValueOnce([
      {item_id : "1", seller_id: "1", is_deleted: false},
      {item_id: "2", seller_id: "1", is_deleted: false}
    ])

    //request data
    const response = await request(app)
      .get('/api/listings/get-own-listings')
      .expect('Content-Type', /json/)
      .expect(200)

    //check if return array
    expect(Array.isArray(response.body)).toBe(true)
    //check length res should be two
    expect(response.body.length).toBe(2)
    //check if mock is called correctly
    expect(prisma.listing.findMany).toHaveBeenCalledWith(
      {where: {seller_id: "1", is_deleted: false}}
    )
  })
})

//get saved listings
describe('GET /api/listings/get-saved-listings', () => {
  // Reset mocks between tests to prevent state leakage
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns a list of items saved by the authenticated user', async () => {
    //set up mock data
    prisma.savedListing.findMany.mockResolvedValueOnce([
      {student_id: "1", listing:{item_id: "11", title: 'Item G'}},
      {student_id: "1", listing:{item_id: "12", title: 'Item H'}}
    ])

    //request data
    const response = await request(app)
      .get('/api/listings/get-saved-listings')
      .expect('Content-Type', /json/)
      .expect(200)

    //check if return array
    expect(Array.isArray(response.body)).toBe(true)
    //check if the first item returned is correct (it only returns an array of listings)
    expect(response.body[0]).toEqual({item_id: "11", title: 'Item G'})
    //check if mock is called correctly
    expect(prisma.savedListing.findMany).toHaveBeenCalledWith(
      {where:{student_id:"1"},include:{listing:true}}
    )
  })
})

//view a particular listing
describe('GET /api/listings/view-listing/:item_id', () => {
  // Reset mocks between tests to prevent state leakage
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns an item as the user wants to view', async () => {
    //set up mock data
    prisma.listing.findUnique.mockResolvedValueOnce(
      {item_id : "14", seller:{email: 'seller@lehigh.edu', profile:{display_name: 'Seller'}}})

    //request data
    const response = await request(app)
      .get('/api/listings/view-listing/14')
      .expect('Content-Type', /json/)
      .expect(200)

    //check response if correct
    expect(response.body).toEqual({item_id : "14", seller:{email: 'seller@lehigh.edu', profile:{display_name: 'Seller'}}})
    //check if mock is called correctly
    expect(prisma.listing.findUnique).toHaveBeenCalledWith({
      where: {item_id : "14"}, 
      include:{seller:{select:{email:true, profile:{select:{display_name:true}}}}}}
    )
  })

  it('returns 404 as item is not found', async () => {
    //set up mock data
    prisma.listing.findUnique.mockResolvedValueOnce(null)
    //request data
    const response = await request(app)
      .get('/api/listings/view-listing/20')
      .expect(404)

    //check response if error is returned
    expect(response.body.error).toBe("Listing not found")
  })
})

//get purchased listings
describe('GET /api/listings/get-purchased', () => {
  // Reset mocks between tests to prevent state leakage
  beforeEach(() => {
    jest.clearAllMocks()
  })
  
  it('returns a list of items purchased by the authenticated user', async () => {
    //set up mock data
    prisma.listing.findMany.mockResolvedValueOnce([
      {item_id: "21", buyer_id: "1", is_sold: true},
      {item_id: "22", buyer_id: "1", is_sold: true}
    ])

    //request data
    const response = await request(app)
      .get('/api/listings/get-purchased')
      .expect('Content-Type', /json/)
      .expect(200)

    //check if return array
    expect(Array.isArray(response.body)).toBe(true)
    //check if the array length is 2
    expect(response.body.length).toBe(2)
    //check if mock is called correctly
    expect(prisma.listing.findMany).toHaveBeenCalledWith(
      {where: {buyer_id: "1", is_sold: true}}
    )
  })
})