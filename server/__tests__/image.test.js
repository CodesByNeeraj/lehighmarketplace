import { jest } from '@jest/globals'
import request from 'supertest'

// Mock token 
jest.unstable_mockModule('../middleware/auth.js', () => ({
  default: (req, res, next) => {
    req.user = { id: "1", email: 'test@lehigh.edu', role: 'STUDENT' }
    next()
  }
}))

jest.unstable_mockModule('../services/cloudinary.js', () => ({
  default: {
    uploader: {
      upload_stream: jest.fn()
    }
  },
  v2: {
    uploader: {
      upload_stream: jest.fn()
    }
  }
}))


// import app after mocking all data
const { default: cloudinary } = await import('../services/cloudinary.js')
const { default: app } = await import('../index.js')

// global reset mocks to avoid leaking
beforeEach(() => {
  jest.resetAllMocks()
})

//upload an image
describe('POST /api/upload/upload-image', () => {
  it('returns 400 if no image is provided', async () => {
    //request data
    const response = await request(app)
      .post('/api/upload/upload-image')
      .expect(400)

    //check response if error is returned
    expect(response.body.error).toBe("No image provided")
  })

  // Asking suggestions from Claude Sonnet 4.6 for these tests
  it('returns image_url as successful upload', async () => {
    cloudinary.uploader.upload_stream.mockImplementation((_options, callback) => {
      callback(null, { secure_url: 'https://cloudinary.com/test-image.jpg' })
      return { end: jest.fn() }
    })
    
    //request data
    const response = await request(app)
      .post('/api/upload/upload-image')
      .attach('image', Buffer.from('image data'), 'test.jpg')
      .expect('Content-Type', /json/)
      .expect(200)

    expect(response.body.image_url).toBe('https://cloudinary.com/test-image.jpg')
  })

  it('returns 500 if file is not an image', async () => {
    const response = await request(app)
      .post('/api/upload/upload-image')
      .attach('image', Buffer.from('pdf data'), 'test.pdf')
      .expect(500)
  })
  //no assert since image returns multer error
})