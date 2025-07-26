/** /twitter-clone-api
 * @openapi
 *
 * securityDefinitions:
 *   bearer:
 *     type: apiKey
 *     name: Authorization
 *     in: header
 *     description: Bearer token for user authentication.
 *
 * security:
 *   - bearer: []
 *
 * tags:
 *   - name: Login
 *     description: The login API for user authentication.
 *   - name: Users
 *     description: The users managing API
 *   - name: Posts
 *     description: The posts managing API
 *   - name: Messages
 *     description: The messages managing API
 *   - name: Chats
 *     description: The chats managing API
 *   - name: Notifications
 *     description: The notifications managing API
 *
 * components:
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: apiKey
 *       name: Authorization
 *       in: header
 *       description: Bearer token for API authentication.
 *
 *   schemas:
 *
 *     Unauthorized:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: 'Unauthorized'
 *       required:
 *         - message
 *
 *
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: '5f92cdce0cf217478ba93563'
 *           description: Unique identifier for the user.
 *         name:
 *           type: string
 *           example: 'John Doe'
 *         username:
 *           type: string
 *           example: 'john_doe'
 *         avatar:
 *           type: string
 *           format: uri
 *           example: 'https://example.com/avatar.jpg'
 *         coverPicture:
 *           type: string
 *           format: uri
 *           example: 'https://example.com/cover.jpg'
 *         bio:
 *           type: string
 *           example: 'This is a sample bio for the user.'
 *         website:
 *           type: string
 *           format: uri
 *           example: 'https://example.com'
 *         email:
 *           type: string
 *           format: email
 *           example: 'sE2bG@example.com'
 *         password:
 *           type: string
 *           format: password
 *           example: 'password123'
 *           description: Password for the user account.
 *         dateOfBirth:
 *           type: string
 *           format: date-time
 *           example: '1990-01-01T00:00:00Z'
 *         phone:
 *           type: string
 *           format: phone-number
 *           description: Phone number of the user.
 *           example: '+1234567890'
 *         location:
 *           type: string
 *           example: 'New York, USA'
 *         followers:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *             example: '5f92cdce0cf217478ba93563'
 *             $ref: '#/components/schemas/User'
 *             description: List of users following this user.
 *         following:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *             example: '5f92cdce0cf217478ba93563'
 *             $ref: '#/components/schemas/User'
 *             description: List of users this user is following.
 *         verified:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: '2023-10-01T12:00:00Z'
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: '2023-10-01T12:00:00Z'
 *       required:
 *         - id
 *         - name
 *         - username
 *         - email
 *         - password
 *         - dateOfBirth
 *         - phone
 *         - password
 *         - createdAt
 *         - updatedAt
 *
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: '5f92cdce0cf217478ba93563'
 *           description: Unique identifier for the post.
 *         content:
 *           type: string
 *           format: text
 *           example: 'This is a sample post content.'
 *         media:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 *             example: 'https://example.com/media.jpg'
 *         author:
 *           type: string
 *           format: uuid
 *           example: '5f92cdce0cf217478ba93563'
 *           description: User who posted this content.
 *         likedBy:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *             example: '5f92cdce0cf217478ba93563'
 *             description: List of users who liked this post.
 *         retweetedBy:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *             example: '5f92cdce0cf217478ba93563'
 *             description: List of users who retweeted this post.
 *         retweetData:
 *           type: string
 *           format: uuid
 *           example: '5f92cdce0cf217478ba93563'
 *           description: Data of the original post that was retweeted.
 *         replyTo:
 *           type: string
 *           format: uuid
 *           example: '5f92cdce0cf217478ba93563'
 *           description: The original post that this is replying to.
 *         pinned:
 *           type: boolean
 *           example: true
 *           description: Indicates if the post is pinned to the user's profile.
 *         hashtags:
 *           type: array
 *           items:
 *             type: string
 *             example: '#hashtag1'
 *             description: List of hashtags used in the post.
 *         mentions:
 *           type: array
 *           items:
 *             type: string
 *             example: '@username'
 *             description: List of users mentioned in the post.
 *         visibility:
 *           type: string
 *           enum: [public, followers, private]
 *           example: 'public'
 *           description: Visibility of the post.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: '2023-10-01T12:00:00Z'
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: '2023-10-01T12:00:00Z'
 *       required:
 *         - id
 *         - content
 *         - author
 *         - createdAt
 *         - updatedAt
 *
 *     Message:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: '5f92cdce0cf217478ba93563'
 *           description: Unique identifier for the message.
 *         content:
 *           type: string
 *           example: 'Hello, how are you?'
 *           description: Content of the message.
 *         sender:
 *           $ref: '#/components/schemas/User'
 *           description: User who sent the message.
 *         readBy:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *             description: List of users who read the message.
 *         replyTo:
 *           type: array
 *           items:
 *            type: string
 *            format: uuid
 *            example: '5f92cdce0cf217478ba93563'
 *            description: List of replies to the message.
 *         attachments:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 *             example: 'https://example.com/attachment.jpg'
 *             description: List of attachments associated with the message.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: '2023-10-01T12:00:00Z'
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: '2023-10-01T12:00:00Z'
 *       required:
 *         - id
 *         - content
 *         - sender
 *         - createdAt
 *         - updatedAt
 *
 *     Chat:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: '5f92cdce0cf217478ba93563'
 *           description: Unique identifier for the chat.
 *         chatName:
 *           type: string
 *           example: 'Chat with John Doe'
 *           description: Name of the chat.
 *         isGroupChat:
 *           type: boolean
 *           example: false
 *           description: Indicates if the chat is a group chat.
 *         createdBy:
 *           $ref: '#/components/schemas/User'
 *           description: User who created the chat.
 *         groupMembers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *             description: List of users participating in the chat.
 *         groupImage:
 *           type: string
 *           format: uri
 *           example: 'https://example.com/group-image.jpg'
 *         latestMessage:
 *           $ref: '#/components/schemas/Message'
 *           description: The latest message in the chat.
 *         admin:
 *           $ref: '#/components/schemas/User'
 *           description: The admin of the chat.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: '2023-10-01T12:00:00Z'
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: '2023-10-01T12:00:00Z'
 *       required:
 *         - id
 *         - messages
 *         - chatName
 *         - admin
 *         - isGroupChat
 *         - groupMembers
 *         - createdBy
 *         - createdAt
 *         - updatedAt
 *
 *     Notification:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: '5f92cdce0cf217478ba93563'
 *           description: Unique identifier for the notification.
 *         userFrom:
 *           $ref: '#/components/schemas/User'
 *           description: User who received the notification.
 *         userTo:
 *           $ref: '#/components/schemas/User'
 *           description: User who triggered the notification.
 *         type:
 *           type: enum
 *           example: 'follow'
 *           description: Type of notification (e.g., follow, like, comment).
 *         targetId:
 *           type: string
 *           format: uuid
 *           example: '5f92cdce0cf217478ba93563'
 *           description: Unique identifier for the target resource (e.g., post, comment).
 *         text:
 *           type: string
 *           format: enum
 *           example: 'John Doe started following you.'
 *           description: Content of the notification.
 *         opened:
 *           type: boolean
 *           example: false
 *           description: Indicates if the notification has been opened.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: '2023-10-01T12:00:00Z'
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: '2023-10-01T12:00:00Z'
 *       required:
 *         - id
 *         - userFrom
 *         - userTo
 *         - isRead
 *         - type
 *         - content
 *         - createdAt
 *         - updatedAt
 *
 *     Reply:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: '5f92cdce0cf217478ba93563'
 *           description: Unique identifier for the reply.
 *         content:
 *           type: string
 *           example: 'This is a sample reply.'
 *           description: Content of the reply.
 *         author:
 *           type: string
 *           format: uuid
 *           example: '5f92cdce0cf217478ba93563'
 *           description: User who wrote the reply.
 *         timestamp:
 *           type: string
 *           format: date-time
 *           example: '2023-10-01T12:00:00Z'
 *           description: Timestamp when the reply was created.
 *         likes:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *             example: '5f92cdce0cf217478ba93563'
 *             description: List of users who liked the reply.
 *         media:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 *             example: 'https://example.com/media.jpg'
 *             description: List of media files associated with the reply.
 *         parentTweetId:
 *           type: string
 *           format: uuid
 *           example: '5f92cdce0cf217478ba93563'
 *           description: Unique identifier for the parent tweet.
 *         parentReplyId:
 *           type: string
 *           format: uuid
 *           example: '5f92cdce0cf217478ba93563'
 *           description: Unique identifier for the parent reply.
 */
