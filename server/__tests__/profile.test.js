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
    studentProfile: {
      findUnique: jest.fn(),
      update: jest.fn()
    }
  }
}))

// import app after mocking all data
const { default: prisma } = await import('../db/prisma.js')
const { default: app } = await import('../index.js')

const mockProfile = {studentId: "1", display_name: "Student", gender: "male", age: 20}

//get profile details
describe('GET /api/profile/get-profile', () => {
  // Reset mocks between tests to prevent state leakage
  beforeEach(() => {
    jest.clearAllMocks()
  })
  
  it('returns 404 as the profile is not found', async () => {
    //set up mock data
    prisma.studentProfile.findUnique.mockResolvedValueOnce(null)

    //request data
    const response = await request(app)
      .get('/api/profile/get-profile')
      .expect(404)

    //check response if error is returned
    expect(response.body.error).toBe("Profile not found")
  })

  it('returns the current student profile', async () => {
    //set up mock data
    prisma.studentProfile.findUnique.mockResolvedValueOnce(mockProfile)

    //request data
    const response = await request(app)
      .get('/api/profile/get-profile')
      .expect('Content-Type', /json/)
      .expect(200)

    //check the return response
    expect(response.body).toEqual(mockProfile)
  })
})

//get profile details based on their student id
describe('GET /api/profile/view-profile/:studentId', () => {
  // Reset mocks between tests to prevent state leakage
  beforeEach(() => {
    jest.clearAllMocks()
  })
  
  it('returns 404 as the profile is not found', async () => {
    //set up mock data
    prisma.studentProfile.findUnique.mockResolvedValueOnce(null)

    //request data
    const response = await request(app)
      .get('/api/profile/view-profile/3')
      .expect(404)

    //check response if error is returned
    expect(response.body.error).toBe("Profile not found")
  })
  
  it('returns the public profile as user wants to view', async () => {
    //set up mock data
    prisma.studentProfile.findUnique.mockResolvedValueOnce({studentId: "3", display_name: "New Student", gender: "female", age: 21})

    //request data
    const response = await request(app)
      .get('/api/profile/view-profile/3')
      .expect('Content-Type', /json/)
      .expect(200)

    //check the return response
    expect(response.body).toEqual({studentId: "3", display_name: "New Student", gender: "female", age: 21})
  })
})

//update profile details
describe('GET /api/profile/update-profile', () => {
  // Reset mocks between tests to prevent state leakage
  beforeEach(() => {
    jest.clearAllMocks()
  })
  
  it('returns 404 as the profile is not found', async () => {
    //set up mock data
    prisma.studentProfile.findUnique.mockResolvedValueOnce(null)

    //request data
    const response = await request(app)
      .put('/api/profile/update-profile')
      .send({ bio: "this is a new bio", age: "22" })
      .expect(404)

    //check response if error is returned
    expect(response.body.error).toBe("Profile not found")
  })

  it('returns a message that student profile is updated successfully', async () => {
    //set up mock data
    prisma.studentProfile.findUnique.mockResolvedValueOnce(mockProfile)

    //request data
    const response = await request(app)
      .put('/api/profile/update-profile')
      .send({ bio: "this is a new bio", age: "22" })
      .expect('Content-Type', /json/)
      .expect(200)

    //check the return response
    expect(response.body.message).toBe("Profile updated successfully")
  })
})