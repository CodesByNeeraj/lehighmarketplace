import { jest } from '@jest/globals'
import request from 'supertest'

// Mock database
jest.unstable_mockModule('../db/prisma.js', () => ({
  default: {
    student: {
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn()
    },
    verificationCode: {
        findFirst: jest.fn(),
        deleteMany: jest.fn(),
        create: jest.fn()
    }
  }
}))

// Mock bcrypt 
jest.unstable_mockModule('bcryptjs', () => ({
  default: {
    hash: jest.fn()
  },
  hash: jest.fn()
}))

// Mock JWT
jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    sign: jest.fn()
  },
  sign: jest.fn()
}))

jest.unstable_mockModule('../services/nodemailer.js', () => ({
  sendPasswordResetEmail: jest.fn(),
  sendVerificationEmail: jest.fn()
}))

// import app after mocking all data
const { default: prisma } = await import('../db/prisma.js')
const { default: bcrypt } = await import ('bcryptjs')
const { default: jwt } = await import ('jsonwebtoken')
const { sendPasswordResetEmail, sendVerificationEmail } = await import ('../services/nodemailer.js')
const { default: app } = await import('../index.js')

// global reset mocks to avoid leaking
beforeEach(() => {
  jest.resetAllMocks()
})

//verify lehigh student and send verification email
describe('POST /api/auth/send-code', () => {

  it('returns 400 as the email is not from lehigh', async () => {
    //request data
    const response = await request(app)
      .post('/api/auth/send-code')
      .send({email: 'test@email.com'})
      .expect(400)

    //check if return error
    expect(response.body.error).toBe("Only lehigh university student emails are allowed!")
  })

  it('returns 409 as email already registered', async () => {
    //set up mock data
    prisma.student.findUnique.mockResolvedValueOnce({email: 'test@lehigh.edu'})
    
    //request data
    const response = await request(app)
      .post('/api/auth/send-code')
      .send({email: 'test@lehigh.edu'})
      .expect(409)

    //check if return error
    expect(response.body.error).toBe("Email already registered")
  })
  
  it('returns successful message as verification code sent', async () => {
    //set up mock data
    prisma.student.findUnique.mockResolvedValueOnce(null)
    //request data
    const response = await request(app)
      .post('/api/auth/send-code')
      .send({email: 'test@lehigh.edu'})
      .expect('Content-Type', /json/)
      .expect(200)

    //check if return successful message
    expect(response.body.message).toBe("Verification code sent")
  })
})

//register lehigh student
describe('POST /api/auth/register', () => {
    const mockStudent = {name: "Student", email: "test@lehigh.edu", password: "password123", code: "111"}

    it('returns 400 as the verification code does not exist', async () => {
        //set up mock data
        prisma.verificationCode.findFirst.mockResolvedValueOnce(null)

        //request data
        const response = await request(app)
        .post('/api/auth/register')
        .send(mockStudent)
        .expect(400)

        //check if return error
        expect(response.body.error).toBe("Invalid verification code")
    })

    it('returns 400 as the verification code has expired', async () => {
        //set up mock data
        prisma.verificationCode.findFirst.mockResolvedValueOnce({email: mockStudent.email, code: mockStudent.code, type: "STUDENT_EMAIL_VERIFY", expiresAt: new Date('2025-02-01T00:00:00.000Z')})

        //request data
        const response = await request(app)
        .post('/api/auth/register')
        .send(mockStudent)
        .expect(400)

        //check if return error
        expect(response.body.error).toBe("Verification code expired!")
    })
  
    it('returns token as student successfully registered', async () => {
        //set up mock data
        prisma.verificationCode.findFirst.mockResolvedValueOnce({email: mockStudent.email, code: mockStudent.code, type: "STUDENT_EMAIL_VERIFY", expiresAt: new Date('2026-05-01T00:00:00.000Z')})
        prisma.student.create.mockResolvedValue({email: mockStudent.email, password_hash: "hashed_password", profile: {display_name: 'Student'}})
        jwt.sign.mockReturnValue('mock_token')

        //request data
        const response = await request(app)
            .post('/api/auth/register')
            .send(mockStudent)
            .expect('Content-Type', /json/)
            .expect(200)

        //check if return token
        expect(response.body.token).toBe('mock_token') 
        //check if return correct student info
        expect(response.body.student.email).toEqual(mockStudent.email)
        expect(response.body.student.role).toEqual("STUDENT")
    })
})

//verify lehigh student and send reset code
describe('POST /api/auth/send-reset-code', () => {

  it('returns 400 as the email is not from lehigh', async () => {
    //request data
    const response = await request(app)
      .post('/api/auth/send-reset-code')
      .send({email: 'test@email.com'})
      .expect(400)

    //check if return error
    expect(response.body.error).toBe("Only Lehigh University email addresses are allowed")
  })

  it('returns 404 as account has not been registered', async () => {
    //set up mock data
    prisma.student.findUnique.mockResolvedValueOnce(null)
    //request data
    const response = await request(app)
      .post('/api/auth/send-reset-code')
      .send({email: 'test@lehigh.edu'})
      .expect(404)

    //check if return error
    expect(response.body.error).toBe("No account found with this email")
  })
  
  it('returns successful message as verification code sent', async () => {
    //set up mock data
    prisma.student.findUnique.mockResolvedValueOnce({email: 'test@lehigh.edu'})
    //request data
    const response = await request(app)
      .post('/api/auth/send-reset-code')
      .send({email: 'test@lehigh.edu'})
      .expect('Content-Type', /json/)
      .expect(200)

    //check if return successful message
    expect(response.body.message).toBe("Reset code sent")
  })
})