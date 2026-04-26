import { jest } from '@jest/globals'
import request from 'supertest'

// Mock database
jest.unstable_mockModule('../db/prisma.js', () => ({
  default: {
    student: {
      findUnique: jest.fn()
    }
  }
}))

// Mock bcrypt 
jest.unstable_mockModule('bcryptjs', () => ({
  default: {
    compare: jest.fn()
  }
}))

// Mock JWT
jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    sign: jest.fn(),
    verify: jest.fn()
  }
}))

// import app after mocking all data
const { default: prisma } = await import('../db/prisma.js')
const { default: bcrypt } = await import ('bcryptjs')
const { default: jwt } = await import ('jsonwebtoken')
const { default: app } = await import('../index.js')

// global reset mocks to avoid leaking
beforeEach(() => {
  jest.resetAllMocks()
})

const mockStudent = {student_id: "1", email: 'test@lehigh.edu', password_hash: 'realpassword', profile: {display_name: 'Student'}}

//verify admin login
describe('POST /api/auth/login', () => {

  it('returns a token for student upon successful login', async () => {
    //set up mock data
    prisma.student.findUnique.mockResolvedValue(mockStudent)
    bcrypt.compare.mockResolvedValue(true)
    jwt.sign.mockReturnValue('mock_token')

    //request data
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@lehigh.edu', password: 'realpassword' })
      .expect('Content-Type', /json/)
      .expect(200)

    //check if return token
    expect(response.body.token).toBe('mock_token') 
    //check if return correct admin info
    expect(response.body.student).toEqual({
        id: mockStudent.student_id,
        email: mockStudent.email,
        name: mockStudent.profile.display_name,
        role: 'STUDENT',
    })
  })

  it('returns 401 if enter the wrong password', async () => {
    prisma.student.findUnique.mockResolvedValue(mockStudent)
    bcrypt.compare.mockResolvedValue(false)

    //request data
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@lehigh.edu', password: 'notrealpassword' })
      .expect(401)

    //check response if error is returned
    expect(response.body.error).toBe("Invalid email or password")
  })
})