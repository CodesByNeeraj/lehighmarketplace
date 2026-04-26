import { jest } from '@jest/globals'
import request from 'supertest'

// Mock database
jest.unstable_mockModule('../db/prisma.js', () => ({
  default: {
    waitlist: {
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

//sign up for waitlist
describe('POST /api/waitlist/save-to-waitlist', () => {
  it('returns message as signing up waitlist successfully', async () => {
    //set up mock data
    prisma.waitlist.create.mockResolvedValueOnce(null)

    //request data
    const response = await request(app)
      .post('/api/waitlist/save-to-waitlist')
      .send({email: 'test@lehigh.edu'})
      .expect('Content-Type', /json/)
      .expect(201)

    //check response if waitlisting successfully
    expect(response.body.message).toBe("Thanks! Keep a lookout for more updates.")
    //check as creating waitlist entry
    expect(prisma.waitlist.create).toHaveBeenCalledWith({data: {email: 'test@lehigh.edu'}})
  })

  it('returns message as signing up with an existing email', async () => {
    //set up mock prisma error
    const prismaError = new Error('Unique constraint failed')
    prismaError.code = 'P2002'
    prisma.waitlist.create.mockRejectedValueOnce(prismaError)

    //request data
    const response = await request(app)
      .post('/api/waitlist/save-to-waitlist')
      .send({email: 'test@lehigh.edu'})
      .expect(409)

    //check response if error is returned
    expect(response.body.error).toBe("Email already on waitlist")
  })
})