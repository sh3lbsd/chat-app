# Chat App
This is a chat application that is built using Firebase Realtime Database, Next.js, and Server Sent Events (SSE). There is no sign in required, simply enter your name to chat. 

# Data Storage
A unique user ID is created and stored in your browser. If you use a different browser or device, or clear your cache then all of your own data will be gone. No persistent user storage, all data is stored in the browser locally. 

https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage


# Server Sent Events
We use the built in API route structure, provided by Next.js, to build an API route that streams data in real time to the client.
The chat streaming API is located in: `pages/api/chat/index.js`

https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events

# Server Sent Events vs. Web-sockets

## Pros
Server Sent Events are much simplier to set up without using a library as well as it is easier to ensure that the application works in managed cloud environments, such as Google Cloud Run, where this application is deployed.

## Cons
- Unilateral communication.(The data is only sent one way. From the Server to the client)
  - Websockets are bi-directional. (Both can communicate with eachother)
- No Internet Explorer(IE) support. 
- Max of 6 client connections from a single host.

# Real Time Database
The client can communicate with the server by sending messages to Real Time Database. We use the Firebase Admin SDK to listen for real time updates and push data to the database.

## Files
* firebase admin sdk configuration: `firebase/admin.js`
* useEventStream React hook: `hooks/stream.js`
* Server Sent Event api: `pages/api/chat/index.js`
* Server that pushes messages to realtime database: `pages/api/chat/message.js`