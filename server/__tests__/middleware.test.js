import { jest } from '@jest/globals'
import request from 'supertest'

// Mock JWT
jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    verify: jest.fn()
  }
}))

const { default: jwt } = await import ('jsonwebtoken')
const { default: authenticate } = await import ('../middleware/auth')
const { default: isAdmin } = await import ('../middleware/isadmin')

//Reference: https://oneuptime.com/blog/post/2026-02-02-express-jest-testing/view
//check generating tokens
describe('tests on JWT', () => {
  let mockReq
  let mockRes
  let nextFn

  beforeEach(() => {
    // reset mocks for each test
    mockReq = {
      headers: {}
    }
    mockRes = {
      status: jest.fn().mockReturnThis(),  // allow chaining
      json: jest.fn()
    }
    nextFn = jest.fn()
  })

  it('calls next() with valid token', () => {
    const userData = { id: 1, email: 'test@lehigh.edu' }
    mockReq.headers.authorization = 'Bearer valid-token'
    jwt.verify.mockReturnValue(userData)

    authenticate(mockReq, mockRes, nextFn)

    expect(jwt.verify).toHaveBeenCalledWith('valid-token', process.env.JWT_SECRET)
    expect(mockReq.user).toEqual(userData)
    expect(nextFn).toHaveBeenCalled()
  })

  it('returns 401 when no token is provided', () => {
    authenticate(mockReq, mockRes, nextFn)

    expect(mockRes.status).toHaveBeenCalledWith(401)
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'No token provided' })
    expect(nextFn).not.toHaveBeenCalled()
  })

  it('returns 401 for invalid token', () => {
    mockReq.headers.authorization = 'Bearer invalid-token'
    jwt.verify.mockImplementation(() => {
      throw new Error('Malformed JWT')
    })

    authenticate(mockReq, mockRes, nextFn)

    expect(mockRes.status).toHaveBeenCalledWith(401)
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid token' })
  })
})

//check authorized admin
describe('tests on ADMIN role', () => {
  let mockReq
  let mockRes
  let nextFn

  beforeEach(() => {
    // reset mocks for each test
    mockReq = {
      user: {}
    }
    mockRes = {
      status: jest.fn().mockReturnThis(),  // allow chaining
      json: jest.fn()
    }
    nextFn = jest.fn()
  })

  it('calls next() if valid admin', () => {
    mockReq.user.role = 'ADMIN'

    isAdmin(mockReq, mockRes, nextFn)

    expect(nextFn).toHaveBeenCalled()
  })

  it('returns 403 for unauthorized access', () => {
    mockReq.user.role = 'STUDENT'
    isAdmin(mockReq, mockRes, nextFn)

    expect(mockRes.status).toHaveBeenCalledWith(403)
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Access denied. Admin only.' })
    expect(nextFn).not.toHaveBeenCalled()
  })
})