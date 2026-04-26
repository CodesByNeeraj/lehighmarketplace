import { jest } from '@jest/globals'
import request from 'supertest'

// Mock database
jest.unstable_mockModule('../db/prisma.js', () => ({
  default: {
    student: {
      findFirst: jest.fn(),
      update: jest.fn()
    },
    verificationCode: {
        findFirst:jest.fn(),
        deleteMany: jest.fn()
    }
  }
}))

// Mock bcrypt 
jest.unstable_mockModule('bcryptjs', () => ({
  default: {
    hash: jest.fn()
  }
}))

// import app after mocking all data
const { default: prisma } = await import('../db/prisma.js')
const { default: bcrypt } = await import ('bcryptjs')
const { default: app } = await import('../index.js')

// global reset mocks to avoid leaking
beforeEach(() => {
  jest.resetAllMocks()
})

const mockEmail = {email_add: 'test@lehigh.edu', otp: '321', new_password: 'newpassword123'}

//update password when user clicks forget password
describe('PUT /api/auth/update-password', () => {

  it('returns 400 as this email does not exist', async () => {
    //set up mock data
    prisma.student.findFirst.mockResolvedValueOnce(null)

    //request data
    const response = await request(app)
      .put('/api/auth/update-password')
      .send(mockEmail)
      .expect(400)

    //check if return error
    expect(response.body.error).toBe("No such account with this email exists")
  })

  it('returns 400 as the verification code does not exist', async () => {
    //set up mock data
    prisma.student.findFirst.mockResolvedValueOnce(mockEmail)
    prisma.verificationCode.findFirst.mockResolvedValueOnce(null)

    //request data
    const response = await request(app)
      .put('/api/auth/update-password')
      .send(mockEmail)
      .expect(400)

    //check if return error
    expect(response.body.error).toBe("Invalid verification code")
  })

  it('returns 400 as the verification code has expired', async () => {
    //set up mock data
    prisma.student.findFirst.mockResolvedValueOnce(mockEmail)
    prisma.verificationCode.findFirst.mockResolvedValueOnce({email: mockEmail.email_add, code: mockEmail.otp, type: "PASSWORD_RESET", expiresAt: new Date('2025-02-01T00:00:00.000Z')})

    //request data
    const response = await request(app)
      .put('/api/auth/update-password')
      .send(mockEmail)
      .expect(400)

    //check if return error
    expect(response.body.error).toBe("Verification code expired")
  })
  
  it('returns updated password message as password updated successfully', async () => {
    //set up mock data
    prisma.student.findFirst.mockResolvedValueOnce(mockEmail)
    prisma.verificationCode.findFirst.mockResolvedValueOnce({email: mockEmail.email_add, code: mockEmail.otp, type: "PASSWORD_RESET", expiresAt: new Date('2026-05-01T00:00:00.000Z')})

    //request data
    const response = await request(app)
      .put('/api/auth/update-password')
      .send(mockEmail)
      .expect('Content-Type', /json/)
      .expect(200)

    //check if return successful message
    expect(response.body.message).toBe("Password updated successfully")
  })
})