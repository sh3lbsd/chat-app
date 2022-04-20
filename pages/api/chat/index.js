import realtime from 'firebase/admin';

/**
 * Api Route for streaming data from realtime database to the client
 * */
// Server configuration for streaming realtime updates to database using Server Sent Events
export default (request, response) => {
  // set required headers to be able to send Server Sent Events
  response.setHeader('Cache-Control', 'no-cache');
  response.setHeader('Content-Type', 'text/event-stream');
  // Bypasses buffering headers
  // needed for Server Sent Events to work
  response.flushHeaders();

  // function for streaming data to client
  function write(data, event = 'message') {
    response.write(`event: ${event}\n`);
    response.write(`data: ${JSON.stringify(data)}\n\n`);
    response.flush();
  }

  // function for sending errors to client if any are caught
  function error(error) {
    write({ error }, 'error');
  }

  // Get reference to /chat path
  const chat = realtime.ref('chat')
  // listen for updates to /chat path from realtime database
  // the 'on' callback (provided by the SDK) is called whenever the database gets updated
  chat.on('value', (data) => {
    // call write function to send data to the client
    write(data);
  });
};
