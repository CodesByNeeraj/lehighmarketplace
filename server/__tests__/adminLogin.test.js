import { jest } from '@jest/globals'
import request from 'supertest'

// Mock database
jest.unstable_mockModule('../db/prisma.js', () => ({
  default: {
    admin: {
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

const mockAdmin = {admin_id: "1", staff_email: 'testadmin@lehigh.edu', password_hash: 'realpassword'}

//verify admin login
describe('POST /api/admin/admin-login', () => {
  // Reset mocks between tests to prevent state leakage
  beforeEach(() => {
    jest.clearAllMocks()
  })


  it('returns a token for admin upon successful login', async () => {
    //set up mock data
    prisma.admin.findUnique.mockResolvedValue(mockAdmin)
    bcrypt.compare.mockResolvedValue(true)
    jwt.sign.mockReturnValue('mock_token')

    //request data
    const response = await request(app)
      .post('/api/admin/admin-login')
      .send({ email: 'testadmin@lehigh.edu', password: 'realpassword' })
      .expect('Content-Type', /json/)
      .expect(200)

    //check if return token
    expect(response.body.token).toBe('mock_token') 
    //check if return correct admin info
    expect(response.body.admin).toEqual({
        id: mockAdmin.admin_id,
        email: mockAdmin.staff_email,
        name: 'Admin',
        role: 'ADMIN',
    })
  })

  it('returns 404 if wrong admin email', async () => {
    prisma.admin.findUnique.mockResolvedValue(null)

    //request data
    const response = await request(app)
      .post('/api/admin/admin-login')
      .send({ email: 'badadmin@lehigh.edu', password: 'realpassword' })
      .expect(404)

    //check response if error is returned
    expect(response.body.error).toBe("Invalid email or password")
  })

  it('returns 401 if wrong admin password', async () => {
    prisma.admin.findUnique.mockResolvedValue(mockAdmin)
    bcrypt.compare.mockResolvedValue(false)

    //request data
    const response = await request(app)
      .post('/api/admin/admin-login')
      .send({ email: 'testadmin@lehigh.edu', password: 'notrealpassword' })
      .expect(401)

    //check response if error is returned
    expect(response.body.error).toBe("Invalid email or password")
  })
})