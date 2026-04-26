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
      findUnique: jest.fn()
    }, 
    conversation: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn()
    },
    message: {
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

//send a message
describe('POST /api/messages/send-message/:listing_id', () => {

  it('returns 400 if message text is empty', async () => {
    //set up mock data
    prisma.listing.findUnique.mockResolvedValueOnce({item_id: "1"})

    //request data
    const response = await request(app)
      .post('/api/messages/send-message/1')
      .send({})
      .expect(400)

    //check response if error is returned
    expect(response.body.error).toBe("Message text is required")
  })
  
  it('returns 404 if a listing is not found', async () => {
    //set up mock data
    prisma.listing.findUnique.mockResolvedValueOnce(null)

    //request data
    const response = await request(app)
      .post('/api/messages/send-message/2')
      .send({message_text: 'I want to buy this'})
      .expect(404)

    //check response if error is returned
    expect(response.body.error).toBe("Listing not found")
  })

  const mockListing = {item_id: "1", seller_id: "2"}
  const mockConversation = {conversation_id: "1", listing_id: "1", buyer_id: "1", seller_id: "2"}
  const mockMessage = {message_id: "1", conversation_id: "1", sender_id: "2", message_text: "Are you selling this" }

  it('returns message as sent successfully (existing conversation)', async () => {
    //set up mock data
    prisma.listing.findUnique.mockResolvedValueOnce(mockListing)
    prisma.conversation.findFirst.mockResolvedValueOnce(mockConversation)
    prisma.message.create.mockResolvedValueOnce(mockMessage)

    //request data
    const response = await request(app)
      .post('/api/messages/send-message/1')
      .send({message_text: "Are you selling this"})
      .expect('Content-Type', /json/)
      .expect(201)

    //check response if message is sent properly
    expect(response.body.message_text).toBe("Are you selling this")
    //check as creating convo should not be called
    expect(prisma.conversation.create).not.toHaveBeenCalled()
  })

  it('returns message as sent successfully (nonexisting conversation)', async () => {
    //set up mock data
    prisma.listing.findUnique.mockResolvedValueOnce(mockListing)
    prisma.conversation.findFirst.mockResolvedValueOnce(null) //nonexisting convo
    prisma.conversation.create.mockResolvedValueOnce(mockConversation)
    prisma.message.create.mockResolvedValueOnce(mockMessage)

    //request data
    const response = await request(app)
      .post('/api/messages/send-message/1')
      .send({message_text: "Are you selling this"})
      .expect('Content-Type', /json/)
      .expect(201)

    //check response if message is sent properly
    expect(response.body.message_text).toBe("Are you selling this")
    //check as creating convo is called
    expect(prisma.conversation.create).toHaveBeenCalledWith({data: {listing_id: "1", buyer_id: "1", seller_id: "2"}})
  })
})

//get conversation for a listing
describe('GET /api/messages/get-messages/:listing_id', () => {
  
  it('returns 404 if a listing is not found', async () => {
    //set up mock data
    prisma.listing.findUnique.mockResolvedValueOnce(null)

    //request data
    const response = await request(app)
      .get('/api/messages/get-messages/1')
      .expect(404)

    //check response if error is returned
    expect(response.body.error).toBe("Listing not found")
  })

  const mockListing = {item_id: "1", seller_id: "1"}
  const mockConversation = {conversation_id: "1", listing_id: "1", buyer_id: "1", seller_id: "1", 
    messages: [{message_id: "1", message_text: 'I want to buy this'}, {message_id: "2", message_text: "Yes"}]}

  it('returns conversation as it is found', async () => {
    //set up mock data
    prisma.listing.findUnique.mockResolvedValueOnce(mockListing)
    prisma.conversation.findFirst.mockResolvedValueOnce(mockConversation)

    //request data
    const response = await request(app)
      .get('/api/messages/get-messages/1')
      .expect('Content-Type', /json/)
      .expect(200)

    //check response when convo is found
    expect(response.body.conversation_id).toBe("1")
    expect(Array.isArray(response.body.messages)).toBe(true)
    expect(response.body.messages.length).toEqual(2)
  })

  it('returns 404 if a conversation is not found', async () => {
    //set up mock data
    prisma.listing.findUnique.mockResolvedValueOnce(mockListing)
    prisma.conversation.findFirst.mockResolvedValueOnce(null)

    //request data
    const response = await request(app)
      .get('/api/messages/get-messages/1')
      .expect(404)

    //check response if error is returned
    expect(response.body.error).toBe("No conversation found for this listing")
  })
})

//get all conversations for the current user
describe('GET /api/messages/get-conversations', () => {

  const mockConversations = [
    {conversation_id: "1", listing_id: "1", buyer_id: "1", seller_id: "1", 
    messages: [{message_id: "1", message_text: 'I want to buy this'}, {message_id: "2", message_text: "Yes"}]},
    {conversation_id: "2", listing_id: "2", buyer_id: "2", seller_id: "1", 
    messages: [{message_id: "3", message_text: 'I want to buy this'}, {message_id: "4", message_text: "Yes"}]},
    {conversation_id: "3", listing_id: "3", buyer_id: "1", seller_id: "4", 
    messages: [{message_id: "5", message_text: 'I want to buy this'}, {message_id: "6", message_text: "No"}]}
    ]

  it('returns all conversations found', async () => {
    //set up mock data
    prisma.conversation.findMany.mockResolvedValueOnce(mockConversations)

    //request data
    const response = await request(app)
      .get('/api/messages/get-conversations')
      .expect('Content-Type', /json/)
      .expect(200)

    //check response when convo is found
    expect(response.body[0].conversation_id).toBe("1")
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.length).toEqual(3)
  })
})